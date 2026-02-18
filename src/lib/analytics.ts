/**
 * Analytics wrapper for Microsoft Clarity
 *
 * All calls are no-ops when:
 * - User has opted out via Settings > Security > Help Improve Xcentro
 * - VITE_CLARITY_PROJECT_ID is not set (Clarity was never initialized)
 */
import Clarity from '@microsoft/clarity';

const isEnabled = (): boolean => localStorage.getItem('analytics-opt-out') !== 'true';

// Stored so setCustomPageId can call Clarity.identify without needing the caller to pass it again
let _userId: string = '';

/**
 * Identify the current user to Clarity.
 * Links session recordings to your internal user IDs so you can:
 * - Filter recordings by user
 * - Track cross-device journeys for the same user
 *
 * @param userId  Your internal user ID (hashed before leaving the browser)
 * @param name    Friendly display name shown in Clarity dashboard (not hashed)
 */
export const identifyUser = (userId: string, name?: string): void => {
  if (!isEnabled() || !userId) return;
  _userId = userId;
  Clarity.identify(userId, undefined, undefined, name);
};

/**
 * Set a human-readable page label for the current view.
 * Unlike the URL, this survives SPA navigation where the route doesn't change
 * but the content does (e.g. /new-payment showing quick vs payroll flow).
 *
 * Recorded as the customPageId in Clarity — visible in Recordings filters.
 * Call once per logical page/flow change.
 *
 * @param pageId  Short descriptive label, e.g. "bill-detail", "new-payment-payroll"
 */
export const setCustomPageId = (pageId: string): void => {
  if (!isEnabled() || !_userId) return;
  Clarity.identify(_userId, undefined, pageId);
};

/**
 * Attach a key-value tag to the current Clarity session.
 * Tags appear in Recordings, Heatmaps, and Dashboard filters.
 *
 * @param key    Tag name  (max 255 chars, max 128 unique tags per page)
 * @param value  Tag value (max 255 chars)
 */
export const setTag = (key: string, value: string): void => {
  if (!isEnabled()) return;
  Clarity.set(key, value);
};

/**
 * Fire a custom event to Clarity.
 * Events appear alongside Smart Events in Filters, Dashboard, and Recordings.
 * Max 20 custom events per project.
 *
 * @param eventName  Descriptive event name (e.g. "payment_initiated")
 */
export const trackEvent = (eventName: string): void => {
  if (!isEnabled()) return;
  Clarity.event(eventName);
};
