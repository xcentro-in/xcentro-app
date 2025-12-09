export interface AuthUser {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  taxId?: string;
  maskedNationalId?: string;
  // Note: Use AuthContext.userRoles to get user's role(s) and business associations
  // For single-business users, userRoles[0] is the primary role
  // For multi-business users, use BusinessContext.selectedBusiness for current context
  department?: string;
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