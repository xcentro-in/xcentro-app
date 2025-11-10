import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { AuthState, AuthUser, LoginResponse } from '@/types/auth';
import { authAPI, userAPI } from '@/services/api';

export interface UserRole {
  userId: string;
  businessId: string;
  role: string;
  kycNeeded: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<AuthUser>) => void;
  refreshAuth: () => Promise<void>;
  setUserRoles: (roles: UserRole[]) => void;
  userRoles: UserRole[];
  fetchUserProfile: () => Promise<void>;
  refreshOnboardingStatus: (options?: {
    withRetry?: boolean;
    maxRetries?: number;
    initialDelay?: number;
  }) => Promise<void>;
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
  hasCompletedOnboarding: false,
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

  const fetchUserProfile = async (): Promise<void> => {
    try {
      // Fetch user profile and roles
      const profileResponse = await userAPI.getProfile();
      const rolesResponse = await userAPI.getRoles();

      const profile = profileResponse.data;
      const roles = rolesResponse.data;

      // Store roles
      setUserRolesState(roles);

      // Get businessId and role from first role (or let user select later)
      const primaryRole = roles[0];
      const businessId = primaryRole?.businessId || '';
      const role = primaryRole?.role || '';

      // TODO: Fetch business name from business API if needed
      // For now, we'll leave it empty or get it from a business list API later
      const businessName = ''; // Will be populated when we have business details API

      // Fetch onboarding status
      let onboardingStatus = {
        hasCompletedOnboarding: false,
        hasAddedPaymentMethod: false,
        hasAddedVendor: false,
        hasCreatedFirstPayment: false,
      };

      try {
        if (businessId) {
          const onboardingResponse = await authAPI.getOnboardingStatus(businessId);
          if (onboardingResponse.data) {
            onboardingStatus = {
              hasCompletedOnboarding: onboardingResponse.data.hasCompletedOnboarding ?? false,
              hasAddedPaymentMethod: onboardingResponse.data.hasAddedPaymentMethod ?? false,
              hasAddedVendor: onboardingResponse.data.hasAddedVendor ?? false,
              hasCreatedFirstPayment: onboardingResponse.data.hasCreatedFirstPayment ?? false,
            };
          }
        }
      } catch (onboardingError) {
        console.error('Failed to fetch onboarding status, using defaults:', onboardingError);
        // Use default values (all false) if API call fails
      }

      // Create user object
      const user: AuthUser = {
        id: profile.userId,
        name: profile.name,
        email: profile.email,
        mobile: profile.mobile,
        taxId: profile.taxId,
        maskedNationalId: profile.maskedNationalId,
        role: role,
        businessId: businessId,
        businessName: businessName,
        // Optional fields - add defaults or fetch from profile if needed
        rewardPoints: 0,
        // Onboarding flags from API
        ...onboardingStatus,
      };

      // Update auth state
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw error;
    }
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

  const refreshOnboardingStatus = async (options?: {
    withRetry?: boolean;
    maxRetries?: number;
    initialDelay?: number;
  }): Promise<void> => {
    // Don't call if no user or no businessId
    if (!state.user?.businessId) {
      console.warn('Cannot refresh onboarding status: no user or businessId');
      return;
    }

    const {
      withRetry = false,
      maxRetries = 3,
      initialDelay = 800,
    } = options || {};

    // Store current flag values to detect changes
    const currentFlags = {
      hasCompletedOnboarding: state.user?.hasCompletedOnboarding ?? false,
      hasAddedPaymentMethod: state.user?.hasAddedPaymentMethod ?? false,
      hasAddedVendor: state.user?.hasAddedVendor ?? false,
      hasCreatedFirstPayment: state.user?.hasCreatedFirstPayment ?? false,
    };

    const attemptRefresh = async (attemptNumber: number): Promise<boolean> => {
      try {
        const onboardingResponse = await authAPI.getOnboardingStatus(state.user!.businessId);

        if (onboardingResponse.data) {
          const newFlags = {
            hasCompletedOnboarding: onboardingResponse.data.hasCompletedOnboarding ?? false,
            hasAddedPaymentMethod: onboardingResponse.data.hasAddedPaymentMethod ?? false,
            hasAddedVendor: onboardingResponse.data.hasAddedVendor ?? false,
            hasCreatedFirstPayment: onboardingResponse.data.hasCreatedFirstPayment ?? false,
          };

          // Update the user state
          updateUser(newFlags);

          // Check if any flag changed from false to true
          const hasChanges =
            (!currentFlags.hasAddedPaymentMethod && newFlags.hasAddedPaymentMethod) ||
            (!currentFlags.hasAddedVendor && newFlags.hasAddedVendor) ||
            (!currentFlags.hasCreatedFirstPayment && newFlags.hasCreatedFirstPayment) ||
            (!currentFlags.hasCompletedOnboarding && newFlags.hasCompletedOnboarding);

          if (hasChanges) {
            console.log(`✅ Onboarding status updated successfully on attempt ${attemptNumber}`);
            return true; // Success - flags changed
          }

          return false; // No changes detected
        }

        return false;
      } catch (error) {
        console.error(`Failed to refresh onboarding status (attempt ${attemptNumber}):`, error);
        return false;
      }
    };

    // If not using retry, just do a single attempt
    if (!withRetry) {
      await attemptRefresh(1);
      return;
    }

    // Retry logic with increasing delays
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      // Add delay before each attempt (except the first one gets initial delay)
      if (attempt === 1) {
        await new Promise(resolve => setTimeout(resolve, initialDelay));
      } else {
        // Exponential backoff: 800ms, 1200ms, 1600ms
        const delay = initialDelay + (attempt - 1) * 400;
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      const success = await attemptRefresh(attempt);

      if (success) {
        // Flags changed successfully, stop polling
        return;
      }

      if (attempt < maxRetries) {
        console.log(`🔄 No changes detected, retrying... (${attempt}/${maxRetries})`);
      } else {
        console.warn('⚠️ Onboarding status not updated after max retries. Changes may take longer to propagate.');
      }
    }
  };

  // Initialize auth state on mount - check for existing session
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Try to fetch user profile - will succeed if user has valid auth cookies
        await fetchUserProfile();
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