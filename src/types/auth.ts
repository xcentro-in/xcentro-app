export interface AuthUser {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  taxId?: string;
  maskedNationalId?: string;
  role: string;
  department?: string;
  businessId: string;
  businessName: string;
  rewardPoints?: number;
  avatar?: string;
  
  // Onboarding tracking flags
  showDashboard?: boolean;
  hasAddedPaymentMethod?: boolean;
  hasAddedVendor?: boolean;
  hasCreatedFirstPayment?: boolean;
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
  kybNeeded?: boolean;
  kycNeeded?: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}