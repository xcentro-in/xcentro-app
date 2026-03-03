import http from 'k6/http';
import { check } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { BASE_URL, ADMIN } from './config.js';
import { loginUser, authParams } from './utils/auth.js';
import { completeMock3DS } from './utils/mock3ds.js';
import { newTimer } from './utils/timing.js';

export const options = {
  vus: 10,
  duration: '5m',
  thresholds: {
    http_req_failed:   ['rate<0.20'],
    http_req_duration: ['p(95)<8000'],
  },
};

export default function () {
  const t = newTimer();

  // ── Step 1: Login ─────────────────────────────────────────────────────────────
  const { jar, userId, bid, csrfToken } = t.track('login', () => loginUser(ADMIN));
  if (!jar) {
    console.error(`[VU ${__VU}] Login failed — aborting iteration`);
    return;
  }
  console.log(`[VU ${__VU}] Logged in. userId=${userId} bid=${bid}`);

  // ── Step 2: Get vendors ───────────────────────────────────────────────────────
  const vendorsRes = t.track('get_vendors', () =>
    http.get(`${BASE_URL}/v1/payees/vendors`, authParams(jar, csrfToken))
  );
  if (vendorsRes.status !== 200) {
    console.error(`[STEP: get_vendors] status=${vendorsRes.status} body=${vendorsRes.body.substring(0, 300)}`);
  }
  check(vendorsRes, { 'get vendors 200': r => r.status === 200 });

  const vendorsData = vendorsRes.json('data');
  const vendors     = (vendorsData && vendorsData.vendors) ? vendorsData.vendors : [];
  if (vendors.length === 0) {
    console.warn(`[VU ${__VU}] No vendors found — skipping payment steps`);
    http.post(`${BASE_URL}/v1/auth/logout`, null, authParams(jar, csrfToken));
    return;
  }

  const vendorIdx = (__VU - 1) % vendors.length;
  const vendorId  = vendors[vendorIdx].relation_id;
  console.log(`[VU ${__VU}] vendorIdx=${vendorIdx} vendorId=${vendorId}`);

  // ── Step 3: Randomize amount ──────────────────────────────────────────────────
  const amountINR   = randomIntBetween(100, 1000);
  const amountPaisa = amountINR * 100;

  // ── Step 4: Create draft voucher ─────────────────────────────────────────────
  const uniqueRef = `VU${__VU}-ITER${__ITER}-${Date.now()}`;
  const draftBody = JSON.stringify({
    relation_id:    vendorId,
    gross_amount:   amountPaisa,
    net_amount:     amountPaisa,
    invoice_number: `TEST-${uniqueRef}`,
    description:    `Load test voucher ${uniqueRef}`,
  });
  const draftRes = t.track('create_voucher', () =>
    http.post(`${BASE_URL}/v1/vouchers/draft`, draftBody, authParams(jar, csrfToken))
  );
  if (draftRes.status !== 200 && draftRes.status !== 201) {
    console.error(`[STEP: create_voucher] status=${draftRes.status} body=${draftRes.body.substring(0, 300)}`);
  }
  check(draftRes, { 'create voucher 2xx': r => r.status === 200 || r.status === 201 });

  const draftData = draftRes.json('data');
  const voucherId = draftData && draftData.voucher_id;
  if (!voucherId) {
    console.warn(`[VU ${__VU}] voucherId missing — skipping payment`);
    http.post(`${BASE_URL}/v1/auth/logout`, null, authParams(jar, csrfToken));
    return;
  }
  console.log(`[VU ${__VU}] voucherId=${voucherId} ref=${uniqueRef} amount=${amountINR} INR`);

  // ── Step 5: Get payment sources with fees ─────────────────────────────────────
  const sourcesBody = JSON.stringify({ payment_context: 'vendor_payment', base_amount: amountPaisa });
  const sourcesRes  = t.track('get_sources', () =>
    http.post(`${BASE_URL}/v1/process_payment/get_payment_sources_with_fees`, sourcesBody, authParams(jar, csrfToken))
  );
  if (sourcesRes.status !== 200) {
    console.error(`[STEP: get_sources] status=${sourcesRes.status} body=${sourcesRes.body.substring(0, 300)}`);
  }
  check(sourcesRes, { 'get sources 200': r => r.status === 200 });

  const sourcesData    = sourcesRes.json('data');
  const allSources     = (sourcesData && sourcesData.sources) ? sourcesData.sources : [];
  const allowedSources = allSources.filter(s => s.is_allowed);
  const sourcePool     = allowedSources.length > 0 ? allowedSources : allSources;
  const sourceId       = sourcePool.length > 0
    ? sourcePool[(__VU - 1) % sourcePool.length].source_id
    : null;
  if (!sourceId) {
    console.warn(`[VU ${__VU}] No payment source found — skipping payment`);
    http.post(`${BASE_URL}/v1/auth/logout`, null, authParams(jar, csrfToken));
    return;
  }
  console.log(`[VU ${__VU}] sourceId=${sourceId}`);

  // ── Step 6: Make payment ──────────────────────────────────────────────────────
  const payBody = JSON.stringify({
    amount: amountPaisa, currency: 'INR', payment_method: 'token_card',
    calling_device: 'web', voucher_ids: [voucherId], token_details: { card_id: sourceId },
  });
  const payRes = t.track('make_payment', () =>
    http.post(`${BASE_URL}/v1/process_payment/make_payment`, payBody, authParams(jar, csrfToken))
  );
  if (payRes.status !== 200 && payRes.status !== 201) {
    console.error(`[STEP: make_payment] status=${payRes.status} body=${payRes.body.substring(0, 300)}`);
  }
  check(payRes, { 'make payment 2xx': r => r.status === 200 || r.status === 201 });

  // ── Step 7: Mock 3DS ──────────────────────────────────────────────────────────
  const payData = payRes.json('data');
  if (payData && payData.redirect_url) {
    console.log(`[VU ${__VU}] redirect_url received — completing mock 3DS`);
    t.track('mock_3ds', () => completeMock3DS(payData.redirect_url, jar));
  }

  // ── Step 9: Approval inbox ────────────────────────────────────────────────────
  const inboxRes = t.track('approval_inbox', () =>
    http.get(`${BASE_URL}/v1/vouchers/approval-inbox?status=pending`, authParams(jar, csrfToken))
  );
  if (inboxRes.status !== 200) {
    console.error(`[STEP: approval_inbox] status=${inboxRes.status} body=${inboxRes.body.substring(0, 300)}`);
  }
  check(inboxRes, { 'approval inbox 200': r => r.status === 200 });

  // ── Step 10: Approve pending vouchers ─────────────────────────────────────────
  const allPending = inboxRes.json('vouchers') || [];
  const myPending  = allPending.filter(v => (v.invoice_number || '').includes(`VU${__VU}-ITER${__ITER}`));
  const toApprove  = myPending.slice(0, 3);
  if (toApprove.length === 0 && allPending.length > 0) {
    console.warn(`[VU ${__VU}] No own vouchers in inbox yet — falling back to first pending`);
    toApprove.push(...allPending.slice(0, 1));
  }
  for (const item of toApprove) {
    const itemId      = item.voucher_id;
    const approveBody = JSON.stringify({ approver_user_id: userId, action: 'approved', remarks: '' });
    const approveRes  = t.track(`approve_voucher_${itemId.slice(-4)}`, () =>
      http.post(`${BASE_URL}/v1/vouchers/${itemId}/request-approval`, approveBody, authParams(jar, csrfToken))
    );
    if (approveRes.status !== 200 && approveRes.status !== 201) {
      console.error(`[STEP: approve_voucher] id=${itemId} status=${approveRes.status} body=${approveRes.body.substring(0, 300)}`);
    }
    check(approveRes, { 'approve voucher 2xx': r => r.status === 200 || r.status === 201 });
  }

  // ── Step 12: Calendar ─────────────────────────────────────────────────────────
  const calRes = t.track('calendar', () =>
    http.get(`${BASE_URL}/v1/vouchers/calendar?year=2026&month=3`, authParams(jar, csrfToken))
  );
  if (calRes.status !== 200) console.error(`[STEP: calendar] status=${calRes.status} body=${calRes.body.substring(0, 300)}`);
  check(calRes, { 'calendar 200': r => r.status === 200 });

  // ── Step 13: Dashboard ────────────────────────────────────────────────────────
  const dashRes = t.track('dashboard', () =>
    http.get(`${BASE_URL}/v1/dashboard`, authParams(jar, csrfToken))
  );
  if (dashRes.status !== 200) console.error(`[STEP: dashboard] status=${dashRes.status} body=${dashRes.body.substring(0, 300)}`);
  check(dashRes, { 'dashboard 200': r => r.status === 200 });

  // ── Step 14: Payment list ─────────────────────────────────────────────────────
  const listRes = t.track('payment_list', () =>
    http.get(`${BASE_URL}/v1/process_payment/list?limit=10&offset=0`, authParams(jar, csrfToken))
  );
  if (listRes.status !== 200) console.error(`[STEP: payment_list] status=${listRes.status} body=${listRes.body.substring(0, 300)}`);
  check(listRes, { 'payment list 200': r => r.status === 200 });

  // ── Step 15: Logout ───────────────────────────────────────────────────────────
  const logoutRes = t.track('logout', () =>
    http.post(`${BASE_URL}/v1/auth/logout`, null, authParams(jar, csrfToken))
  );
  check(logoutRes, { 'logout 2xx': r => r.status === 200 || r.status === 204 });

  t.summary(__VU, __ITER);
}
