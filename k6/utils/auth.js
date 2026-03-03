import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL } from '../config.js';

/**
 * Build request params for an authenticated request.
 * Attaches the cookie jar + X-CSRF-Token header.
 * csrfToken is passed explicitly — extracted from the login Set-Cookie header.
 */
export function authParams(jar, csrfToken, extraHeaders) {
  return {
    jar,
    headers: {
      'Content-Type': 'application/json',
      ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
      ...(extraHeaders || {}),
    },
  };
}

/**
 * Logs in a user and returns { jar, userId, bid, csrfToken }.
 *
 * Cookie flags from the backend:
 *   access_token  — HttpOnly; Secure; SameSite=Lax  (jar sends automatically, cannot read)
 *   refresh_token — HttpOnly; Secure; SameSite=Lax  (jar sends automatically, cannot read)
 *   csrf_token    — Secure; SameSite=Lax            (NOT HttpOnly — readable, but Domain=xcentro.in)
 *
 * We extract csrf_token directly from the Set-Cookie response header because
 * jar.cookiesForURL() looks up staging-api.xcentro.in but the cookie is scoped
 * to Domain=xcentro.in, which may not match depending on k6 version.
 */
export function loginUser(creds) {
  const jar = http.cookieJar();

  const loginRes = http.post(
    `${BASE_URL}/v1/auth/login`,
    JSON.stringify({ email: creds.email, password: creds.password, calling_device: 'web' }),
    {
      jar,
      headers: { 'Content-Type': 'application/json' },
    }
  );

  check(loginRes, { 'login 200': r => r.status === 200 });
  if (loginRes.status !== 200) {
    console.error(`[loginUser] login failed status=${loginRes.status} body=${loginRes.body.substring(0, 300)}`);
    return { jar: null, userId: null, bid: null, csrfToken: null };
  }

  // Extract csrf_token from Set-Cookie header directly.
  // Handles both a single string and an array of strings (k6 may return either).
  let csrfToken = null;
  const setCookie = loginRes.headers['Set-Cookie'] || loginRes.headers['set-cookie'];
  if (setCookie) {
    const raw = Array.isArray(setCookie) ? setCookie.join('\n') : setCookie;
    const match = raw.match(/csrf_token=([^;]+)/);
    if (match) csrfToken = match[1].trim();
  }
  console.log(`[loginUser] csrf_token=${csrfToken}`);

  if (!csrfToken) {
    console.error(`[loginUser] csrf_token not found in Set-Cookie — all subsequent requests will fail CSRF check`);
    return { jar: null, userId: null, bid: null, csrfToken: null };
  }

  const sessionRes = http.get(
    `${BASE_URL}/v1/auth/verify-session`,
    authParams(jar, csrfToken)
  );

  check(sessionRes, { 'verify-session 200': r => r.status === 200 });
  if (sessionRes.status !== 200) {
    console.error(`[loginUser] verify-session failed status=${sessionRes.status} body=${sessionRes.body.substring(0, 300)}`);
    return { jar: null, userId: null, bid: null, csrfToken: null };
  }

  const data   = sessionRes.json('data');
  const userId = data.uid;
  const bid    = data.active_bid || (data.businesses && data.businesses[0] && data.businesses[0].bid);

  console.log(`[loginUser] OK userId=${userId} bid=${bid}`);
  return { jar, userId, bid, csrfToken };
}
