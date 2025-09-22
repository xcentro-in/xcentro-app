import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { AuthState, AuthUser, LoginResponse } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<AuthUser>) => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: LoginResponse }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<AuthUser> }
  | { type: 'SET_USER'; payload: AuthUser };

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
  businessId: "b1",
  businessName: "ABC Company",
  rewardPoints: 24530,
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with true to prevent flicker during auth check
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // TODO: Replace with actual API calls
  const login = async (_email: string, _password: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // TODO: Replace with actual API call
      // const response = await authAPI.login(email, password);

      // Mock login simulation
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockResponse: LoginResponse = {
        user: MOCK_USER_DATA,
        token: 'mock-jwt-token-' + Date.now(),
      };

      // Store token in localStorage for persistence
      localStorage.setItem('auth-token', mockResponse.token);
      localStorage.setItem('user-data', JSON.stringify(mockResponse.user));

      dispatch({ type: 'LOGIN_SUCCESS', payload: mockResponse });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const logout = (): void => {
    // TODO: Add API call to invalidate token on server
    // await authAPI.logout();

    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-data');
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (userData: Partial<AuthUser>): void => {
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      localStorage.setItem('user-data', JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_USER', payload: userData });
    }
  };

  const refreshAuth = async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const token = localStorage.getItem('auth-token');
      const userData = localStorage.getItem('user-data');

      if (token && userData) {
        // TODO: Validate token with backend
        // const response = await authAPI.validateToken(token);

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

  // Initialize auth state on mount - check for existing session
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth-token');
      const userData = localStorage.getItem('user-data');

      if (token && userData) {
        try {
          // TODO: In production, validate token with backend first
          // const isValid = await authAPI.validateToken(token);
          // if (!isValid) throw new Error('Invalid token');

          // For now, directly restore from localStorage (synchronous)
          const user: AuthUser = JSON.parse(userData);
          dispatch({ type: 'SET_USER', payload: user });
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('auth-token');
          localStorage.removeItem('user-data');
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } else {
        // No token found - user needs to login
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initAuth();
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    updateUser,
    refreshAuth,
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