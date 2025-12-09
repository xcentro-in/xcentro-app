import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { AuthState, AuthUser, LoginResponse } from '@/types/auth';
import { authAPI, userAPI } from '@/services/api';

export interface UserRole {
  userId: string;
  businessId: string;
  role: string;
  kycNeeded: boolean;
}

export interface OnboardingStatus {
  kybStatus?: string;
  kybInitiated?: boolean;
  kycStatus?: string;
  showDashboard?: boolean;
  hasAddedPaymentMethod?: boolean;
  hasAddedVendor?: boolean;
  hasCreatedFirstPayment?: boolean;
  
  // Business details for pre-filling onboarding
  bid?: string;
  businessName?: string;
  gstin?: string;
  businessType?: string;
  cin?: string;

  // User KYC details for pre-filling onboarding
  userName?: string;
  dob?: string;
  pan?: string;
  aadhaar?: string;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<AuthUser>) => void;
  refreshAuth: () => Promise<void>;
  setUserRoles: (roles: UserRole[]) => void;
  userRoles: UserRole[];
  fetchUserProfile: () => Promise<void>;
  refreshOnboardingStatus: () => Promise<void>;
  optimisticallyUpdateOnboardingFlag: (
    flag: 'hasAddedPaymentMethod' | 'hasAddedVendor' | 'hasCreatedFirstPayment',
    verified?: boolean
  ) => void;
  initializeUser: () => Promise<void>;
  onboardingStatus: OnboardingStatus | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: LoginResponse }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<AuthUser> }
  | { type: 'SET_USER'; payload: AuthUser }
  | { type: 'SET_USER_ROLES'; payload: UserRole[] };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        // Keep isLoading true until user profile/roles are fully fetched
        // This prevents ProtectedRoute from making premature routing decisions
        isLoading: true,
      };

    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        token: undefined,
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };

    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };

    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with true to prevent flicker during auth check
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [userRoles, setUserRolesState] = React.useState<UserRole[]>([]);
  const [onboardingStatus, setOnboardingStatus] = React.useState<OnboardingStatus | null>(null);

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // Call the actual login API
      const apiResponse = await authAPI.login(email, password);

      // Note: Tokens are already stored in cookies by the backend
      // After login, we immediately fetch roles to determine routing
      const loginResponse: LoginResponse = {
        user: {
          id: '', // Will be populated from user profile API later
          name: '',
          email: email,
        },
        token: apiResponse.data.accessToken, // Not stored, just returned for context
        refreshToken: apiResponse.data.refreshToken, // Not stored, just returned for context
      };

      dispatch({ type: 'LOGIN_SUCCESS', payload: loginResponse });

      return loginResponse;
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Call logout API to invalidate token on server
      await authAPI.logout();
    } catch (error) {
      console.error('[AuthContext] Logout API call failed:', error);
      // Continue with local cleanup even if API fails
    }

    // Clear localStorage items (tokens are in cookies, cleared by backend)
    localStorage.removeItem('business-id');
    localStorage.removeItem('user-data');

    // Clear user roles and onboarding status
    setUserRolesState([]);
    setOnboardingStatus(null);

    // Update auth state
    dispatch({ type: 'LOGOUT' });

    console.log('[AuthContext] User logged out successfully');
  };

  const setUserRoles = (roles: UserRole[]): void => {
    setUserRolesState(roles);
  };

  const updateUser = (userData: Partial<AuthUser>): void => {
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      localStorage.setItem('user-data', JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_USER', payload: userData });
    }
  };

  /**
   * CENTRALIZED USER INITIALIZATION
   *
   * Atomically fetches ALL user data:
   * - User profile
   * - User roles
   * - Onboarding status (KYB + KYC + app onboarding)
   *
   * Either all succeeds or all fails (atomic operation)
   *
   * Called by:
   * - Login (after successful authentication)
   * - Page reload (via useEffect)
   * - After completing onboarding steps
   */
  const initializeUser = async (): Promise<void> => {
    let profile: any = null;
    let roles: UserRole[] = [];
    let combinedOnboardingStatus: OnboardingStatus = {
      kybStatus: undefined,
      kybInitiated: false,
      kycStatus: undefined,
      showDashboard: false,
      hasAddedPaymentMethod: false,
      hasAddedVendor: false,
      hasCreatedFirstPayment: false,
    };

    try {
      // Step 1: Fetch CRITICAL data (profile + roles)
      // These must succeed for the user session to be valid
      const [profileResponse, rolesResponse] = await Promise.all([
        userAPI.getProfile(),
        userAPI.getRoles(),
      ]);

      profile = profileResponse.data;
      roles = rolesResponse.data;

      // Step 2: Fetch OPTIONAL onboarding data in parallel
      // These can fail gracefully without breaking the session
      const primaryRole = roles[0];
      const businessId = primaryRole?.businessId || '';

      const [businessStatusResult, userStatusResult, appOnboardingResult] = await Promise.allSettled([
        // Business KYB status
        (async () => {
          const { businessAPI } = await import('@/services/api');
          return businessAPI.getOnboardingStatus();
        })(),
        // User KYC status
        userAPI.getOnboardingStatus(),
        // App onboarding status (payment methods, vendors, first payment)
        // Used for dashboard milestones/onboarding checklist
        businessId ? authAPI.getOnboardingStatus(businessId) : Promise.resolve({ data: null }),
      ]);

      // Extract business status
      if (businessStatusResult.status === 'fulfilled' && businessStatusResult.value?.data) {
        const data = businessStatusResult.value.data;
        combinedOnboardingStatus.kybStatus = data.kybStatus;
        combinedOnboardingStatus.kybInitiated = data.kybInitiated ?? false;
        
        // Store business details
        combinedOnboardingStatus.bid = data.bid;
        combinedOnboardingStatus.businessName = data.name;
        combinedOnboardingStatus.gstin = data.gstin;
        combinedOnboardingStatus.businessType = data.businessType;
        combinedOnboardingStatus.cin = data.cid;
      }

      // Extract user KYC status
      if (userStatusResult.status === 'fulfilled' && userStatusResult.value?.data) {
        const data = userStatusResult.value.data;
        combinedOnboardingStatus.kycStatus = data.kycStatus;
        
        // Store user details
        combinedOnboardingStatus.userName = data.name;
        combinedOnboardingStatus.dob = data.dob;
        combinedOnboardingStatus.pan = data.taxId;
        combinedOnboardingStatus.aadhaar = data.nationalId;
      }

      // Extract app onboarding status (for dashboard milestones)
      if (appOnboardingResult.status === 'fulfilled' && appOnboardingResult.value?.data) {
        const data = appOnboardingResult.value.data;
        combinedOnboardingStatus.showDashboard = data.showDashboard ?? false;
        combinedOnboardingStatus.hasAddedPaymentMethod = data.hasAddedPaymentMethod ?? false;
        combinedOnboardingStatus.hasAddedVendor = data.hasAddedVendor ?? false;
        combinedOnboardingStatus.hasCreatedFirstPayment = data.hasCreatedFirstPayment ?? false;
      }

      // Step 3: Create user object with all data
      // Note: businessId and role are NOT stored in user object
      // Use userRoles array to get business associations and roles
      const user: AuthUser = {
        id: profile.userId,
        name: profile.name,
        email: profile.email,
        mobile: profile.mobile,
        taxId: profile.taxId,
        maskedNationalId: profile.maskedNationalId,
        rewardPoints: 0,
        // App onboarding flags
        showDashboard: combinedOnboardingStatus.showDashboard,
        hasAddedPaymentMethod: combinedOnboardingStatus.hasAddedPaymentMethod,
        hasAddedVendor: combinedOnboardingStatus.hasAddedVendor,
        hasCreatedFirstPayment: combinedOnboardingStatus.hasCreatedFirstPayment,
      };

      // Step 4: Atomically update all state (all or nothing)
      setUserRolesState(roles);
      setOnboardingStatus(combinedOnboardingStatus);
      dispatch({ type: 'SET_USER', payload: user });

      console.log('[AuthContext] User initialized successfully');
    } catch (error: any) {
      console.error('[AuthContext] Failed to initialize user:', error);

      // Clear any partial state on failure
      setUserRolesState([]);
      setOnboardingStatus(null);
      
      // Stop loading even if initialization failed so UI doesn't hang indefinitely
      // Depending on error type, we might want to logout or show error
      dispatch({ type: 'SET_LOADING', payload: false });

      // Re-throw to let caller handle
      throw error;
    }
  };

  // Effect to trigger initialization after successful login
  useEffect(() => {
    // If authenticated but user ID is missing (dummy user from login), trigger initialization
    if (state.isAuthenticated && state.user && !state.user.id) {
      console.log('[AuthContext] Authenticated but incomplete profile, initializing user...');
      initializeUser().catch(err => {
        console.error('[AuthContext] Auto-initialization failed:', err);
        // If init fails after login, we probably should logout to reset state
        dispatch({ type: 'LOGOUT' });
      });
    }
  }, [state.isAuthenticated, state.user]);

  /**
   * DEPRECATED: Use initializeUser() instead
   * Kept for backward compatibility
   */
  const fetchUserProfile = async (): Promise<void> => {
    console.warn('[AuthContext] fetchUserProfile is deprecated, use initializeUser instead');
    await initializeUser();
  };

  /**
   * DEPRECATED: Use initializeUser() instead
   * Authentication state is now managed via httpOnly cookies, not localStorage
   */
  const refreshAuth = async (): Promise<void> => {
    console.warn('[AuthContext] refreshAuth is deprecated, use initializeUser instead');
    await initializeUser();
  };

  const refreshOnboardingStatus = React.useCallback(async (): Promise<void> => {
    // Don't call if no user or no roles
    if (!state.user || !userRoles || userRoles.length === 0) {
      console.warn('Cannot refresh onboarding status: no user or roles');
      return;
    }

    try {
      const primaryBusinessId = userRoles[0].businessId;
      const onboardingResponse = await authAPI.getOnboardingStatus(primaryBusinessId);

      if (onboardingResponse.data) {
        // Update only the onboarding flags
        updateUser({
          showDashboard: onboardingResponse.data.showDashboard ?? false,
          hasAddedPaymentMethod: onboardingResponse.data.hasAddedPaymentMethod ?? false,
          hasAddedVendor: onboardingResponse.data.hasAddedVendor ?? false,
          hasCreatedFirstPayment: onboardingResponse.data.hasCreatedFirstPayment ?? false,
        });
      }
    } catch (error) {
      console.error('Failed to refresh onboarding status:', error);
      // Don't throw - this is a non-critical update
    }
  }, [state.user, userRoles, updateUser]);

  /**
   * Optimistically update onboarding flag without waiting for backend
   * Only updates from false -> true (idempotent, safe)
   * Backend will sync the real value on page reload
   *
   * @param flag - The onboarding flag to update
   * @param verified - Optional: whether the operation was verified (e.g., checking list count)
   */
  const optimisticallyUpdateOnboardingFlag = (
    flag: 'hasAddedPaymentMethod' | 'hasAddedVendor' | 'hasCreatedFirstPayment',
    verified: boolean = true
  ): void => {
    if (!state.user) {
      return;
    }

    // Only update if currently false (idempotent - never flip from true to false)
    if (!state.user[flag] && verified) {
      updateUser({ [flag]: true });
    }
  };

  // Initialize auth state on mount - check for existing session
  useEffect(() => {
    const initAuth = async () => {
      // Don't try to initialize if we're on login/signup/public pages
      // This prevents infinite loops when refresh tokens fail
      const publicPaths = ['/login', '/signup', '/forgot-password', '/reset-password', '/verify-email'];
      if (publicPaths.includes(window.location.pathname)) {
        console.log('[AuthContext] On public page, skipping auth initialization');
        dispatch({ type: 'LOGOUT' });
        return;
      }

      try {
        // Try to initialize user data - will succeed if user has valid auth cookies
        await initializeUser();
      } catch (error: any) {
        // Check if error is MISSING_TOKEN or INVALID_TOKEN (no valid auth cookies)
        if (error?.code === 'MISSING_TOKEN' || error?.code === 'INVALID_TOKEN') {
          // User is not authenticated - just set loading to false
          dispatch({ type: 'LOGOUT' });
        } else {
          // Some other error occurred - log it and clear auth state
          console.error('[AuthContext] Unexpected auth error:', error);
          dispatch({ type: 'LOGOUT' });
        }
      }
    };

    initAuth();
  }, []);

  // Global error handlers for auth events from API service
  useEffect(() => {
    let isHandlingSessionExpiry = false;

    /**
     * Handle unauthorized access (MISSING_TOKEN / INVALID_TOKEN)
     * User was never properly authenticated or token is invalid
     */
    const handleUnauthorized = (event: CustomEvent) => {
      // Guard: Skip if already handling session expiry
      if (isHandlingSessionExpiry) {
        return;
      }

      // Only handle if user was previously authenticated
      if (state.isAuthenticated) {
        console.log('[AuthContext] Unauthorized access detected, logging out');
        // Clear local state immediately
        localStorage.removeItem('business-id');
        localStorage.removeItem('user-data');
        setUserRolesState([]);
        setOnboardingStatus(null);
        dispatch({ type: 'LOGOUT' });
      }
    };

    /**
     * Handle session expiration (refresh token expired)
     * User was authenticated but session has now expired
     */
    const handleSessionExpired = () => {
      // Guard: Only handle once
      if (isHandlingSessionExpiry) {
        console.log('[AuthContext] Already handling session expiry, skipping');
        return;
      }

      console.log('[AuthContext] Session expired, clearing state');
      isHandlingSessionExpiry = true;

      // Clear local state
      localStorage.removeItem('business-id');
      localStorage.removeItem('user-data');
      setUserRolesState([]);
      setOnboardingStatus(null);
      dispatch({ type: 'LOGOUT' });
      // Note: ProtectedRoute will handle redirect to /login via <Navigate>
    };

    // Listen for auth events from API service
    window.addEventListener('api:unauthorized', handleUnauthorized as EventListener);
    window.addEventListener('api:session-expired', handleSessionExpired as EventListener);

    return () => {
      window.removeEventListener('api:unauthorized', handleUnauthorized as EventListener);
      window.removeEventListener('api:session-expired', handleSessionExpired as EventListener);
    };
  }, [state.isAuthenticated]);

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    updateUser,
    refreshAuth,
    setUserRoles,
    userRoles,
    fetchUserProfile,
    refreshOnboardingStatus,
    optimisticallyUpdateOnboardingFlag,
    initializeUser,
    onboardingStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// TODO: Create actual API service
/*
Example API service structure:

export const authAPI = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  },

  logout: async (): Promise<void> => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
      },
    });
  },

  validateToken: async (token: string): Promise<AuthUser> => {
    const response = await fetch('/api/auth/validate', {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error('Token validation failed');
    }

    return response.json();
  },

  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    return response.json();
  }
};
*/