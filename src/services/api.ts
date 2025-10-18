// Vite uses import.meta.env instead of process.env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888/v1';

class ApiService {
  private baseUrl: string;
  private authToken?: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Add method to update auth token
  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    isRetry: boolean = false
  ): Promise<T> {
    // Use instance token if available, fallback to localStorage
    const token = this.authToken || localStorage.getItem('auth-token');

    // Build headers: start with defaults, then merge caller's headers
    // This ensures custom headers from the caller are preserved
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };

    // Merge caller's headers AFTER defaults (caller's headers take precedence)
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    const config: RequestInit = {
      ...options, // Spread all caller's options first (method, body, etc.)
      headers,    // Then set the merged headers (this preserves custom headers)
      credentials: 'include', // Important: Include cookies in requests
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // ONLY trigger refresh if it's specifically TOKEN_EXPIRED (not MISSING_TOKEN or INVALID_TOKEN)
        // This prevents infinite loops when user is not authenticated
        if (!isRetry && response.status === 401 && errorData.error === 'TOKEN_EXPIRED') {
          try {
            // Call refresh token endpoint
            const refreshResponse = await fetch(`${this.baseUrl}/auth/refresh`, {
              method: 'POST',
              credentials: 'include', // Include cookies for refresh
            });

            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              console.log('Token refreshed successfully:', refreshData.message);

              // Retry the original request with the new token (cookies are automatically updated)
              return this.request<T>(endpoint, options, true);
            } else {
              // If refresh fails, clear tokens and redirect to login
              console.log('Token refresh failed, redirecting to login');
              localStorage.removeItem('auth-token');
              this.authToken = null;
              window.location.href = '/login';
              return Promise.reject(new Error('Session expired. Please login again.'));
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            // Clear tokens and redirect to login
            localStorage.removeItem('auth-token');
            this.authToken = null;
            window.location.href = '/login';
            return Promise.reject(new Error('Session expired. Please login again.'));
          }
        }

        // For MISSING_TOKEN or INVALID_TOKEN, just throw the error
        // This allows AuthContext to handle logout properly without triggering refresh
        const error: any = new Error(errorData.message || `HTTP ${response.status}`);
        error.code = errorData.error; // Preserve error code (e.g., "MISSING_TOKEN", "INVALID_TOKEN")
        error.status = response.status;
        throw error;
      }

      return response.json();
    } catch (error) {
      // Only log non-auth errors
      if (error instanceof Error && !(error as any).code?.includes('MISSING_TOKEN')) {
        console.error('API Request failed:', error);
      }
      throw error;
    }
  }

  // Auth endpoints - TODO: Implement when backend is ready
  auth = {
    login: async (email: string, password: string): Promise<{
      data: {
        accessToken: string;
        refreshToken: string;
      };
      message: string;
    }> => {
      return this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },

    signup: async (email: string, password: string): Promise<{ data: { userId: string }, message: string }> => {
      return this.request('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },

    logout: async (): Promise<{ message: string }> => {
      return this.request('/auth/logout', {
        method: 'POST',
      });
    },

    refreshToken: async (refreshToken: string) => {
      // TODO: Implement token refresh
      // return this.request('/auth/refresh', {
      //   method: 'POST',
      //   body: JSON.stringify({ refreshToken }),
      // });

      console.log('TODO: Implement auth.refreshToken API call', { refreshToken });
      throw new Error('API not implemented yet');
    },

    forgotPassword: async (email: string): Promise<{ message: string }> => {
      return this.request(`/auth/forgot-password?email=${email}`, {
        method: 'GET',
      });
    },

    resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
      return this.request('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword }),
      });
    },

    changePassword: async (oldPassword: string, newPassword: string): Promise<{
      data: null;
      message: string;
    }> => {
      return this.request('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ oldPassword, newPassword }),
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
      nationalId: string,
      businessId?: string
    ): Promise<{
      data: {
        status: string;
        aadhaarLink: string;
        txnId: string;
      };
      message: string;
    }> => {
      const headers: Record<string, string> = {};

      // Only add X-Business-ID header if businessId is provided (new business flow)
      if (businessId) {
        headers['X-Business-ID'] = businessId;
      }

      return this.request('/user/onboard/init', {
        method: 'POST',
        headers,
        body: JSON.stringify({ name, dob, taxId, nationalId }),
      });
    },

    // Complete user onboarding with role claim
    // For new business flow: pass businessId in header + claimedRole in body
    // For join existing business flow: pass gstin in body + claimedRole in body
    // For invited user flow: pass empty body (user already has roles, just needs KYC)
    completeOnboarding: async (
      claimedRole?: string,
      businessId?: string,
      gstin?: string
    ): Promise<{
      data: {
        status: string;
      };
      message: string;
    }> => {
      const headers: Record<string, string> = {};
      const body: any = {};

      // Only add claimedRole if provided (invited users don't need it)
      if (claimedRole) {
        body.claimedRole = claimedRole;
      }

      if (businessId) {
        // New business flow: use X-Business-ID header
        headers['X-Business-ID'] = businessId;
      } else if (gstin) {
        // Join existing business flow: pass gstin in body
        body.gstin = gstin;
      }

      return this.request('/user/onboard/complete', {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
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
      return this.request('/user/roles', {
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
      return this.request('/user/profile', {
        method: 'GET',
      });
    },

    updateProfile: async (data: any) => {
      // TODO: Update user profile
      // return this.request('/user/profile', {
      //   method: 'PUT',
      //   body: JSON.stringify(data),
      // });

      console.log('TODO: Implement user.updateProfile API call', data);
      throw new Error('API not implemented yet');
    },

    getBusinesses: async () => {
      // TODO: Get user's businesses
      // return this.request('/user/businesses');

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
      return this.request('/user/onboard/status', {
        method: 'GET',
      });
    },

    // Invite user to business
    inviteUser: async (
      businessId: string,
      email: string,
      name: string,
      role: string
    ): Promise<{
      data: {
        email: string;
        name: string;
        userId: string;
      };
      message: string;
    }> => {
      return this.request('/business/invite-user', {
        method: 'POST',
        headers: {
          'X-Business-ID': businessId,
        },
        body: JSON.stringify({ email, name, role }),
      });
    },

    // Update user role in business
    updateUserRole: async (
      businessId: string,
      userId: string,
      newRole: string
    ): Promise<{
      message: string;
    }> => {
      return this.request('/business/users/update', {
        method: 'POST',
        headers: {
          'X-Business-ID': businessId,
        },
        body: JSON.stringify({ userId, newRole }),
      });
    },

    // Remove user from business
    removeUser: async (
      businessId: string,
      userId: string
    ): Promise<{
      message: string;
    }> => {
      return this.request('/business/users', {
        method: 'DELETE',
        headers: {
          'X-Business-ID': businessId,
        },
        body: JSON.stringify({ userId }),
      });
    },
  };

  // Business endpoints
  business = {
    // Get all users for a business
    getUsers: async (businessId: string): Promise<{
      data: Array<{
        userId: string;
        email: string;
        name: string;
        role: string;
        roleClaim: string;
        kycNeeded: boolean;
        addedAt: string;
        updatedAt: string;
      }>;
      message: string;
    }> => {
      return this.request('/business/users', {
        method: 'GET',
        headers: {
          'X-Business-ID': businessId,
        },
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
      return this.request('/business/onboard/init', {
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
      return this.request('/business/onboard/upload', {
        method: 'GET',
        headers: {
          'X-Business-ID': bid,
        },
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
      return this.request('/business/onboard/confirm-upload', {
        method: 'POST',
        headers: {
          'X-Business-ID': bid,
        },
      });
    },

    // Complete business onboarding
    // PAN (itid) is optional - backend derives it from GSTIN
    completeOnboarding: async (
      bid: string,
      businessType: string,
      pan?: string,
      cin?: string
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

      // Only add PAN if provided (backend can derive from GSTIN)
      if (pan) {
        body.itid = pan;
      }

      if (cin) {
        body.cid = cin;
      }

      return this.request('/business/onboard/complete', {
        method: 'POST',
        headers: {
          'X-Business-ID': bid,
        },
        body: JSON.stringify(body),
      });
    },

    // Get business onboarding status
    // Returns full details when kyb_in_progress, minimal when completed/verified
    getOnboardingStatus: async (): Promise<{
      data: { kybStatus: string };
      message: string;
    }> => {
      return this.request('/business/onboard/status', {
        method: 'GET',
      });
    },

    getBusiness: async (bid: string): Promise<{
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
      return this.request('/business', {
        method: 'GET',
        headers: {
          'X-Business-ID': bid,
        },
      });
    },
  };

  // Payment endpoints - TODO: Implement when backend is ready
  payments = {
    getAll: async (params?: any) => {
      // TODO: Get all payments with filtering
      // const query = new URLSearchParams(params).toString();
      // return this.request(`/payments?${query}`);

      console.log('TODO: Implement payments.getAll API call', params);
      throw new Error('API not implemented yet');
    },

    create: async (paymentData: any) => {
      // TODO: Create new payment
      // return this.request('/payments', {
      //   method: 'POST',
      //   body: JSON.stringify(paymentData),
      // });

      console.log('TODO: Implement payments.create API call', paymentData);
      throw new Error('API not implemented yet');
    },

    getById: async (id: string) => {
      // TODO: Get payment by ID
      // return this.request(`/payments/${id}`);

      console.log('TODO: Implement payments.getById API call', id);
      throw new Error('API not implemented yet');
    },

    update: async (id: string, data: any) => {
      // TODO: Update payment
      // return this.request(`/payments/${id}`, {
      //   method: 'PUT',
      //   body: JSON.stringify(data),
      // });

      console.log('TODO: Implement payments.update API call', { id, data });
      throw new Error('API not implemented yet');
    },

    cancel: async (id: string) => {
      // TODO: Cancel payment
      // return this.request(`/payments/${id}/cancel`, { method: 'POST' });

      console.log('TODO: Implement payments.cancel API call', id);
      throw new Error('API not implemented yet');
    }
  };

  // Payees endpoints - TODO: Implement when backend is ready
  payees = {
    getAll: async (businessId: string) => {
      // TODO: Get all payees for business
      // return this.request(`/payees?businessId=${businessId}`);

      console.log('TODO: Implement payees.getAll API call', { businessId });
      throw new Error('API not implemented yet');
    },

    create: async (payeeData: any) => {
      // TODO: Create new payee
      // return this.request('/payees', {
      //   method: 'POST',
      //   body: JSON.stringify(payeeData),
      // });

      console.log('TODO: Implement payees.create API call', payeeData);
      throw new Error('API not implemented yet');
    },

    update: async (id: string, updates: any) => {
      // TODO: Update payee
      // return this.request(`/payees/${id}`, {
      //   method: 'PUT',
      //   body: JSON.stringify(updates),
      // });

      console.log('TODO: Implement payees.update API call', { id, updates });
      throw new Error('API not implemented yet');
    },

    delete: async (id: string) => {
      // TODO: Delete payee
      // return this.request(`/payees/${id}`, { method: 'DELETE' });

      console.log('TODO: Implement payees.delete API call', { id });
      throw new Error('API not implemented yet');
    },

    // Get detailed payee information with overview analytics
    getDetails: async (businessId: string, payeeId: string) => {
      // TODO: Get payee details with overview analytics
      // return this.request(`/payees/${payeeId}/details?businessId=${businessId}`);

      console.log('TODO: Implement payees.getDetails API call', { businessId, payeeId });
      throw new Error('API not implemented yet');
    },

    // Get transactions for a specific payee
    getTransactions: async (businessId: string, payeeId: string, params: {
      status?: string;
      paymentMethod?: string;
      dateFrom?: string;
      dateTo?: string;
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: string;
    }) => {
      // TODO: Get payee transactions with server-side filtering
      // const queryParams = new URLSearchParams({
      //   businessId,
      //   ...Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null))
      // });
      // return this.request(`/payees/${payeeId}/transactions?${queryParams}`);

      console.log('TODO: Implement payees.getTransactions API call', { businessId, payeeId, params });
      throw new Error('API not implemented yet');
    },

    // Update payee details (for edit functionality)
    updateDetails: async (businessId: string, payeeId: string, updates: any) => {
      // TODO: Update payee details
      // return this.request(`/payees/${payeeId}/details`, {
      //   method: 'PUT',
      //   body: JSON.stringify({ businessId, ...updates }),
      // });

      console.log('TODO: Implement payees.updateDetails API call', { businessId, payeeId, updates });
      throw new Error('API not implemented yet');
    }
  };

  // Banks/IFSC validation endpoints
  banks = {
    validateIfsc: async (ifscCode: string) => {
      // TODO: Validate IFSC code and get bank details
      // return this.request(`/banks/validate-ifsc?ifsc=${ifscCode}`);

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
      // return this.request(`/payments/history?${query}`);

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
      // return this.request(`/payments/upcoming?${query}`);

      console.log('TODO: Implement upcomingPayments.getAll API call', params);
      throw new Error('API not implemented yet');
    }
  };

  // Dashboard endpoints - TODO: Implement when backend is ready
  dashboard = {
    getInsights: async () => {
      // TODO: Get dashboard insights
      // return this.request('/dashboard/insights');

      console.log('TODO: Implement dashboard.getInsights API call');
      throw new Error('API not implemented yet');
    },

    getRecentTransactions: async (limit: number = 10) => {
      // TODO: Get recent transactions
      // return this.request(`/dashboard/transactions/recent?limit=${limit}`);

      console.log('TODO: Implement dashboard.getRecentTransactions API call', { limit });
      throw new Error('API not implemented yet');
    },

    getUpcomingPayments: async () => {
      // TODO: Get upcoming payments
      // return this.request('/dashboard/payments/upcoming');

      console.log('TODO: Implement dashboard.getUpcomingPayments API call');
      throw new Error('API not implemented yet');
    }
  };

  // Payment Insights endpoints - TODO: Implement when backend is ready
  paymentInsights = {
    getAll: async (businessId: string) => {
      // TODO: Get all payment insights from cache
      // return this.request(`/payments/insights?businessId=${businessId}`);

      console.log('TODO: Implement paymentInsights.getAll API call', { businessId });
      throw new Error('API not implemented yet');
    },

    refresh: async (businessId: string) => {
      // TODO: Trigger insights recalculation
      // return this.request(`/payments/insights/refresh`, {
      //   method: 'POST',
      //   body: JSON.stringify({ businessId }),
      // });

      console.log('TODO: Implement paymentInsights.refresh API call', { businessId });
      throw new Error('API not implemented yet');
    }
  };

  // Notification endpoints - TODO: Implement when backend is ready
  notifications = {
    getAll: async () => {
      // TODO: Get all notifications
      // return this.request('/notifications');

      console.log('TODO: Implement notifications.getAll API call');
      throw new Error('API not implemented yet');
    },

    markAsRead: async (id: string) => {
      // TODO: Mark notification as read
      // return this.request(`/notifications/${id}/read`, { method: 'POST' });

      console.log('TODO: Implement notifications.markAsRead API call', id);
      throw new Error('API not implemented yet');
    },

    markAllAsRead: async () => {
      // TODO: Mark all notifications as read
      // return this.request('/notifications/read-all', { method: 'POST' });

      console.log('TODO: Implement notifications.markAllAsRead API call');
      throw new Error('API not implemented yet');
    }
  };

  // Bills endpoints - TODO: Implement when backend is ready
  bills = {
    getAll: async (businessId: string, params: {
      // Status filter
      status?: 'paid' | 'open' | 'overdue';

      // Date filters
      billDateFrom?: string;
      billDateTo?: string;
      dueDateFrom?: string;
      dueDateTo?: string;
      dueWithin?: number; // bills due within X days

      // Vendor filter
      vendors?: string[];

      // Amount range filter
      amountMin?: number;
      amountMax?: number;

      // Pagination
      page?: number;
      limit?: number;

      // Sorting
      sortBy?: 'dueDate' | 'billDate' | 'amount' | 'vendor' | 'status';
      sortOrder?: 'asc' | 'desc';
    }) => {
      // TODO: Get all bills with server-side filtering
      // const queryParams = new URLSearchParams({
      //   businessId,
      //   ...Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null))
      // });
      // return this.request(`/bills?${queryParams}`);

      console.log('TODO: Implement bills.getAll API call', { businessId, params });
      throw new Error('API not implemented yet');
    },

    getDetails: async (businessId: string, billId: string) => {
      // TODO: Get detailed bill information with OCR data
      // return this.request(`/bills/${billId}/details?businessId=${businessId}`);

      console.log('TODO: Implement bills.getDetails API call', { businessId, billId });
      throw new Error('API not implemented yet');
    },

    pay: async (businessId: string, billId: string, paymentData: {
      paymentMethod: string;
      amount: number;
      paymentDate?: string;
      notes?: string;
    }) => {
      // TODO: Process payment for a bill
      // return this.request(`/bills/${billId}/pay`, {
      //   method: 'POST',
      //   body: JSON.stringify({ businessId, ...paymentData }),
      // });

      console.log('TODO: Implement bills.pay API call', { businessId, billId, paymentData });
      throw new Error('API not implemented yet');
    },

    bulkPay: async (businessId: string, billIds: string[], paymentData: {
      paymentMethod: string;
      paymentDate?: string;
      notes?: string;
    }) => {
      // TODO: Process bulk payment for multiple bills
      // return this.request('/bills/bulk-pay', {
      //   method: 'POST',
      //   body: JSON.stringify({ businessId, billIds, ...paymentData }),
      // });

      console.log('TODO: Implement bills.bulkPay API call', { businessId, billIds, paymentData });
      throw new Error('API not implemented yet');
    },

    upload: async (businessId: string, file: File, metadata?: any) => {
      // TODO: Upload bill for OCR processing
      // const formData = new FormData();
      // formData.append('file', file);
      // formData.append('businessId', businessId);
      // if (metadata) formData.append('metadata', JSON.stringify(metadata));
      //
      // return this.request('/bills/upload', {
      //   method: 'POST',
      //   body: formData,
      //   headers: {} // Remove Content-Type to let browser set multipart boundary
      // });

      console.log('TODO: Implement bills.upload API call', { businessId, fileName: file.name, metadata });
      throw new Error('API not implemented yet');
    },

    getOcrData: async (businessId: string, billId: string) => {
      // TODO: Get OCR parsing results and confidence scores
      // return this.request(`/bills/${billId}/ocr?businessId=${businessId}`);

      console.log('TODO: Implement bills.getOcrData API call', { businessId, billId });
      throw new Error('API not implemented yet');
    },

    updateOcrData: async (businessId: string, billId: string, ocrData: any) => {
      // TODO: Update/correct OCR parsed data
      // return this.request(`/bills/${billId}/ocr`, {
      //   method: 'PUT',
      //   body: JSON.stringify({ businessId, ...ocrData }),
      // });

      console.log('TODO: Implement bills.updateOcrData API call', { businessId, billId, ocrData });
      throw new Error('API not implemented yet');
    },

    getPaymentHistory: async (businessId: string, billId: string) => {
      // TODO: Get payment history for a specific bill
      // return this.request(`/bills/${billId}/payments?businessId=${businessId}`);

      console.log('TODO: Implement bills.getPaymentHistory API call', { businessId, billId });
      throw new Error('API not implemented yet');
    },

    delete: async (businessId: string, billId: string) => {
      // TODO: Delete a bill
      // return this.request(`/bills/${billId}?businessId=${businessId}`, { method: 'DELETE' });

      console.log('TODO: Implement bills.delete API call', { businessId, billId });
      throw new Error('API not implemented yet');
    },

    exportData: async (businessId: string, params: {
      format: 'csv' | 'excel' | 'pdf';
      dateFrom?: string;
      dateTo?: string;
      status?: string[];
    }) => {
      // TODO: Export bills data in various formats
      // const queryParams = new URLSearchParams({
      //   businessId,
      //   ...Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null))
      // });
      // return this.request(`/bills/export?${queryParams}`);

      console.log('TODO: Implement bills.exportData API call', { businessId, params });
      throw new Error('API not implemented yet');
    }
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
  banks: banksAPI,
  bills: billsAPI,
  paymentHistory: paymentHistoryAPI,
  upcomingPayments: upcomingPaymentsAPI,
  dashboard: dashboardAPI,
  paymentInsights: paymentInsightsAPI,
  notifications: notificationsAPI
} = apiService;