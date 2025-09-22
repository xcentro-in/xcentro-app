export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  businessId: string;
  businessName: string;
  rewardPoints?: number;
  avatar?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token?: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
  refreshToken?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}