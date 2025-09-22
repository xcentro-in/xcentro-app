// TODO: Replace with actual backend API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('auth-token');

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);

      if (!response.ok) {
        // TODO: Implement proper error handling
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Auth endpoints - TODO: Implement when backend is ready
  auth = {
    login: async (email: string, password: string) => {
      // TODO: Implement actual login API call
      // return this.request('/auth/login', {
      //   method: 'POST',
      //   body: JSON.stringify({ email, password }),
      // });

      // Mock implementation for development
      console.log('TODO: Implement auth.login API call', { email, password });
      throw new Error('API not implemented yet');
    },

    logout: async () => {
      // TODO: Implement actual logout API call
      // return this.request('/auth/logout', { method: 'POST' });

      console.log('TODO: Implement auth.logout API call');
    },

    validateToken: async () => {
      // TODO: Implement token validation
      // return this.request('/auth/validate');

      console.log('TODO: Implement auth.validateToken API call');
      throw new Error('API not implemented yet');
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

  // User endpoints - TODO: Implement when backend is ready
  user = {
    getProfile: async () => {
      // TODO: Get current user profile
      // return this.request('/user/profile');

      console.log('TODO: Implement user.getProfile API call');
      throw new Error('API not implemented yet');
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
    }
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
}

export const apiService = new ApiService();

// Export individual services for easier imports
export const {
  auth: authAPI,
  user: userAPI,
  payments: paymentsAPI,
  dashboard: dashboardAPI,
  paymentInsights: paymentInsightsAPI,
  notifications: notificationsAPI
} = apiService;