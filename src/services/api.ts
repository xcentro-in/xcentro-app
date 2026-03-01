/**
 * API Service Layer
 *
 * Features:
 * - Automatic access token refresh with promise caching (prevents race conditions)
 * - Session expiration handling
 * - Rate limiting detection
 * - Cookie-based authentication (httpOnly cookies)
 * - Custom event emission for auth state changes
 */
import { toast } from 'sonner';

import { rateLimitManager } from '@/lib/rateLimitManager';
import { turnstileManager } from '@/services/turnstileManager';
import { handleErrorResponse, displayNetworkError } from '@/lib/errorHandler';

const API_BASE_URL = import.meta.env.VITE_API_URL

class ApiService {
  private baseUrl: string;
  private authToken?: string;
  private refreshPromise: Promise<boolean> | null = null;
  private isSessionExpired: boolean = false;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Add method to update auth token
  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  /**
   * Refresh access token using refresh token stored in httpOnly cookie
   * Uses promise caching to prevent multiple simultaneous refresh attempts
   */
  private async refreshAccessToken(): Promise<boolean> {
    // If refresh is already in progress, wait for it
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // Start new refresh and cache the promise
    this.refreshPromise = (async () => {
      try {
        const refreshResponse = await fetch(`${this.baseUrl}/v1/auth/refresh`, {
          method: 'POST',
          credentials: 'include', // Include cookies for refresh
        });

        if (refreshResponse.ok) {
          // Success - new access token cookie set by backend
          return true;
        } else {
          // Refresh failed - session expired
          return false;
        }
      } catch (error) {
        console.error('[ApiService] Token refresh failed:', error);
        return false;
      } finally {
        // Clear the promise cache after completion
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /**
   * Handle session expiration - clear local state and emit event
   * Uses guard flag to prevent multiple emissions
   */
  private handleSessionExpired(): void {
    // Guard: Only emit event once per session
    if (this.isSessionExpired) {
      console.log('[ApiService] Session already marked as expired, skipping duplicate event');
      return;
    }

    console.log('[ApiService] Session expired, clearing state');
    this.isSessionExpired = true;

    // Clear local storage
    localStorage.removeItem('auth-token');
    this.authToken = null;

    // Emit event for AuthContext to handle cleanup (only once)
    window.dispatchEvent(new CustomEvent('api:session-expired'));
  }

  /**
   * Reset session expired flag (called after successful login)
   */
  resetSessionState(): void {
    this.isSessionExpired = false;
  }

  /**
   * Read CSRF token from csrf_token cookie
   * @returns CSRF token value or null if not found
   */
  private getCSRFToken(): string | null {
    const cookies = document.cookie.split(';');

    console.log('[ApiService] All cookies:', document.cookie);

    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'csrf_token') {
        console.log('[ApiService] Found CSRF token:', value);
        return decodeURIComponent(value);
      }
    }

    console.warn('[ApiService] CSRF token not found in cookies. This may be because the csrf_token cookie has HttpOnly=true flag, which prevents JavaScript from reading it.');
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit & { requireTurnstile?: boolean } = {},
    isRetry: boolean = false,
    setContentType: boolean = true,
    contentType: string = 'application/json'
  ): Promise<T> {
    // Guard: If session already expired, reject immediately
    if (this.isSessionExpired) {
      const error: any = new Error('Session expired. Please login again.');
      error.code = 'SESSION_EXPIRED';
      error.status = 401;
      throw error;
    }

    // Use instance token if available, fallback to localStorage
    const token = this.authToken || localStorage.getItem('auth-token');

    // Build headers
    const headers: Record<string, string> = {
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };

    // CSRF protection: Add X-CSRF-Token header if cookie is present
    const csrfToken = this.getCSRFToken();
    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
      console.log('[ApiService] Added X-CSRF-Token header for', endpoint);
    } else {
      console.warn('[ApiService] No CSRF token available for', endpoint);
    }

    // Turnstile integration: Add CF-Turnstile-Token header if explicitly requested
    if (options.requireTurnstile && turnstileManager.isEnabled()) {
      try {
        console.log(`[ApiService] Generating Turnstile token for ${endpoint}`);
        const turnstileToken = await turnstileManager.getToken();
        headers['CF-Turnstile-Token'] = turnstileToken;
      } catch (error) {
        console.error('[ApiService] Turnstile token generation failed:', error);

        const turnstileError: any = new Error(
          'Security verification failed. Please refresh and try again.'
        );
        turnstileError.code = 'TURNSTILE_VERIFICATION_FAILED';
        turnstileError.status = 403;
        throw turnstileError;
      }
    }
    // Handle Content-Type based on setContentType parameter
    // - If true: accept whatever caller provides in headers (or none for file uploads)
    // - If false: use the contentType parameter (defaults to 'application/json')
    if (setContentType) {
      headers['Content-Type'] = contentType;
    }

    // Merge caller's headers AFTER defaults (caller's headers take precedence)
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    const config: RequestInit = {
      ...options,
      headers,
      credentials: 'include', // Include cookies in requests
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Handle 429 errors - rate limiting
        if (response.status === 429) {
          const retryAfterSecs = errorData.retry_after_secs || 60;
          const scope = errorData.scope || 'unknown';
          const policyGroup = errorData.policy_group || 'default';

          rateLimitManager.addError({
            retryAfterSecs,
            scope,
            policyGroup,
          });

          const error: any = new Error(
            `Too many requests. Please wait ${retryAfterSecs} seconds before trying again.`
          );
          error.code = 'rate_limited';
          error.status = 429;
          error.retryAfter = retryAfterSecs;
          throw error;
        }

        // Handle 403 errors - Turnstile verification failures
        if (response.status === 403 && errorData.error === 'TURNSTILE_VERIFICATION_FAILED') {
          console.warn('[ApiService] Turnstile verification failed from backend');

          // Reset widget to allow retry
          turnstileManager.reset();

          const error: any = new Error(
            errorData.message || 'Security verification failed'
          );
          error.code = 'TURNSTILE_VERIFICATION_FAILED';
          error.status = 403;
          throw error;
        }

        // Handle 401 errors - authentication failures
        if (response.status === 401) {
          // TOKEN_EXPIRED: Access token expired, try refresh
          if (!isRetry && errorData.error === 'TOKEN_EXPIRED') {
            const refreshSucceeded = await this.refreshAccessToken();

            if (refreshSucceeded) {
              // Retry original request with new token
              return this.request<T>(endpoint, options, true, setContentType, contentType);
            } else {
              // Refresh failed - session expired
              this.handleSessionExpired();
              const error: any = new Error('Session expired. Please login again.');
              error.code = 'SESSION_EXPIRED';
              error.status = 401;
              throw error;
            }
          } else if (errorData.error === 'SESSION_INVALIDATED' || errorData.error === 'REFRESH_TOKEN_EXPIRED') {
            // Session invalidated (logged out from another device) or refresh token expired
            this.handleSessionExpired();

            // Show appropriate toast notification
            if (errorData.error === 'SESSION_INVALIDATED') {
              toast.info('You’ve signed in on another device. You’ve been logged out here.');
            } else {
              toast.info('Your session has expired. Please login again.');
            }

            const error: any = new Error('Session expired. Please login again.');
            error.code = 'SESSION_EXPIRED';
            error.status = 401;
            throw error;
          } else if (errorData.error === 'MISSING_TOKEN' || errorData.error === 'INVALID_TOKEN') {
            // No valid auth - emit event for AuthContext to handle
            window.dispatchEvent(new CustomEvent('api:unauthorized', {
              detail: { code: errorData.error, message: errorData.message }
            }));

            const error: any = new Error(errorData.message || 'Authentication required');
            error.code = errorData.error;
            error.status = response.status;
            throw error;
          }
        }

        // For all other errors, show toast if applicable and throw
        const error: any = new Error(errorData.message || `HTTP ${response.status}`);
        error.code = errorData.error;
        error.status = response.status;

        // Show toast if this is a displayable server error (skips auth/rate-limit errors)
        handleErrorResponse(errorData, response.status, errorData.error);

        throw error;
      }

      return response.json();
    } catch (error) {
      // Check if this is a network error (not an API error we already handled)
      const isNetworkError = error instanceof TypeError ||
        (error instanceof Error && !error.hasOwnProperty('status'));

      if (isNetworkError) {
        displayNetworkError();
      }

      // Only log non-auth errors
      if (error instanceof Error && !(error as any).code?.includes('MISSING_TOKEN')) {
        console.error('[ApiService] Request failed:', error);
      }
      throw error;
    }
  }

  /**
   * Request method for blob responses (PDFs, images, etc.)
   * Inherits all authentication, token refresh, and error handling from base request
   */
  private async requestBlob(
    endpoint: string,
    options: RequestInit & { requireTurnstile?: boolean } = {},
    isRetry: boolean = false
  ): Promise<Blob> {
    // Guard: If session already expired, reject immediately
    if (this.isSessionExpired) {
      const error: any = new Error('Session expired. Please login again.');
      error.code = 'SESSION_EXPIRED';
      error.status = 401;
      throw error;
    }

    // Use instance token if available, fallback to localStorage
    const token = this.authToken || localStorage.getItem('auth-token');

    // Build headers (no Content-Type for blob downloads)
    const headers: Record<string, string> = {
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };

    // CSRF protection: Add X-CSRF-Token header if cookie is present
    const csrfToken = this.getCSRFToken();
    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
      console.log('[ApiService] Added X-CSRF-Token header for', endpoint);
    } else {
      console.warn('[ApiService] No CSRF token available for', endpoint);
    }

    // Turnstile integration: Add CF-Turnstile-Token header if explicitly requested
    if (options.requireTurnstile && turnstileManager.isEnabled()) {
      try {
        console.log(`[ApiService] Generating Turnstile token for ${endpoint}`);
        const turnstileToken = await turnstileManager.getToken();
        headers['CF-Turnstile-Token'] = turnstileToken;
      } catch (error) {
        console.error('[ApiService] Turnstile token generation failed:', error);

        const turnstileError: any = new Error(
          'Security verification failed. Please refresh and try again.'
        );
        turnstileError.code = 'TURNSTILE_VERIFICATION_FAILED';
        turnstileError.status = 403;
        throw turnstileError;
      }
    }

    // Merge caller's headers AFTER defaults
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    const config: RequestInit = {
      ...options,
      headers,
      credentials: 'include',
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Handle 429 errors - rate limiting
        if (response.status === 429) {
          const retryAfterSecs = errorData.retry_after_secs || 60;
          const scope = errorData.scope || 'unknown';
          const policyGroup = errorData.policy_group || 'default';

          rateLimitManager.addError({
            retryAfterSecs,
            scope,
            policyGroup,
          });

          const error: any = new Error(
            `Too many requests. Please wait ${retryAfterSecs} seconds before trying again.`
          );
          error.code = 'rate_limited';
          error.status = 429;
          error.retryAfter = retryAfterSecs;
          throw error;
        }

        // Handle 403 errors - Turnstile verification failures
        if (response.status === 403 && errorData.error === 'TURNSTILE_VERIFICATION_FAILED') {
          console.warn('[ApiService] Turnstile verification failed from backend');

          // Reset widget to allow retry
          turnstileManager.reset();

          const error: any = new Error(
            errorData.message || 'Security verification failed'
          );
          error.code = 'TURNSTILE_VERIFICATION_FAILED';
          error.status = 403;
          throw error;
        }

        // Handle 401 errors - authentication failures
        if (response.status === 401) {
          // TOKEN_EXPIRED: Access token expired, try refresh
          if (!isRetry && errorData.error === 'TOKEN_EXPIRED') {
            const refreshSucceeded = await this.refreshAccessToken();

            if (refreshSucceeded) {
              // Retry original request with new token
              return this.requestBlob(endpoint, options, true);
            } else {
              // Refresh failed - session expired
              this.handleSessionExpired();
              const error: any = new Error('Session expired. Please login again.');
              error.code = 'SESSION_EXPIRED';
              error.status = 401;
              throw error;
            }
          } else if (errorData.error === 'SESSION_INVALIDATED' || errorData.error === 'REFRESH_TOKEN_EXPIRED') {
            // Session invalidated (logged out from another device) or refresh token expired
            this.handleSessionExpired();

            // Show appropriate toast notification
            if (errorData.error === 'SESSION_INVALIDATED') {
              toast.info('Login detected from another device. Logging you out here.');
            } else {
              toast.info('Your session has expired. Please login again.');
            }

            const error: any = new Error('Session expired. Please login again.');
            error.code = 'SESSION_EXPIRED';
            error.status = 401;
            throw error;
          } else if (errorData.error === 'MISSING_TOKEN' || errorData.error === 'INVALID_TOKEN') {
            // No valid auth - emit event for AuthContext to handle
            window.dispatchEvent(new CustomEvent('api:unauthorized', {
              detail: { code: errorData.error, message: errorData.message }
            }));

            const error: any = new Error(errorData.message || 'Authentication required');
            error.code = errorData.error;
            error.status = response.status;
            throw error;
          }
        }

        // For all other errors, show toast if applicable and throw
        const error: any = new Error(errorData.message || `HTTP ${response.status}`);
        error.code = errorData.error;
        error.status = response.status;

        // Show toast if this is a displayable server error (skips auth/rate-limit errors)
        handleErrorResponse(errorData, response.status, errorData.error);

        throw error;
      }

      return response.blob();
    } catch (error) {
      // Check if this is a network error (not an API error we already handled)
      const isNetworkError = error instanceof TypeError ||
        (error instanceof Error && !error.hasOwnProperty('status'));

      if (isNetworkError) {
        displayNetworkError();
      }

      // Only log non-auth errors
      if (error instanceof Error && !(error as any).code?.includes('MISSING_TOKEN')) {
        console.error('[ApiService] Blob request failed:', error);
      }
      throw error;
    }
  }

  // Auth endpoints - TODO: Implement when backend is ready
  auth = {
    login: async (email: string, password: string, callingDevice: 'web' | 'mobile' = 'web'): Promise<{
      message: string;
    }> => {
      this.resetSessionState();

      return this.request('/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, calling_device: callingDevice }),
        requireTurnstile: true,
      });
    },

    verifySession: async (): Promise<{
      message: string;
      data: {
        uid: string;
        kyc_status: string;
        businesses: Array<{
          bid: string;
          name: string;
          role: string;
          kyb_status: string;
        }>;
        active_bid: string;
      };
    }> => {
      return this.request('/v1/auth/verify-session', {
        method: 'GET',
      });
    },

    refresh: async (): Promise<boolean> => {
      return this.refreshAccessToken();
    },

    switchBusiness: async (targetBid: string): Promise<{
      message: string;
      data: {
        bid: string;
        role: string;
        kyb_status: string;
      };
    }> => {
      return this.request('/v1/auth/switch-business', {
        method: 'POST',
        body: JSON.stringify({ bid: targetBid }),
      });
    },

    signup: async (email: string, password: string): Promise<{ data: { userId: string }, message: string }> => {
      return this.request('/v1/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        requireTurnstile: true, // Bot protection for signup
      });
    },

    logout: async (): Promise<{ message: string }> => {
      return this.request('/v1/auth/logout', {
        method: 'POST',
      });
    },

    forgotPassword: async (email: string): Promise<{ message: string }> => {
      return this.request(`/v1/auth/forgot-password?email=${email}`, {
        method: 'GET',
      });
    },

    resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
      return this.request('/v1/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword }),
        requireTurnstile: true,
      });
    },

    getOnboardingStatus: async (): Promise<any> => {
      return this.request('/v1/auth/onboarding-status', {
        method: 'GET',
      });
    },

    verifyEmail: async (token: string): Promise<{
      data: null;
      message: string;
    }> => {
      return this.request('/v1/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ token }),
        requireTurnstile: true,
      });
    },

    // Mobile verification endpoints
    verifyEmailWithMobile: async (
      uid: string,
      token: string,
      sig: string,
      mobileNumber: string
    ): Promise<{
      data: null;
      message: string;
    }> => {
      return this.request('/v1/auth/verify-email-with-mobile', {
        method: 'POST',
        body: JSON.stringify({ uid, token, sig, mobileNumber }),
        requireTurnstile: true,
      });
    },

    verifyMobileOtp: async (
      uid: string,
      otp: string
    ): Promise<{
      data: null;
      message: string;
    }> => {
      return this.request('/v1/auth/verify-mobile-otp', {
        method: 'POST',
        body: JSON.stringify({ uid, otp }),
        requireTurnstile: true,
      });
    },

    // Invite flow OTP endpoints
    sendInviteOtp: async (
      uid: string,
      token: string,
      sig: string
    ): Promise<{
      data: null;
      message: string;
    }> => {
      return this.request('/v1/auth/send-invite-otp', {
        method: 'POST',
        body: JSON.stringify({ uid, token, sig }),
        requireTurnstile: true,
      });
    },

    resetPasswordWithOtp: async (
      uid: string,
      token: string,
      sig: string,
      otp: string,
      newPassword: string
    ): Promise<{
      data: null;
      message: string;
    }> => {
      return this.request('/v1/auth/reset-password-with-otp', {
        method: 'POST',
        body: JSON.stringify({ uid, token, sig, otp, newPassword }),
        requireTurnstile: true,
      });
    },

    // Change password with OTP (protected endpoint)
    generateMobileOtp: async (): Promise<{
      data: null;
      message: string;
    }> => {
      return this.request('/v1/auth/generate-mobile-otp', {
        method: 'POST',
        requireTurnstile: true,
      });
    },

    changePasswordWithOtp: async (
      oldPassword: string,
      newPassword: string,
      otp: string
    ): Promise<{
      data: null;
      message: string;
    }> => {
      return this.request('/v1/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ oldPassword, newPassword, otp }),
        requireTurnstile: true,
      });
    },

    // Mobile number update endpoints
    sendMobileUpdateOtp: async (
      mobileNumber: string
    ): Promise<{
      data: null;
      message: string;
    }> => {
      return this.request('/v1/auth/send-mobile-update-otp', {
        method: 'POST',
        body: JSON.stringify({ mobileNumber }),
      });
    },

    verifyMobileUpdate: async (
      mobileNumber: string,
      otp: string
    ): Promise<{
      data: null;
      message: string;
    }> => {
      return this.request('/v1/auth/verify-mobile-update', {
        method: 'POST',
        body: JSON.stringify({ mobileNumber, otp }),
      });
    },

    // Resend endpoints with rate limiting
    resendVerification: async (
      email: string
    ): Promise<{
      data: null;
      message: string;
    }> => {
      return this.request('/v1/auth/resend-verification', {
        method: 'POST',
        body: JSON.stringify({ email }),
        requireTurnstile: true,
      });
    },

    resendMobileOtp: async (
      email: string
    ): Promise<{
      data: null;
      message: string;
    }> => {
      return this.request('/v1/auth/resend-mobile-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
        requireTurnstile: true,
      });
    },

    resendInviteOtp: async (
      uid: string,
      token: string,
      sig: string
    ): Promise<{
      data: null;
      message: string;
    }> => {
      return this.request('/v1/auth/resend-invite-otp', {
        method: 'POST',
        body: JSON.stringify({ uid, token, sig }),
        requireTurnstile: true,
      });
    }
  };

  // User endpoints
  user = {
    // Initialize user onboarding (KYC)
    initOnboarding: async (
      name: string,
      dob: string,
      taxId: string,
      nationalId: string
    ): Promise<{
      data: {
        status: string;
        aadhaarLink: string;
        txnId: string;
      };
      message: string;
    }> => {
      return this.request('/v1/user/onboard/init', {
        method: 'POST',
        body: JSON.stringify({ name, dob, taxId, nationalId }),
        requireTurnstile: true,
      });
    },

    // Complete user onboarding with role claim
    // For new business flow: pass businessId in header + claimedRole in body
    // For join existing business flow: pass gstin in body + claimedRole in body
    // For invited user flow: pass empty body (user already has roles, just needs KYC)
    completeOnboarding: async (
      claimedRole: string,
      bid?: string
    ): Promise<{
      data: {
        status: string;
      };
      message: string;
    }> => {
      const body: any = { claimedRole };

      if (bid) {
        body.bid = bid;
      }

      return this.request('/v1/user/onboard/complete', {
        method: 'POST',
        body: JSON.stringify(body),
        requireTurnstile: true,
      });
    },

    // Get user roles across all businesses
    getRoles: async (): Promise<{
      data: Array<{
        userId: string;
        businessId: string;
        role: string;
        kycNeeded: boolean;
      }>;
      message: string;
    }> => {
      return this.request('/v1/user/roles', {
        method: 'GET',
      });
    },

    getProfile: async (): Promise<{
      data: {
        userId: string;
        email: string;
        name: string;
        dob: string;
        mobile: string;
        taxId: string;
        maskedNationalId: string;
      };
      message: string;
    }> => {
      return this.request('/v1/user/profile', {
        method: 'GET',
      });
    },

    updateProfile: async (data: any) => {
      // TODO: Update user profile
      // return this.request('/v1/user/profile', {
      //   method: 'PUT',
      //   body: JSON.stringify(data),
      // });

      console.log('TODO: Implement user.updateProfile API call', data);
      throw new Error('API not implemented yet');
    },

    getBusinesses: async () => {
      // TODO: Get user's businesses
      // return this.request('/v1/user/businesses');

      console.log('TODO: Implement user.getBusinesses API call');
      throw new Error('API not implemented yet');
    },

    // Get user onboarding status
    // Returns full details when kyc_in_progress, only kycStatus when completed/verified
    getOnboardingStatus: async (): Promise<{
      data: {
        kycStatus: string;
        userId?: string;
        email?: string;
        name?: string;
        dob?: string;
        mobile?: string;
        taxId?: string;
        nationalId?: string;
        emailVerified?: boolean;
        mobileVerified?: boolean;
      };
      message: string;
    }> => {
      return this.request('/v1/user/onboard/status', {
        method: 'GET',
      });
    },

    // Invite user to business
    inviteUser: async (
      email: string,
      name: string,
      mobile: string,
      role: string
    ): Promise<{
      data: {
        email: string;
        name: string;
        userId: string;
      };
      message: string;
    }> => {
      return this.request('/v1/business/invite-user', {
        method: 'POST',
        body: JSON.stringify({ email, name, mobile, role }),
        requireTurnstile: true,
      });
    },

    // Resend invite email to user
    resendInvite: async (
      _businessId: string,
      email: string
    ): Promise<{
      data: {
        email: string;
      };
      message: string;
    }> => {
      return this.request('/v1/business/resend-invite', {
        method: 'POST',
        body: JSON.stringify({ email }),
        requireTurnstile: true,
      });
    },

    // Update user role in business
    updateUserRole: async (
      userId: string,
      newRole: string
    ): Promise<{
      message: string;
    }> => {
      return this.request('/v1/business/users/update', {
        method: 'POST',
        body: JSON.stringify({ userId, newRole }),
        requireTurnstile: true,
      });
    },

    // Remove user from business
    removeUser: async (
      _businessId: string,
      userId: string
    ): Promise<{
      message: string;
    }> => {
      return this.request('/v1/business/users', {
        method: 'DELETE',
        body: JSON.stringify({ userId }),
        requireTurnstile: true,
      });
    },

    // Get user permissions for current business
    getPermissions: async () => {
      return this.request(`/v1/users/permissions`, {
        method: 'GET',
      });
    },
  };

  // Business endpoints
  business = {
    // Get all users for a business
    getUsers: async (): Promise<{
      data: Array<{
        userId: string;
        email: string;
        name: string;
        role: string;
        roleClaim: string;
        kycStatus: string;
        addedAt: string;
        updatedAt: string;
      }>;
      message: string;
    }> => {
      return this.request('/v1/business/users', {
        method: 'GET',
      });
    },

    // Initialize business onboarding
    initOnboarding: async (name: string, gstin: string): Promise<{
      data: {
        bid: string;
        name: string;
        gstin: string;
        kybStatus: string;
        message: string;
      };
      message: string;
    }> => {
      return this.request('/v1/business/onboard/init', {
        method: 'POST',
        body: JSON.stringify({ name, gstin }),
      });
    },

    // Get presigned URL for deed upload
    getUploadUrl: async (bid: string): Promise<{
      data: {
        url: string;
      };
      message: string;
    }> => {
      return this.request(`/v1/business/onboard/upload?bid=${bid}`, {
        method: 'GET',
      });
    },

    // Upload file to S3 using presigned URL
    uploadToS3: async (url: string, file: File): Promise<void> => {
      const response = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': 'application/pdf',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to upload file to S3');
      }
    },

    // Confirm upload completion
    confirmUpload: async (bid: string): Promise<{
      data: {
        url: string;
      };
      message: string;
    }> => {
      return this.request(`/v1/business/onboard/confirm-upload?bid=${bid}`, {
        method: 'POST',
        requireTurnstile: true,
      });
    },

    // Complete business onboarding
    // PAN (itid) is optional - backend derives it from GSTIN
    completeOnboarding: async (
      businessType: string,
      pan?: string,
      cin?: string,
      businessModel?: string,
      businessTurnover?: string
    ): Promise<{
      data: {
        bid: string;
        kybStatus: string;
        requiresDeedUpload: boolean;
        message: string;
      };
      message: string;
    }> => {
      const body: any = {
        businessType,
      };

      if (pan) {
        body.itid = pan;
      }

      if (cin) {
        body.cid = cin;
      }

      if (businessModel) {
        body.businessModel = businessModel;
      }

      if (businessTurnover) {
        body.businessTurnover = businessTurnover;
      }

      return this.request('/v1/business/onboard/complete', {
        method: 'POST',
        body: JSON.stringify(body),
      });
    },

    // Get business onboarding status
    // Returns full details when kyb_in_progress, minimal when completed/verified
    getOnboardingStatus: async (): Promise<{
      data: {
        kybInitiated: boolean;
        kybStatus: string;
        bid?: string;
        name?: string;
        gstin?: string;
        businessType?: string;
        cid?: string;
        requiresDeedUpload?: boolean;
        hasDeedUploaded?: boolean;
      };
      message: string;
    }> => {
      return this.request('/v1/business/onboard/status', {
        method: 'GET',
      });
    },

    getBusiness: async (): Promise<{
      data: {
        bid: string;
        name: string;
        gstin: string;
        pan: string;
        businessType: string;
        userRole: string;
      };
      message: string;
    }> => {
      return this.request('/v1/business', {
        method: 'GET',
      });
    },
  };

  // Payment endpoints - TODO: Implement when backend is ready
  payments = {
    getAll: async (params?: any) => {
      // TODO: Get all payments with filtering
      // const query = new URLSearchParams(params).toString();
      // return this.request(`/v1/payments?${query}`);

      console.log('TODO: Implement payments.getAll API call', params);
      throw new Error('API not implemented yet');
    },

    create: async (paymentData: any) => {
      // TODO: Create new payment
      // return this.request('/v1/payments', {
      //   method: 'POST',
      //   body: JSON.stringify(paymentData),
      // });

      console.log('TODO: Implement payments.create API call', paymentData);
      throw new Error('API not implemented yet');
    },

    getById: async (id: string) => {
      // TODO: Get payment by ID
      // return this.request(`/v1/payments/${id}`);

      console.log('TODO: Implement payments.getById API call', id);
      throw new Error('API not implemented yet');
    },

    update: async (id: string, data: any) => {
      // TODO: Update payment
      // return this.request(`/v1/payments/${id}`, {
      //   method: 'PUT',
      //   body: JSON.stringify(data),
      // });

      console.log('TODO: Implement payments.update API call', { id, data });
      throw new Error('API not implemented yet');
    },

    cancel: async (id: string) => {
      // TODO: Cancel payment
      // return this.request(`/v1/payments/${id}/cancel`, { method: 'POST' });

      console.log('TODO: Implement payments.cancel API call', id);
      throw new Error('API not implemented yet');
    }
  };

  // Batch Payments endpoints
  batchPayments = {
    downloadTemplate: async ():
      Promise<{
        data: {
          download_url?: string;
          expires_in?: number;
          filename?: string
        };
        message: string;
        status: string;
      }> => {
      return this.request('/v1/batch_payments/template', {
        method: 'GET',
      });
    },

    upload: async (file: File): Promise<any> => {
      const formData = new FormData();
      formData.append('csv_file', file);

      return this.request('/v1/batch_payments/upload', {
        method: 'POST',
        body: formData,
      }, false, false);
    },
  };

  // Payees endpoints
  payees = {
    getAll: async (params?: {
      page?: number;
      page_size?: number;
      search?: string;
      type?: string;
      is_active?: boolean;
    }): Promise<any> => {
      const queryParams = new URLSearchParams();
      if (params?.page) {
        queryParams.append('page', params.page.toString());
      }
      if (params?.page_size) {
        queryParams.append('page_size', params.page_size.toString());
      }
      if (params?.search) {
        queryParams.append('search', params.search);
      }
      if (params?.type && params.type !== 'all') {
        queryParams.append('type', params.type);
      }
      if (params?.is_active !== undefined) {
        queryParams.append('is_active', params.is_active.toString());
      }

      const queryString = queryParams.toString();

      return this.request(`/v1/payees${queryString ? `?${queryString}` : ''}`, {
        method: 'GET',
      });
    },

    create: async (payeeData: any): Promise<any> => {
      return this.request('/v1/payees', {
        method: 'POST',
        body: JSON.stringify(payeeData),
        requireTurnstile: true,
      });
    },

    update: async (id: string, updates: any) => {
      // TODO: Update payee
      // return this.request(`/v1/payees/${id}`, {
      //   method: 'PUT',
      //   body: JSON.stringify(updates),
      // });

      console.log('TODO: Implement payees.update API call', { id, updates });
      throw new Error('API not implemented yet');
    },

    delete: async (id: string) => {
      // TODO: Delete payee
      // return this.request(`/v1/payees/${id}`, { method: 'DELETE' });

      console.log('TODO: Implement payees.delete API call', { id });
      throw new Error('API not implemented yet');
    },

    // Get detailed payee information
    getDetails: async (payeeId: string): Promise<any> => {
      return this.request(`/v1/payees/details/${payeeId}`, {
        method: 'GET',
      });
    },

    // Get payee account details (for vendor and employee types)
    getAccountDetails: async (relationId: string): Promise<{
      status: string;
      data: {
        account_number_last_4: string;
        bank_name: string;
        ifsc_code: string;
      };
    }> => {
      return this.request(`/v1/payees/${relationId}/acc_details`, {
        method: 'GET',
      });
    },

    // Update payee status (mark active/inactive)
    updateStatus: async (relationId: string, isActive: boolean): Promise<any> => {
      return this.request(`/v1/payees/${relationId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ is_active: isActive }),
        requireTurnstile: true,
      });
    },

    // Get vouchers/transactions for a specific payee
    getTransactions: async (payeeId: string, params: {
      status?: string;
      paymentMethod?: string;
      dateFrom?: string;
      dateTo?: string;
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: string;
    }): Promise<any> => {
      const queryParams = new URLSearchParams();
      if (params.page) {
        queryParams.append('page', params.page.toString());
      }
      if (params.limit) {
        queryParams.append('page_size', params.limit.toString());
      }

      const queryString = queryParams.toString();

      return this.request(`/v1/vouchers/payee/${payeeId}${queryString ? `?${queryString}` : ''}`, {
        method: 'GET',
      });
    },

    // Update payee details (for edit functionality)
    updateDetails: async (payeeId: string, updates: any) => {
      console.log('TODO: Implement payees.updateDetails API call', { payeeId, updates });
      throw new Error('API not implemented yet');
    },

    // Get presigned S3 URL for employee remuneration document upload
    getEmployeeDocPresignedUrl: async (
      relationId: string
    ): Promise<{
      data: {
        expires_in: string;
        upload_url: string;
      };
      status: string;
    }> => {
      return this.request(`/v1/payees/remuneration/upload-url?relation_id=${relationId}`, {
        method: 'GET',
      });
    },

    // Upload file to S3 using presigned URL
    uploadToS3: async (url: string, file: File): Promise<void> => {
      const response = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': 'application/pdf',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to upload file to S3');
      }
    },

    // Confirm employee remuneration document upload
    confirmEmployeeDocUpload: async (
      relationId: string
    ): Promise<any> => {
      return this.request(`/v1/payees/remuneration/confirm-upload?relation_id=${relationId}`, {
        method: 'GET',
      });
    },

    // Get employee remuneration document
    getEmployeeDocument: async (
      relationId: string
    ): Promise<{
      data: {
        has_document: boolean;
        download_url?: string;
        expires_in?: string
      };
      status: string;
    }> => {
      return this.request(`/v1/payees/remuneration/download-url?relation_id=${relationId}`, {
        method: 'GET',
      });
    },

    // Validate IFSC code and get bank details
    validateIfsc: async (ifscCode: string): Promise<{
      status: string;
      data: {
        ifsc: string;
        bank: string;
        branch: string;
        address: string;
        city: string;
        contact: string;
        micr: string;
        features: {
          rtgs: boolean;
          neft: boolean;
          imps: boolean;
          upi: boolean;
        };
      };
    }> => {
      return this.request(`/v1/payees/validate-ifsc/${ifscCode}`, {
        method: 'GET',
      });
    }
  };

  // Employees endpoints
  employees = {
    getAll: async (): Promise<any> => {
      return this.request('/v1/payees/employees', {
        method: 'GET',
      });
    }
  };

  // Banks/IFSC validation endpoints
  banks = {
    validateIfsc: async (ifscCode: string) => {
      // TODO: Validate IFSC code and get bank details
      // return this.request(`/v1/banks/validate-ifsc?ifsc=${ifscCode}`);

      console.log('TODO: Implement banks.validateIfsc API call', { ifscCode });
      throw new Error('API not implemented yet');
    }
  };

  // Payment History endpoints - TODO: Implement when backend is ready
  paymentHistory = {
    getAll: async (params: {
      businessId: string;
      // Column header filters (trigger API calls)
      dateRange?: 'last7days' | 'last30days' | 'last3months' | 'custom';
      dateFrom?: string;
      dateTo?: string;
      status?: string[]; // ['completed', 'pending', 'failed', 'cancelled']
      paymentMethod?: string[]; // ['credit', 'bank', 'upi', 'bnpl']
      // Pagination (triggers API calls)
      page?: number;
      limit?: number; // rows per page
      // Sorting (triggers API calls)
      sortBy?: 'date' | 'amount' | 'vendor' | 'status';
      sortOrder?: 'asc' | 'desc';
    }) => {
      // TODO: Get payment history with server-side filtering and pagination
      // const query = new URLSearchParams();
      // Object.entries(params).forEach(([key, value]) => {
      //   if (value !== undefined) {
      //     if (Array.isArray(value)) {
      //       query.append(key, value.join(','));
      //     } else {
      //       query.append(key, String(value));
      //     }
      //   }
      // });
      // return this.request(`/v1/payments/history?${query}`);

      console.log('TODO: Implement paymentHistory.getAll API call', params);
      throw new Error('API not implemented yet');
    }
  };

  // Upcoming Payments endpoints - TODO: Implement when backend is ready
  upcomingPayments = {
    getAll: async (params: {
      businessId: string;
      page?: number;
      limit?: number;
      month?: string; // '2024-01' format for calendar view
      search?: string;
      sortBy?: 'date' | 'amount' | 'vendor';
      sortOrder?: 'asc' | 'desc';
    }) => {
      // TODO: Get upcoming payments with pagination and filtering
      // const query = new URLSearchParams(
      //   Object.entries(params).filter(([_, v]) => v !== undefined).map(([k, v]) => [k, String(v)])
      // ).toString();
      // return this.request(`/v1/payments/upcoming?${query}`);

      console.log('TODO: Implement upcomingPayments.getAll API call', params);
      throw new Error('API not implemented yet');
    }
  };

  // Dashboard endpoints
  dashboard = {
    getData: async (): Promise<{
      total_spend_this_month: number;
      pending_approvals: number;
      overdue_bills: {
        count: number;
        total_amount: number;
      };
      recent_payments: Array<{
        payment_id: string;
        amount: number;
        payment_method: string;
        status: string;
        created_at: string;
      }>;
      upcoming_large_payments: Array<{
        voucher_id: string;
        voucher_number: string;
        payee_id: string;
        net_amount: number;
        invoice_due_date: string;
        invoice_number: string;
      }>;
      monthly_spends: Array<{
        month: string;
        total_spend: number;
        txn_count: number;
      }>;
      payment_source_breakdown: Array<{
        payment_method: string;
        source_label: string;
        card_network: string | null;
        last_four_digits: string | null;
        bank_name: string | null;
        total_amount: number;
        txn_count: number;
      }>;
    }> => {
      return this.request('/v1/dashboard', {
        method: 'GET',
      });
    }
  };

  // Payment Insights endpoints - TODO: Implement when backend is ready
  paymentInsights = {
    getAll: async (businessId: string) => {
      // TODO: Get all payment insights from cache
      // return this.request(`/v1/payments/insights?businessId=${businessId}`);

      console.log('TODO: Implement paymentInsights.getAll API call', { businessId });
      throw new Error('API not implemented yet');
    },

    refresh: async (businessId: string) => {
      // TODO: Trigger insights recalculation
      // return this.request(`/v1/payments/insights/refresh`, {
      //   method: 'POST',
      //   body: JSON.stringify({ businessId }),
      // });

      console.log('TODO: Implement paymentInsights.refresh API call', { businessId });
      throw new Error('API not implemented yet');
    }
  };

  // Notification endpoints
  notifications = {
    // Get user notifications with pagination
    getAll: async (params?: { limit?: number; offset?: number }) => {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());

      const query = queryParams.toString();
      return this.request(`/v1/notifications${query ? `?${query}` : ''}`);
    },

    // Get unread count only
    getUnreadCount: async () => {
      return this.request('/v1/notifications/unread/count');
    },

    // Mark single notification as read
    markAsRead: async (id: number) => {
      return this.request(`/v1/notifications/${id}/read`, {
        method: 'POST'
      });
    },

    // Mark multiple notifications as read
    markMultipleAsRead: async (notification_ids: number[]) => {
      return this.request('/v1/notifications/read', {
        method: 'POST',
        body: JSON.stringify({ notification_ids }),
      });
    },

    // Get notification preferences
    getPreferences: async () => {
      return this.request('/v1/notifications/preferences');
    },

    // Update notification preferences
    updatePreferences: async (preferences: {
      email_enabled?: boolean;
      push_enabled?: boolean;
      messages_enabled?: boolean;
      category_preferences?: {
        announcements?: boolean;
        approvals?: boolean;
        insights?: boolean;
        payees?: boolean;
        payments?: boolean;
        rewards?: boolean;
        security?: boolean;
        others?: boolean;
      };
    }) => {
      return this.request('/v1/notifications/preferences', {
        method: 'PUT',
        body: JSON.stringify(preferences),
      });
    }
  };

  // Process Payment endpoints
  processPayment = {
    getDetails: async (paymentId: string) => {
      return this.request(`/v1/process_payment/${paymentId}`, {
        method: 'GET',
      });
    },
    getPaymentSourcesWithFees: async (params: {
      payment_context: string;
      base_amount: number;
    }) => {
      return this.request('/v1/process_payment/get_payment_sources_with_fees', {
        method: 'POST',
        body: JSON.stringify(params),
        requireTurnstile: true,
      });
    },
    tokenize: async (cardDetails: {
      card_number: string;
      expiry_month: string;
      expiry_year: string;
      cvv: string;
      holder_name: string;
      card_type: string;
      card_category: string;
    }) => {
      return this.request('/v1/process_payment/tokenize', {
        method: 'POST',
        body: JSON.stringify({ card_details: cardDetails }),
        requireTurnstile: true
      });
    },
    list: async (params: { limit: number; offset: number }) => {
      const queryParams = new URLSearchParams();
      queryParams.append('limit', params.limit.toString());
      queryParams.append('offset', params.offset.toString());

      return this.request(`/v1/process_payment/list?${queryParams}`, {
        method: 'GET',
      });
    },
    makeCardPayment: async (params: {
      amount: number;
      currency: string;
      payment_method: 'token_card' | 'netbanking';
      description?: string;
      calling_device: 'web' | 'mobile';
      voucher_ids: string[];
      token_details: {
        card_id?: string;
      };
    }) => {
      return this.request('/v1/process_payment/make_payment', {
        method: 'POST',
        body: JSON.stringify(params),
        requireTurnstile: true,
      });
    },
    retryPayment: async (params: {
      original_payment_id: string;
    }) => {
      return this.request('/v1/process_payment/retry', {
        method: 'POST',
        body: JSON.stringify(params),
        requireTurnstile: true,
      });
    }
  };

  // Wallet endpoints
  wallet = {
    fetch: async () => {
      return this.request('/v1/wallet', {
        method: 'GET',
      });
    },
    updateCardStatus: async (cardId: string, isActive: boolean) => {
      return this.request(`/v1/wallet/cards/${cardId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ is_active: isActive }),
      });
    }
  };

  // Voucher endpoints
  voucher = {
    list: async (params: {
      status?: string;
      limit: number;
      offset: number
    }) => {
      const queryParams = new URLSearchParams();
      queryParams.append('limit', params.limit.toString());
      queryParams.append('offset', params.offset.toString());
      if (params.status && params.status !== 'all') {
        queryParams.append('status', params.status);
      }

      return this.request(`/v1/vouchers/list?${queryParams}`, {
        method: 'GET',
      });
    },

    getVoucherCounts: async () => {
      return this.request('/v1/vouchers/counts', {
        method: 'GET',
      });
    },

    createDraft: async (params: {
      relation_id: string;
      invoice_number?: string;
      gross_amount: number;
      net_amount: number;
      description?: string;
      voucher_date?: string;
      payment_type?: string;
      scheduled_date?: string;
      frequency?: string;
    }) => {
      return this.request('/v1/vouchers/draft', {
        method: 'POST',
        body: JSON.stringify(params),
      });
    },

    createMultiple: async (vouchers: Array<{
      relation_id: string;
      invoice_number: string;
      invoice_date?: string;
      gross_amount: number;
      net_amount: number;
      gst_amount: number;
      tds_amount: number;
      expense_category?: string;
      description?: string;
      financial_details?: Record<string, any>;
    }>) => {
      return this.request('/v1/vouchers/multi', {
        method: 'POST',
        body: JSON.stringify({ vouchers }),
      });
    },

    update: async (voucherId: string, params: {
      relation_id?: string;
      invoice_number?: string;
      gross_amount?: number;
      description?: string;
      payment_type?: string;
      scheduled_date?: string;
      frequency?: string;
    }) => {
      return this.request(`/v1/vouchers/${voucherId}`, {
        method: 'PUT',
        body: JSON.stringify(params),
      });
    },

    getDetails: async (voucherId: string) => {
      return this.request(`/v1/vouchers/${voucherId}`, {
        method: 'GET',
      });
    },

    getActivity: async (voucherId: string) => {
      return this.request(`/v1/vouchers/${voucherId}/activity`, {
        method: 'GET',
      });
    },

    getPayment: async (voucherId: string) => {
      return this.request(`/v1/vouchers/${voucherId}/payment`, {
        method: 'GET',
      });
    },

    getAccounting: async (voucherId: string) => {
      return this.request(`/v1/vouchers/${voucherId}/accounting`, {
        method: 'GET',
      });
    },

    getAttachments: async (voucherId: string) => {
      return this.request(`/v1/vouchers/${voucherId}/attachments`, {
        method: 'GET',
      });
    },

    deleteVoucher: async (voucherId: string) => {
      return this.request(`/v1/vouchers/${voucherId}`, {
        method: 'DELETE',
      });
    },

    updateVoucher: async (voucherId: string, payload: any) => {
      return this.request(`/v1/vouchers/${voucherId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    },

    requestApproval: async (
      voucherId: string,
      approverUserId: string,
      remarks?: string
    ) => {
      return this.request(`/v1/vouchers/${voucherId}/request-approval`, {
        method: 'POST',
        body: JSON.stringify({
          approver_user_id: approverUserId,
          action: 'pending',
          remarks: remarks || '',
        }),
      });
    },

    approveVoucher: async (
      voucherId: string,
      approverUserId: string,
      remarks?: string
    ) => {
      return this.request(`/v1/vouchers/${voucherId}/request-approval`, {
        method: 'POST',
        body: JSON.stringify({
          approver_user_id: approverUserId,
          action: 'approved',
          remarks: remarks || '',
        }),
      });
    },

    rejectVoucher: async (
      voucherId: string,
      approverUserId: string,
      remarks: string
    ) => {
      return this.request(`/v1/vouchers/${voucherId}/request-approval`, {
        method: 'POST',
        body: JSON.stringify({
          approver_user_id: approverUserId,
          action: 'rejected',
          remarks: remarks,
        }),
      });
    },

    requestChanges: async (
      voucherId: string,
      approverUserId: string,
      remarks: string
    ) => {
      return this.request(`/v1/vouchers/${voucherId}/request-approval`, {
        method: 'POST',
        body: JSON.stringify({
          approver_user_id: approverUserId,
          action: 'request_changes',
          remarks: remarks,
        }),
      });
    },

    batchApprove: async (
      voucherIds: string[],
      approvedById: string,
      remarks?: string
    ) => {
      return this.request('/v1/vouchers/batch-approve', {
        method: 'POST',
        body: JSON.stringify({
          voucher_ids: voucherIds,
          approved_by_id: approvedById,
          remarks: remarks || 'Batch Approved',
        }),
      });
    },

    getApprovalInbox: async (
      status: 'pending' | 'approved' | 'rejected' | 'request_changes'
    ) => {
      return this.request(`/v1/vouchers/approval-inbox?status=${status}`, {
        method: 'GET',
      });
    },

    getApprovalCounts: async () => {
      return this.request('/v1/vouchers/approval-inbox/counts', {
        method: 'GET',
      });
    },

    getUnpaidVouchers: async (limit: number = 50, offset: number = 0) => {
      return this.request(`/v1/vouchers/unpaid?limit=${limit}&offset=${offset}`, {
        method: 'GET',
      });
    },

    createVoucher: async (voucherData: any) => {
      return this.request('/v1/vouchers', {
        method: 'POST',
        body: JSON.stringify(voucherData),
      });
    },

    getCalendar: async (year: number, month: number) => {
      return this.request(`/v1/vouchers/calendar?year=${year}&month=${month}`, {
        method: 'GET',
      });
    }
  };

  // Vendors endpoints
  vendors = {
    getAll: async () => {
      return this.request(`/v1/payees/vendors`, {
        method: 'GET',
      });
    }
  };

  // Invoice endpoints
  invoices = {
    // Download invoice by payment ID (PDF format)
    downloadByPaymentId: async (paymentId: string): Promise<Blob> => {
      // Use the centralized request method with blob response handling
      return this.requestBlob(
        `/v1/invoices/download?payment_id=${paymentId}&format=pdf`,
        { method: 'GET' }
      );
    },

    // Get invoice details by payment ID (JSON format)
    getByPaymentId: async (paymentId: string): Promise<{
      invoice_id: number;
      payment_id: string;
      invoice_number: string;
      gstin_supplier: string;
      gstin_recipient: string;
      invoice_date: string;
      irn?: string;
      irn_ack_no?: string;
      irn_ack_date?: string;
      irn_status: 'pending' | 'irn_generated' | 'failed' | 'cancelled';
      qr_code?: string;
      filing_status: 'not_filed' | 'filed' | 'failed';
      description: string;
      sac_code: string;
      taxable_value: number;
      gst_rate: number;
      gst_amount: number;
      total_amount: number;
      created_at: string;
      updated_at: string;
    }> => {
      return this.request(`/v1/invoices/download?payment_id=${paymentId}&format=json`, {
        method: 'GET',
      });
    },

    // Download invoice by invoice ID (PDF format)
    downloadByInvoiceId: async (invoiceId: number): Promise<Blob> => {
      // Use the centralized request method with blob response handling
      return this.requestBlob(
        `/v1/invoices/download?invoice_id=${invoiceId}&format=pdf`,
        { method: 'GET' }
      );
    },
  };

}

export const apiService = new ApiService();

// Export individual services for easier imports
export const {
  auth: authAPI,
  user: userAPI,
  business: businessAPI,
  payments: paymentsAPI,
  payees: payeesAPI,
  employees: employeesAPI,
  banks: banksAPI,
  paymentHistory: paymentHistoryAPI,
  upcomingPayments: upcomingPaymentsAPI,
  dashboard: dashboardAPI,
  paymentInsights: paymentInsightsAPI,
  notifications: notificationsAPI,
  processPayment: processPaymentAPI,
  wallet: walletAPI,
  voucher: voucherAPI,
  vendors: vendorsAPI,
  batchPayments: batchPaymentsAPI,
  invoices: invoicesAPI
} = apiService;