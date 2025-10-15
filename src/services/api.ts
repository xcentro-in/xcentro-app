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
    options: RequestInit = {}
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
        // Create error object with both message and error code
        const error: any = new Error(errorData.message || `HTTP ${response.status}`);
        error.code = errorData.error; // Preserve error code (e.g., "MISSING_TOKEN")
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
        kybNeeded: boolean;
        kycNeeded: boolean;
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

      // Only add X-Business-Id header if businessId is provided (new business flow)
      if (businessId) {
        headers['X-Business-Id'] = businessId;
      }

      return this.request('/user/onboard/init', {
        method: 'POST',
        headers,
        body: JSON.stringify({ name, dob, taxId, nationalId }),
      });
    },

    // Complete user onboarding with role claim
    // For new business flow: pass businessId in header
    // For join existing business flow: pass gstin in body
    completeOnboarding: async (
      claimedRole: string,
      businessId?: string,
      gstin?: string
    ): Promise<{
      data: {
        status: string;
      };
      message: string;
    }> => {
      const headers: Record<string, string> = {};
      const body: any = { claimedRole };

      if (businessId) {
        // New business flow: use X-Business-Id header
        headers['X-Business-Id'] = businessId;
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
    getOnboardingStatus: async (): Promise<{
      data: {
        userId: string;
        email: string;
        name: string;
        dob: string;
        mobile: string;
        taxId: string;
        nationalId: string;
        kycStatus: string;
        emailVerified: boolean;
        mobileVerified: boolean;
      };
      message: string;
    }> => {
      return this.request('/user/onboard/status', {
        method: 'GET',
      });
    },
  };

  // Business endpoints
  business = {
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
          'X-Business-Id': bid,
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
          'X-Business-Id': bid,
        },
      });
    },

    // Complete business onboarding
    completeOnboarding: async (
      bid: string,
      businessType: string,
      pan: string,
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
        itid: pan,
      };

      if (cin) {
        body.cid = cin;
      }

      return this.request('/business/onboard/complete', {
        method: 'POST',
        headers: {
          'X-Business-Id': bid,
        },
        body: JSON.stringify(body),
      });
    },

    // Get business onboarding status
    getOnboardingStatus: async (): Promise<{
      data: {
        bid: string;
        name: string;
        gstin: string;
        kybStatus: string;
        kybInitiated: boolean;
        requiresDeedUpload: boolean;
        hasDeedUploaded: boolean;
        businessType?: string; // Optional, backend will add this
      };
      message: string;
    }> => {
      return this.request('/business/onboard/status', {
        method: 'GET',
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