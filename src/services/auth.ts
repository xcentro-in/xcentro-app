
import { httpClient } from '../client/http-client';

interface UserPayload {
  id: string;
  emailId: string;
  businessId: string;
  role: string;
}

interface LoginResponse {
  userPayload: UserPayload;
  token: string;
}

interface LoginError {
  success: false;
  error: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await httpClient.post('users/login', {
      json: { 
        emailId: email, 
        password: password 
      }
    }).json<LoginResponse | LoginError>();
    
    if ('success' in response && !response.success) {
      throw new Error(response.error);
    }
    
    // Store user data and token
    localStorage.setItem('user', JSON.stringify((response as LoginResponse).userPayload));
    localStorage.setItem('jwt', (response as LoginResponse).token);
    
    return response as LoginResponse;
  },
  
  getUser: (): UserPayload | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
  }
};
