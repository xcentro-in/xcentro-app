import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { businessAPI } from '@/services/api';
import { useAuth } from './AuthContext';

export interface BusinessDetails {
  bid: string;
  name: string;
  gstin: string;
  pan: string;
  businessType: string;
  userRole: string;
}

interface BusinessState {
  selectedBusiness: BusinessDetails | null;
  availableBusinesses: BusinessDetails[];
  isLoading: boolean;
  error: string | null;
}

interface BusinessContextType extends BusinessState {
  switchBusiness: (businessId: string) => Promise<void>;
  refreshBusinessData: () => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

type BusinessAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SELECTED_BUSINESS'; payload: BusinessDetails }
  | { type: 'SET_AVAILABLE_BUSINESSES'; payload: BusinessDetails[] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_BUSINESS_DATA' };

const businessReducer = (state: BusinessState, action: BusinessAction): BusinessState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_SELECTED_BUSINESS':
      return { 
        ...state, 
        selectedBusiness: action.payload, 
        isLoading: false, 
        error: null 
      };
    
    case 'SET_AVAILABLE_BUSINESSES':
      return { 
        ...state, 
        availableBusinesses: action.payload,
        isLoading: false 
      };
    
    case 'SET_ERROR':
      return { 
        ...state, 
        error: action.payload, 
        isLoading: false 
      };
    
    case 'CLEAR_BUSINESS_DATA':
      return {
        selectedBusiness: null,
        availableBusinesses: [],
        isLoading: false,
        error: null,
      };
    
    default:
      return state;
  }
};

const initialState: BusinessState = {
  selectedBusiness: null,
  availableBusinesses: [],
  isLoading: false,
  error: null,
};

export const BusinessProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(businessReducer, initialState);
  const { userRoles, isAuthenticated } = useAuth();

  // Fetch business details for a specific business ID
  const fetchBusinessDetails = async (businessId: string, userRole: string): Promise<BusinessDetails> => {
    const response = await businessAPI.getBusiness(businessId);
    return {
      ...response.data,
      userRole, // Add the user's role for this business
    };
  };

  // Fetch all available businesses for the user
  const fetchAllBusinesses = async (): Promise<void> => {
    if (!userRoles || userRoles.length === 0) {
      dispatch({ type: 'SET_AVAILABLE_BUSINESSES', payload: [] });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Fetch details for all businesses the user has roles in
      const businessPromises = userRoles.map(role => 
        fetchBusinessDetails(role.businessId, role.role)
      );
      
      const businesses = await Promise.all(businessPromises);
      
      dispatch({ type: 'SET_AVAILABLE_BUSINESSES', payload: businesses });
      
      // Auto-select first business if none is selected
      if (!state.selectedBusiness && businesses.length > 0) {
        dispatch({ type: 'SET_SELECTED_BUSINESS', payload: businesses[0] });
        
        // Store selected business ID in sessionStorage for persistence
        sessionStorage.setItem('selected-business-id', businesses[0].bid);
      }
    } catch (error) {
      console.error('Failed to fetch business data:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load business data' });
    }
  };

  // Switch to a different business
  const switchBusiness = async (businessId: string): Promise<void> => {
    const targetBusiness = state.availableBusinesses.find(b => b.bid === businessId);
    
    if (targetBusiness) {
      dispatch({ type: 'SET_SELECTED_BUSINESS', payload: targetBusiness });
      sessionStorage.setItem('selected-business-id', businessId);
    } else {
      // If business not in cache, fetch it
      const userRole = userRoles.find(role => role.businessId === businessId);
      if (userRole) {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
          const businessDetails = await fetchBusinessDetails(businessId, userRole.role);
          dispatch({ type: 'SET_SELECTED_BUSINESS', payload: businessDetails });
          sessionStorage.setItem('selected-business-id', businessId);
          
          // Add to available businesses if not already there
          if (!state.availableBusinesses.find(b => b.bid === businessId)) {
            dispatch({ 
              type: 'SET_AVAILABLE_BUSINESSES', 
              payload: [...state.availableBusinesses, businessDetails] 
            });
          }
        } catch (error) {
          console.error('Failed to switch business:', error);
          dispatch({ type: 'SET_ERROR', payload: 'Failed to switch business' });
        }
      }
    }
  };

  // Refresh business data (useful for manual refresh)
  const refreshBusinessData = async (): Promise<void> => {
    await fetchAllBusinesses();
  };

  // Initialize business data when user roles are available
  useEffect(() => {
    if (isAuthenticated && userRoles && userRoles.length > 0) {
      // Check if there's a previously selected business in sessionStorage
      const savedBusinessId = sessionStorage.getItem('selected-business-id');
      
      if (savedBusinessId && userRoles.find(role => role.businessId === savedBusinessId)) {
        // Restore previously selected business
        const userRole = userRoles.find(role => role.businessId === savedBusinessId);
        if (userRole) {
          fetchBusinessDetails(savedBusinessId, userRole.role)
            .then(businessDetails => {
              dispatch({ type: 'SET_SELECTED_BUSINESS', payload: businessDetails });
            })
            .catch(() => {
              // If failed to restore, fall back to fetching all
              fetchAllBusinesses();
            });
        }
      } else {
        // No saved business or user doesn't have access, fetch all and auto-select first
        fetchAllBusinesses();
      }
    } else if (!isAuthenticated) {
      // Clear business data when user logs out
      dispatch({ type: 'CLEAR_BUSINESS_DATA' });
      sessionStorage.removeItem('selected-business-id');
    }
  }, [userRoles, isAuthenticated]);

  const value: BusinessContextType = {
    ...state,
    switchBusiness,
    refreshBusinessData,
  };

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = (): BusinessContextType => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};