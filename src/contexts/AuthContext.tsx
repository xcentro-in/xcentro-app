import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { AuthState, AuthUser, SessionBusiness } from '@/types/auth';
import { authAPI, userAPI, businessAPI } from '@/services/api';
import { identifyUser, setTag } from '@/lib/analytics';

export interface OnboardingStatus {
  kybStatus?: string;
  kybInitiated?: boolean;
  kycStatus?: string;

  bid?: string;
  businessName?: string;
  gstin?: string;
  businessType?: string;
  cin?: string;

  userName?: string;
  dob?: string;
  pan?: string;
  aadhaar?: string;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  initializeUser: () => Promise<void>;
  refreshOnboardingStatus: () => Promise<void>;
  updateUser: (user: Partial<AuthUser>) => void;
  optimisticallyUpdateOnboardingFlag: (flag: keyof Pick<AuthUser, 'hasAddedVendor' | 'hasAddedPaymentMethod' | 'hasCreatedFirstPayment'>, value: boolean) => void;
  onboardingStatus: OnboardingStatus | null;
  businesses: SessionBusiness[];
  activeBid: string | null;
  activeRole: string | null;
  needsBusinessSelection: boolean;
  switchBusiness: (bid: string) => Promise<void>;
  userRoles: Array<{ businessId: string; role: string }> | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SESSION'; payload: { id: string; kyc_status: string } }
  | { type: 'UPDATE_USER'; payload: Partial<AuthUser> }
  | { type: 'LOGOUT' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_SESSION':
      return {
        ...state,
        user: {
          ...(state.user || {}),
          id: action.payload.id,
          kyc_status: action.payload.kyc_status,
        },
        isAuthenticated: true,
        isLoading: false,
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };

    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };

    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [onboardingStatus, setOnboardingStatus] = React.useState<OnboardingStatus | null>(null);
  const [businesses, setBusinessesState] = React.useState<SessionBusiness[]>([]);
  const [activeBid, setActiveBidState] = React.useState<string | null>(null);
  const [activeRole, setActiveRoleState] = React.useState<string | null>(null);
  const [needsBusinessSelection, setNeedsBusinessSelection] = React.useState(false);

  // Called after every successful verifySession — single source of truth
  const applySession = React.useCallback((data: {
    uid: string;
    kyc_status: string;
    businesses: SessionBusiness[];
    active_bid: string;
  }) => {
    setBusinessesState(data.businesses);
    setActiveBidState(data.active_bid || null);
    const active = data.businesses.find(b => b.bid === data.active_bid);
    setActiveRoleState(active?.role || null);
    // Show selector only when 2+ businesses — single business skips it
    setNeedsBusinessSelection(data.businesses.length > 1);
    dispatch({ type: 'SET_SESSION', payload: { id: data.uid, kyc_status: data.kyc_status } });
  }, []);

  const updateUser = (userData: Partial<AuthUser>): void => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  const optimisticallyUpdateOnboardingFlag = (
    flag: keyof Pick<AuthUser, 'hasAddedVendor' | 'hasAddedPaymentMethod' | 'hasCreatedFirstPayment'>,
    value: boolean,
  ): void => {
    dispatch({ type: 'UPDATE_USER', payload: { [flag]: value } });
  };

  const login = async (email: string, password: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // Step 1: establish session cookies only
      await authAPI.login(email, password);

      // Step 2: verify session — onboarding flags bootstrapped in Layout
      const sessionResponse = await authAPI.verifySession();
      const session = sessionResponse.data;
      applySession(session);

      // Analytics
      identifyUser(session.uid, '');
      const active = session.businesses.find(b => b.bid === session.active_bid);
      setTag('userRole', active?.role || 'unknown');
      setTag('businessId', session.active_bid || 'unknown');
      setTag('kybStatus', active?.kyb_status || 'unknown');

      console.log('[AuthContext] Login successful');
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('[AuthContext] Logout API call failed:', error);
    }


    setBusinessesState([]);
    setActiveBidState(null);
    setActiveRoleState(null);
    setNeedsBusinessSelection(false);
    setOnboardingStatus(null);

    dispatch({ type: 'LOGOUT' });
    console.log('[AuthContext] User logged out successfully');
  };

  const refreshSession = async (): Promise<void> => {
    const sessionResponse = await authAPI.verifySession();
    const session = sessionResponse.data;
    applySession(session);
  };

  const switchBusiness = async (targetBid: string): Promise<void> => {
    try {
      await authAPI.switchBusiness(targetBid);

      // Re-verify to get updated session state
      const sessionResponse = await authAPI.verifySession();
      applySession(sessionResponse.data);

      // Clear stale onboarding pre-fill for the new business
      setOnboardingStatus(null);

      console.log('[AuthContext] Business switched successfully');
    } catch (error) {
      console.error('[AuthContext] Failed to switch business:', error);
      throw error;
    }
  };

  // Lazy-load onboarding detail data — only needed for form pre-fills on onboarding pages
  const initializeUserInternal = async (
    currentUser: AuthUser | null,
    currentRole: string | null,
    currentBid: string | null,
  ): Promise<void> => {
    const combinedOnboardingStatus: OnboardingStatus = {
      kybStatus: undefined,
      kybInitiated: false,
      kycStatus: undefined,
    };

    try {
      const [businessStatusResult, userStatusResult] = await Promise.allSettled([
        businessAPI.getOnboardingStatus(),
        userAPI.getOnboardingStatus(),
      ]);

      if (businessStatusResult.status === 'fulfilled' && businessStatusResult.value?.data) {
        const data = businessStatusResult.value.data as any;
        combinedOnboardingStatus.kybStatus = data.kybStatus;
        combinedOnboardingStatus.kybInitiated = data.kybInitiated ?? false;
        combinedOnboardingStatus.bid = data.bid;
        combinedOnboardingStatus.businessName = data.name;
        combinedOnboardingStatus.gstin = data.gstin;
        combinedOnboardingStatus.businessType = data.businessType;
        combinedOnboardingStatus.cin = data.cid;
      }

      if (userStatusResult.status === 'fulfilled' && userStatusResult.value?.data) {
        const data = userStatusResult.value.data;
        combinedOnboardingStatus.kycStatus = data.kycStatus;
        combinedOnboardingStatus.userName = data.name;
        combinedOnboardingStatus.dob = data.dob;
        combinedOnboardingStatus.pan = data.taxId;
        combinedOnboardingStatus.aadhaar = data.nationalId;
      }

      setOnboardingStatus(combinedOnboardingStatus);

      if (currentUser) {
        identifyUser(currentUser.id, currentUser.name || '');
        setTag('userRole', currentRole || 'unknown');
        setTag('businessId', currentBid || 'unknown');
        setTag('kybStatus', combinedOnboardingStatus.kybStatus || 'unknown');
      }

      console.log('[AuthContext] Onboarding status loaded');
    } catch (error: any) {
      console.error('[AuthContext] Failed to load onboarding status:', error);
      setOnboardingStatus(null);
      throw error;
    }
  };

  const initializeUser = async (): Promise<void> => {
    await initializeUserInternal(state.user, activeRole, activeBid);
  };

  const refreshOnboardingStatus = React.useCallback(async (): Promise<void> => {
    await initializeUserInternal(state.user, activeRole, activeBid);
  }, [state.user, activeRole, activeBid]);

  // App mount: restore session via verify-session (1 call)
  useEffect(() => {
    const initAuth = async () => {
      const publicPaths = ['/login', '/signup', '/forgot-password', '/reset-password', '/verify-email'];
      if (publicPaths.includes(window.location.pathname)) {
        console.log('[AuthContext] On public page, skipping session restore');
        setBusinessesState([]);
        setActiveBidState(null);
        setActiveRoleState(null);
        setNeedsBusinessSelection(false);
        setOnboardingStatus(null);
        dispatch({ type: 'LOGOUT' });
        return;
      }

      console.log('[AuthContext] Restoring session via verify-session');
      try {
        const sessionResponse = await authAPI.verifySession();
        applySession(sessionResponse.data);

        console.log('[AuthContext] Session restored successfully');
      } catch (error: any) {
        // verify-session returns 401 when no valid token — handled by api:session-expired or api:unauthorized events
        console.log('[AuthContext] Session restore failed:', error?.message || error);
        dispatch({ type: 'LOGOUT' });
      }
    };

    initAuth();
  }, []);

  // Handle session expiry / unauthorized events from ApiService
  useEffect(() => {
    let isHandlingSessionExpiry = false;

    const handleUnauthorized = () => {
      if (isHandlingSessionExpiry || !state.isAuthenticated) return;
      console.log('[AuthContext] Unauthorized access detected, logging out');
        setBusinessesState([]);
      setActiveBidState(null);
      setActiveRoleState(null);
      setNeedsBusinessSelection(false);
      setOnboardingStatus(null);
      dispatch({ type: 'LOGOUT' });
    };

    const handleSessionExpired = () => {
      if (isHandlingSessionExpiry) {
        console.log('[AuthContext] Already handling session expiry, skipping');
        return;
      }
      console.log('[AuthContext] Session expired, clearing state');
      isHandlingSessionExpiry = true;
        setBusinessesState([]);
      setActiveBidState(null);
      setActiveRoleState(null);
      setNeedsBusinessSelection(false);
      setOnboardingStatus(null);
      dispatch({ type: 'LOGOUT' });
    };

    window.addEventListener('api:unauthorized', handleUnauthorized as EventListener);
    window.addEventListener('api:session-expired', handleSessionExpired as EventListener);

    return () => {
      window.removeEventListener('api:unauthorized', handleUnauthorized as EventListener);
      window.removeEventListener('api:session-expired', handleSessionExpired as EventListener);
    };
  }, [state.isAuthenticated]);

  const userRoles = businesses.length > 0
    ? businesses.map(b => ({ businessId: b.bid, role: b.role }))
    : null;

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    refreshSession,
    initializeUser,
    refreshOnboardingStatus,
    updateUser,
    optimisticallyUpdateOnboardingFlag,
    onboardingStatus,
    businesses,
    activeBid,
    activeRole,
    needsBusinessSelection,
    switchBusiness,
    userRoles,
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
