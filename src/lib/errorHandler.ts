/**
 * Centralized Error Handler
 *
 * Automatically displays toast notifications for API errors from the server.
 * Integrates with ApiService to provide consistent error messaging across the app.
 */
import { toast } from 'sonner';

export interface ServerErrorResponse {
  error: string | null;
  message: string;
  [key: string]: any; // Allow other fields
}

/**
 * Check if response contains a server error that should be displayed
 *
 * Conditions:
 * - Must be a non-2xx response (status >= 300 or status < 200)
 * - Must have 'error' key that is not null and not empty string
 * - Must have 'message' key with user-facing message
 */
export function shouldDisplayServerError(
  responseData: any,
  status: number
): boolean {
  // Only process non-2xx responses
  if (status >= 200 && status < 300) {
    return false;
  }

  // Check if response has required error structure
  if (!responseData || typeof responseData !== 'object') {
    return false;
  }

  // Must have 'error' key that is not null and not empty string
  const hasError = 'error' in responseData &&
                   responseData.error !== null &&
                   responseData.error !== '';

  // Must have 'message' key
  const hasMessage = 'message' in responseData &&
                     typeof responseData.message === 'string';

  return hasError && hasMessage;
}

/**
 * Display server error message via toast
 */
export function displayServerError(message: string): void {
  toast.error(message);
}

/**
 * Display network error (fallback for non-API errors like timeouts, DNS failures)
 */
export function displayNetworkError(): void {
  toast.error('Network error. Please try again.');
}

/**
 * Handle error response - central decision point for error display
 *
 * Returns true if error was handled (toast shown), false otherwise
 *
 * @param errorData - Error response data from server
 * @param status - HTTP status code
 * @param errorCode - Optional error code from response
 */
export function handleErrorResponse(
  errorData: any,
  status: number,
  errorCode?: string
): boolean {
  // Skip special error codes that are handled elsewhere
  // These have their own toast notifications or UI displays
  const specialCodes = [
    'TOKEN_EXPIRED',           // Silent auto-refresh
    'SESSION_INVALIDATED',     // Shows toast.info in api.ts
    'REFRESH_TOKEN_EXPIRED',   // Shows toast.info in api.ts
    'MISSING_TOKEN',           // Silent, emits custom event
    'INVALID_TOKEN',           // Silent, emits custom event
    'SESSION_EXPIRED',         // Already handled by session management
    'rate_limited'             // Handled by rateLimitManager (popup UI)
  ];

  if (errorCode && specialCodes.includes(errorCode)) {
    return false; // Don't show toast, existing handlers will manage
  }

  // Check if server provided displayable error
  if (shouldDisplayServerError(errorData, status)) {
    displayServerError(errorData.message);
    return true;
  }

  return false;
}
