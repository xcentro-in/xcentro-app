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
        isLoading: false,
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

// Mock user data for development - TODO: Replace with actual API calls
const MOCK_USER_DATA: AuthUser = {
  id: "user-001",
  name: "Arvind Mehta",
  email: "arvind@abccompany.com",
  role: "owner",
  department: "Executive",
  businessId: "01936d7a-7c8e-7890-b123-456789abcdef",
  businessName: "ABC Company",
  rewardPoints: 24530,
  
  // Onboarding tracking - set to false to see empty state
  showDashboard: false,
  hasAddedPaymentMethod: true,
  hasAddedVendor: true,
  hasCreatedFirstPayment: false,
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
          role: '',
          businessId: '',
          businessName: '',
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
      console.error('Logout API call failed:', error);
      // Continue with local cleanup even if API fails
    }

    // Clear localStorage items (tokens are in cookies, cleared by backend)
    localStorage.removeItem('business-id');
    localStorage.removeItem('user-data');

    // Clear user roles
    setUserRolesState([]);

    dispatch({ type: 'LOGOUT' });
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
   * Single method that fetches ALL user data in one go:
   * - User profile
   * - User roles
   * - Onboarding status (KYB + KYC)
   *
   * Called by:
   * - Login (after successful authentication)
   * - Page reload (via useEffect)
   * - After completing onboarding steps
   */
  const initializeUser = async (): Promise<void> => {
    try {
      console.log('[AuthContext] Initializing user data...');

      // Step 1: Fetch user profile
      const profileResponse = await userAPI.getProfile();
      const profile = profileResponse.data;
      console.log('[AuthContext] User profile fetched:', profile.userId);

      // Step 2: Fetch user roles
      const rolesResponse = await userAPI.getRoles();
      const roles = rolesResponse.data;
      console.log('[AuthContext] User roles fetched:', roles.length, 'roles');

      // Store roles in state
      setUserRolesState(roles);

      // Step 3: Get primary business info from first role
      const primaryRole = roles[0];
      const businessId = primaryRole?.businessId || '';
      const role = primaryRole?.role || '';

      // Step 4: Fetch combined onboarding status (KYB + KYC + app onboarding)
      let combinedOnboardingStatus: OnboardingStatus = {
        kybStatus: undefined,
        kybInitiated: false,
        kycStatus: undefined,
        showDashboard: false,
        hasAddedPaymentMethod: false,
        hasAddedVendor: false,
        hasCreatedFirstPayment: false,
      };

      // Fetch business onboarding status (KYB)
      try {
        const { businessAPI } = await import('@/services/api');
        const businessStatusResponse = await businessAPI.getOnboardingStatus();
        if (businessStatusResponse.data) {
          combinedOnboardingStatus.kybStatus = businessStatusResponse.data.kybStatus;
          combinedOnboardingStatus.kybInitiated = businessStatusResponse.data.kybInitiated ?? false;
        }
      } catch (businessError) {
        console.log('[AuthContext] No business onboarding found (expected for new users)');
      }

      // Fetch user onboarding status (KYC)
      try {
        const userStatusResponse = await userAPI.getOnboardingStatus();
        if (userStatusResponse.data) {
          combinedOnboardingStatus.kycStatus = userStatusResponse.data.kycStatus;
        }
      } catch (userError) {
        console.log('[AuthContext] No user onboarding found (expected for new users)');
      }

      // Fetch app onboarding status (payment methods, vendors, etc.)
      try {
        if (businessId) {
          const appOnboardingResponse = await authAPI.getOnboardingStatus(businessId);
          if (appOnboardingResponse.data) {
            combinedOnboardingStatus.showDashboard = appOnboardingResponse.data.showDashboard ?? false;
            combinedOnboardingStatus.hasAddedPaymentMethod = appOnboardingResponse.data.hasAddedPaymentMethod ?? false;
            combinedOnboardingStatus.hasAddedVendor = appOnboardingResponse.data.hasAddedVendor ?? false;
            combinedOnboardingStatus.hasCreatedFirstPayment = appOnboardingResponse.data.hasCreatedFirstPayment ?? false;
          }
        }
      } catch (appOnboardingError) {
        console.log('[AuthContext] App onboarding status not available');
      }

      // Store combined onboarding status
      setOnboardingStatus(combinedOnboardingStatus);
      console.log('[AuthContext] Onboarding status:', combinedOnboardingStatus);

      // Step 5: Create user object
      const user: AuthUser = {
        id: profile.userId,
        name: profile.name,
        email: profile.email,
        mobile: profile.mobile,
        taxId: profile.taxId,
        maskedNationalId: profile.maskedNationalId,
        role: role,
        businessId: businessId,
        businessName: '', // Will be populated by BusinessContext
        rewardPoints: 0,
        // App onboarding flags
        showDashboard: combinedOnboardingStatus.showDashboard,
        hasAddedPaymentMethod: combinedOnboardingStatus.hasAddedPaymentMethod,
        hasAddedVendor: combinedOnboardingStatus.hasAddedVendor,
        hasCreatedFirstPayment: combinedOnboardingStatus.hasCreatedFirstPayment,
      };

      // Update auth state
      dispatch({ type: 'SET_USER', payload: user });
      console.log('[AuthContext] User initialization complete');
    } catch (error) {
      console.error('[AuthContext] Failed to initialize user:', error);
      throw error;
    }
  };

  /**
   * DEPRECATED: Use initializeUser() instead
   * Kept for backward compatibility
   */
  const fetchUserProfile = async (): Promise<void> => {
    console.warn('[AuthContext] fetchUserProfile is deprecated, use initializeUser instead');
    await initializeUser();
  };

  const refreshAuth = async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const userData = localStorage.getItem('user-data');

      if (userData) {
        // TODO: Validate session with backend using cookies
        // const response = await authAPI.validateToken();

        const user: AuthUser = JSON.parse(userData);
        dispatch({ type: 'SET_USER', payload: user });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Auth refresh failed:', error);
      logout();
    }
  };

  const refreshOnboardingStatus = async (): Promise<void> => {
    // Don't call if no user or no businessId
    if (!state.user?.businessId) {
      console.warn('Cannot refresh onboarding status: no user or businessId');
      return;
    }

    try {
      const onboardingResponse = await authAPI.getOnboardingStatus(state.user.businessId);

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
  };

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
      try {
        // Try to initialize user data - will succeed if user has valid auth cookies
        await initializeUser();
      } catch (error: any) {
        // Check if error is MISSING_TOKEN or INVALID_TOKEN (no valid auth cookies)
        if (error?.code === 'MISSING_TOKEN' || error?.code === 'INVALID_TOKEN') {
          // User is not authenticated - just set loading to false, don't call logout
          // Calling logout() here causes infinite loop because logout calls the API
          dispatch({ type: 'LOGOUT' });
        } else {
          // Some other error occurred - log it and clear auth state
          console.error('Unexpected auth error:', error);
          dispatch({ type: 'LOGOUT' });
        }
      }
    };

    initAuth();
  }, []);

  // Global error handler for API 401 errors that occur during normal app usage (after auth is established)
  useEffect(() => {
    const handleUnauthorized = (event: CustomEvent) => {
      // Only handle if user was previously authenticated
      if (state.isAuthenticated) {
        console.log('[AuthContext] Session expired during app usage, logging out');
        // Clear local state immediately
        localStorage.removeItem('business-id');
        localStorage.removeItem('user-data');
        setUserRolesState([]);
        dispatch({ type: 'LOGOUT' });
        // Redirect to login
        window.location.href = '/login';
      }
    };

    // Listen for custom unauthorized events from API service
    window.addEventListener('api:unauthorized', handleUnauthorized as EventListener);

    return () => {
      window.removeEventListener('api:unauthorized', handleUnauthorized as EventListener);
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