export interface AuthUser {
  id: string;
  kyc_status?: string;

  // Onboarding progress flags — used by nav access control and dashboard checklist
  hasAddedPaymentMethod?: boolean;
  hasAddedVendor?: boolean;
  hasCreatedFirstPayment?: boolean;
  showDashboard?: boolean;

  // Profile fields — lazy-loaded (Settings/Profile page only)
  name?: string;
  email?: string;
  mobile?: string;
  taxId?: string;
  maskedNationalId?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Shape returned by GET /v1/auth/verify-session
export interface SessionData {
  uid: string;
  kyc_status: string; // "kyc_not_started" | "kyc_in_progress" | "kyc_completed" | "kyc_verified" | "kyc_needs_update" | "kyc_rejected"
  businesses: SessionBusiness[];
  active_bid: string; // "" if no active business
}

export interface SessionBusiness {
  bid: string;
  name: string;
  role: string;       // "owner" | "admin" | "manager" | "auditor" | "none" | ""
  kyb_status: string; // "kyc_not_started" | "kyc_in_progress" | "kyc_completed" | "kyc_verified" | "kyc_needs_update" | "kyc_rejected"
}

// Kept for BusinessContext compatibility
export interface BusinessInLogin {
  bid: string;
  name: string;
  role: string;
  kyb_status: string;
}

export interface SwitchBusinessResponse {
  message: string;
  data: {
    bid: string;
    role: string;
    kyb_status: string;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}
