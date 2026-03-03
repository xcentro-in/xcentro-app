/**
 * manager_journey.js — Cross-user approval + payment flow
 *
 * One full iteration per VU:
 *   MANAGER: login → create voucher → request approval from admin → logout
 *   ADMIN:   login → find voucher in approval inbox → approve it →
 *            pay it → complete mock 3DS → verify → logout
 */

import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, ADMIN, MANAGER } from './config.js';
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

export function setup() {
  const { userId } = loginUser(ADMIN);
  console.log(`[setup] adminUserId=${userId}`);
  return { adminUserId: userId };
}

export default function (data) {
  const ADMIN_UID = data.adminUserId;
  const t = newTimer();

  // ════════════════════════════════════════════════════════════════════════════
  // PART 1 — MANAGER
  // ════════════════════════════════════════════════════════════════════════════

  const mgr = t.track('mgr_login', () => loginUser(MANAGER));
  if (!mgr.jar) {
    console.error(`[VU ${__VU}] Manager login failed — aborting`);
    return;
  }
  console.log(`[VU ${__VU}] Manager logged in. userId=${mgr.userId}`);

  const mgrVendorsRes = t.track('mgr_get_vendors', () =>
    http.get(`${BASE_URL}/v1/payees/vendors`, authParams(mgr.jar, mgr.csrfToken))
  );
  check(mgrVendorsRes, { '[mgr] get vendors 200': r => r.status === 200 });
  if (mgrVendorsRes.status !== 200) {
    console.error(`[STEP: mgr_get_vendors] status=${mgrVendorsRes.status} body=${mgrVendorsRes.body.substring(0, 300)}`);
    http.post(`${BASE_URL}/v1/auth/logout`, null, authParams(mgr.jar, mgr.csrfToken));
    return;
  }

  const mgrVendorsData = mgrVendorsRes.json('data');
  const mgrVendors     = (mgrVendorsData && mgrVendorsData.vendors) ? mgrVendorsData.vendors : [];
  if (mgrVendors.length === 0) {
    console.warn(`[VU ${__VU}] No vendors found — aborting`);
    http.post(`${BASE_URL}/v1/auth/logout`, null, authParams(mgr.jar, mgr.csrfToken));
    return;
  }
  const vendorId    = mgrVendors[(__VU - 1) % mgrVendors.length].relation_id;
  const amountINR   = Math.floor(Math.random() * 900 + 100);
  const amountPaisa = amountINR * 100;
  const uniqueRef   = `VU${__VU}-ITER${__ITER}-${Date.now()}`;
  console.log(`[VU ${__VU}] Manager using vendorId=${vendorId} amount=${amountINR} INR ref=${uniqueRef}`);

  const draftBody = JSON.stringify({
    relation_id:    vendorId,
    gross_amount:   amountPaisa,
    net_amount:     amountPaisa,
    invoice_number: `TEST-${uniqueRef}`,
    description:    `Load test voucher ${uniqueRef}`,
  });
  const draftRes = t.track('mgr_create_voucher', () =>
    http.post(`${BASE_URL}/v1/vouchers/draft`, draftBody, authParams(mgr.jar, mgr.csrfToken))
  );
  check(draftRes, { '[mgr] create voucher 2xx': r => r.status === 200 || r.status === 201 });
  if (draftRes.status !== 200 && draftRes.status !== 201) {
    console.error(`[STEP: mgr_create_voucher] status=${draftRes.status} body=${draftRes.body.substring(0, 300)}`);
    http.post(`${BASE_URL}/v1/auth/logout`, null, authParams(mgr.jar, mgr.csrfToken));
    return;
  }

  const voucherId = draftRes.json('data') && draftRes.json('data').voucher_id;
  if (!voucherId) {
    console.warn(`[VU ${__VU}] voucherId missing — aborting`);
    http.post(`${BASE_URL}/v1/auth/logout`, null, authParams(mgr.jar, mgr.csrfToken));
    return;
  }
  console.log(`[VU ${__VU}] Manager created voucherId=${voucherId}`);

  const reqApprovalRes = t.track('mgr_request_approval', () =>
    http.post(
      `${BASE_URL}/v1/vouchers/${voucherId}/request-approval`,
      JSON.stringify({ action: 'pending', approver_user_id: ADMIN_UID, remarks: '' }),
      authParams(mgr.jar, mgr.csrfToken)
    )
  );
  check(reqApprovalRes, { '[mgr] request approval 2xx': r => r.status === 200 || r.status === 201 });
  if (reqApprovalRes.status !== 200 && reqApprovalRes.status !== 201) {
    console.error(`[STEP: mgr_request_approval] status=${reqApprovalRes.status} body=${reqApprovalRes.body.substring(0, 300)}`);
  }

  t.track('mgr_logout', () =>
    http.post(`${BASE_URL}/v1/auth/logout`, null, authParams(mgr.jar, mgr.csrfToken))
  );
  console.log(`[VU ${__VU}] Manager logged out`);

  // ════════════════════════════════════════════════════════════════════════════
  // PART 2 — ADMIN
  // ════════════════════════════════════════════════════════════════════════════

  const adm = t.track('adm_login', () => loginUser(ADMIN));
  if (!adm.jar) {
    console.error(`[VU ${__VU}] Admin login failed — aborting`);
    return;
  }
  console.log(`[VU ${__VU}] Admin logged in. userId=${adm.userId}`);

  const inboxRes = t.track('adm_approval_inbox', () =>
    http.get(`${BASE_URL}/v1/vouchers/approval-inbox?status=pending`, authParams(adm.jar, adm.csrfToken))
  );
  check(inboxRes, { '[adm] approval inbox 200': r => r.status === 200 });
  if (inboxRes.status !== 200) {
    console.error(`[STEP: adm_approval_inbox] status=${inboxRes.status} body=${inboxRes.body.substring(0, 300)}`);
    http.post(`${BASE_URL}/v1/auth/logout`, null, authParams(adm.jar, adm.csrfToken));
    return;
  }

  const allPending = inboxRes.json('vouchers') || [];
  let targetVoucher = allPending.find(v => (v.invoice_number || '').includes(uniqueRef));
  if (!targetVoucher) {
    console.warn(`[VU ${__VU}] Own voucher not in inbox yet — falling back to first pending`);
    targetVoucher = allPending[0];
  }
  if (!targetVoucher) {
    console.warn(`[VU ${__VU}] No pending vouchers — skipping approval+payment`);
    http.post(`${BASE_URL}/v1/auth/logout`, null, authParams(adm.jar, adm.csrfToken));
    return;
  }
  const approveVoucherId = targetVoucher.voucher_id;
  console.log(`[VU ${__VU}] Admin approving voucherId=${approveVoucherId}`);

  const approveRes = t.track('adm_approve_voucher', () =>
    http.post(
      `${BASE_URL}/v1/vouchers/${approveVoucherId}/request-approval`,
      JSON.stringify({ approver_user_id: adm.userId, action: 'approved', remarks: '' }),
      authParams(adm.jar, adm.csrfToken)
    )
  );
  check(approveRes, { '[adm] approve voucher 2xx': r => r.status === 200 || r.status === 201 });
  if (approveRes.status !== 200 && approveRes.status !== 201) {
    console.error(`[STEP: adm_approve] status=${approveRes.status} body=${approveRes.body.substring(0, 300)}`);
  }
  console.log(`[VU ${__VU}] Admin approved voucherId=${approveVoucherId}`);

  const sourcesRes = t.track('adm_get_sources', () =>
    http.post(
      `${BASE_URL}/v1/process_payment/get_payment_sources_with_fees`,
      JSON.stringify({ payment_context: 'vendor_payment', base_amount: amountPaisa }),
      authParams(adm.jar, adm.csrfToken)
    )
  );
  check(sourcesRes, { '[adm] get sources 200': r => r.status === 200 });
  if (sourcesRes.status !== 200) {
    console.error(`[STEP: adm_get_sources] status=${sourcesRes.status} body=${sourcesRes.body.substring(0, 300)}`);
    http.post(`${BASE_URL}/v1/auth/logout`, null, authParams(adm.jar, adm.csrfToken));
    return;
  }

  const sourcesData    = sourcesRes.json('data');
  const allSources     = (sourcesData && sourcesData.sources) ? sourcesData.sources : [];
  const allowedSources = allSources.filter(s => s.is_allowed);
  const sourcePool     = allowedSources.length > 0 ? allowedSources : allSources;
  const sourceId       = sourcePool.length > 0 ? sourcePool[(__VU - 1) % sourcePool.length].source_id : null;
  if (!sourceId) {
    console.warn(`[VU ${__VU}] No payment source — skipping payment`);
    http.post(`${BASE_URL}/v1/auth/logout`, null, authParams(adm.jar, adm.csrfToken));
    return;
  }

  const payRes = t.track('adm_make_payment', () =>
    http.post(
      `${BASE_URL}/v1/process_payment/make_payment`,
      JSON.stringify({
        amount: amountPaisa, currency: 'INR', payment_method: 'token_card',
        calling_device: 'web', voucher_ids: [approveVoucherId], token_details: { card_id: sourceId },
      }),
      authParams(adm.jar, adm.csrfToken)
    )
  );
  check(payRes, { '[adm] make payment 2xx': r => r.status === 200 || r.status === 201 });
  if (payRes.status !== 200 && payRes.status !== 201) {
    console.error(`[STEP: adm_make_payment] status=${payRes.status} body=${payRes.body.substring(0, 300)}`);
  }

  const payData = payRes.json('data');
  if (payData && payData.redirect_url) {
    console.log(`[VU ${__VU}] Admin: redirect_url received — completing mock 3DS`);
    t.track('adm_mock_3ds', () => completeMock3DS(payData.redirect_url, adm.jar));
  }

  const calRes = t.track('adm_calendar', () =>
    http.get(`${BASE_URL}/v1/vouchers/calendar?year=2026&month=3`, authParams(adm.jar, adm.csrfToken))
  );
  check(calRes, { '[adm] calendar 200': r => r.status === 200 });
  if (calRes.status !== 200) console.error(`[STEP: adm_calendar] status=${calRes.status} body=${calRes.body.substring(0, 300)}`);

  const dashRes = t.track('adm_dashboard', () =>
    http.get(`${BASE_URL}/v1/dashboard`, authParams(adm.jar, adm.csrfToken))
  );
  check(dashRes, { '[adm] dashboard 200': r => r.status === 200 });
  if (dashRes.status !== 200) console.error(`[STEP: adm_dashboard] status=${dashRes.status} body=${dashRes.body.substring(0, 300)}`);

  const listRes = t.track('adm_payment_list', () =>
    http.get(`${BASE_URL}/v1/process_payment/list?limit=10&offset=0`, authParams(adm.jar, adm.csrfToken))
  );
  check(listRes, { '[adm] payment list 200': r => r.status === 200 });
  if (listRes.status !== 200) console.error(`[STEP: adm_payment_list] status=${listRes.status} body=${listRes.body.substring(0, 300)}`);

  const logoutRes = t.track('adm_logout', () =>
    http.post(`${BASE_URL}/v1/auth/logout`, null, authParams(adm.jar, adm.csrfToken))
  );
  check(logoutRes, { '[adm] logout 2xx': r => r.status === 200 || r.status === 204 });

  t.summary(__VU, __ITER);
  console.log(`[VU ${__VU}] Admin logged out — iteration complete`);
}
