
import ky from 'ky';

// Create base HTTP client
export const httpClient = ky.extend({
  prefixUrl: 'http://0.0.0.0:8000',
  hooks: {
    beforeRequest: [
      request => {
        // Get JWT from localStorage
        const token = localStorage.getItem('jwt');
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      }
    ],
    afterResponse: [
      async (request, options, response) => {
        // Handle token refresh or other response interceptors if needed
        if (response.status === 401) {
          // Handle unauthorized access
          // You might want to redirect to login or refresh token
          localStorage.removeItem('jwt');
          window.location.href = '/login';
        }
        return response;
      }
    ]
  },
  retry: {
    limit: 2,
    methods: ['get', 'post', 'put', 'patch', 'delete']
  },
  timeout: 30000,
  credentials: 'include'
});

// Export type for response handling
export type ApiResponse<T> = Promise<T>;
