import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL } from '../config.js';

/**
 * Completes the mock 3DS flow for staging.
 *
 * How it works (from the Go backend source):
 *
 *   make_payment response contains:
 *     { data: { redirect_url: "<BASE_URL>/v1/process_payment/mock_3ds
 *                              ?transaction_id=<id>
 *                              &gateway_payment_id=<id>
 *                              &amount=<paise>" } }
 *
 *   HandleMock3DSPage (GET /v1/process_payment/mock_3ds) serves the HTML page.
 *   The page hardcodes callbackURL = serverURL + "/v1/process_payment/callback?type=mockpg"
 *
 *   On "Simulate Success" the browser POSTs to that callbackURL with:
 *     Content-Type: application/x-www-form-urlencoded
 *     body: payload=<json>
 *
 *   where payload is:
 *     {
 *       merchant_id:        "MOCK_MERCHANT_123",
 *       transaction_id:     <from query param>,
 *       gateway_payment_id: <from query param>,
 *       status:             "success",
 *       amount:             <paise as integer>,
 *       currency:           "INR",
 *       payment_method:     "card",
 *       processed_at:       <ISO timestamp>,
 *       signature:          "MOCK_SIG_<random>"
 *     }
 *
 * We extract transaction_id, gateway_payment_id, amount directly from the
 * redirect_url query string — no need to parse the HTML.
 *
 * @param {string} redirectUrl  - The redirect_url from make_payment response
 * @param {object} jar          - k6 CookieJar for the session
 * @returns {boolean}           - true if callback was accepted
 */
export function completeMock3DS(redirectUrl, jar) {
  // ── Step 1: Parse query params from the redirect URL ─────────────────────────
  // redirect_url shape: <BASE_URL>/v1/process_payment/mock_3ds
  //                     ?transaction_id=X&gateway_payment_id=Y&amount=Z
  // k6 has no URL/URLSearchParams — extract with regex
  const txnMatch  = redirectUrl.match(/[?&]transaction_id=([^&]+)/);
  const gwMatch   = redirectUrl.match(/[?&]gateway_payment_id=([^&]+)/);
  const amtMatch  = redirectUrl.match(/[?&]amount=([^&]+)/);

  const transactionID    = txnMatch  ? txnMatch[1]  : null;
  const gatewayPaymentID = gwMatch   ? gwMatch[1]   : null;
  const amountPaisa      = amtMatch  ? parseInt(amtMatch[1], 10) : 0;

  if (!transactionID || !gatewayPaymentID) {
    console.error(`[mock3DS] Missing params in redirect_url: ${redirectUrl}`);
    return false;
  }
  console.log(`[VU ${__VU}] mock3DS transactionID=${transactionID} gatewayPaymentID=${gatewayPaymentID} amount=${amountPaisa}`);

  // ── Step 2: GET the mock 3DS page (simulates browser navigation) ──────────────
  const pageRes = http.get(redirectUrl, { jar });
  check(pageRes, { '3ds page 200': r => r.status === 200 });
  if (pageRes.status !== 200) {
    console.error(`[mock3DS] Page load failed status=${pageRes.status} body=${pageRes.body.substring(0, 300)}`);
    return false;
  }

  // ── Step 3: POST to the callback — simulates clicking "Simulate Success" ──────
  // callbackURL is hardcoded in the Go handler as:
  //   serverURL + "/v1/process_payment/callback?type=mockpg"
  const callbackURL = `${BASE_URL}/v1/process_payment/callback?type=mockpg`;

  const webhookPayload = JSON.stringify({
    merchant_id:        'MOCK_MERCHANT_123',
    transaction_id:     transactionID,
    gateway_payment_id: gatewayPaymentID,
    status:             'success',
    amount:             amountPaisa,
    currency:           'INR',
    payment_method:     'card',
    processed_at:       new Date().toISOString(),
    signature:          `MOCK_SIG_${Math.random().toString(36).substring(7)}`,
  });

  // Browser does form.submit() → application/x-www-form-urlencoded, field name "payload"
  const callbackRes = http.post(
    callbackURL,
    { payload: webhookPayload },  // k6 encodes this as form data automatically
    { jar }
  );
  check(callbackRes, { '3ds callback 2xx': r => r.status < 300 });

  if (callbackRes.status >= 300) {
    console.error(`[mock3DS] Callback failed status=${callbackRes.status} body=${callbackRes.body.substring(0, 300)}`);
    return false;
  }

  console.log(`[VU ${__VU}] mock3DS callback accepted status=${callbackRes.status}`);
  return true;
}
