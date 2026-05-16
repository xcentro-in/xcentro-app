import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { UserPermissions, BusinessRole } from '@/types/permissions';
import { getMockPermissions } from '@/data/mockPermissions';
import { SessionBusiness } from '@/types/auth';

export interface BusinessDetails {
  bid: string;
  name: string;
  gstin: string;
  pan: string;
  businessType: string;
  userRole: BusinessRole;
  permissions?: UserPermissions;
  kyb_status?: string;
}

interface BusinessState {
  selectedBusiness: BusinessDetails | null;
  availableBusinesses: BusinessDetails[];
  isLoading: boolean;
  error: string | null;
}

interface BusinessContextType extends BusinessState {
  switchBusiness: (businessId: string) => Promise<void>;
  updateBusinessDetails: (details: { gstin: string; pan: string; businessType: string }) => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { businesses, activeBid, activeRole, switchBusiness: authSwitchBusiness, isAuthenticated } = useAuth();
  
  const [state, setState] = React.useState<BusinessState>({
    selectedBusiness: null,
    availableBusinesses: [],
    isLoading: true,
    error: null,
  });

  const convertToBusinessDetails = (b: SessionBusiness): BusinessDetails => ({
    bid: b.bid,
    name: b.name,
    userRole: b.role as BusinessRole,
    kyb_status: b.kyb_status,
    gstin: '',
    pan: '',
    businessType: '',
  });

  useEffect(() => {
    if (isAuthenticated && businesses && businesses.length > 0) {
      const availableBusinesses: BusinessDetails[] = businesses.map(convertToBusinessDetails);
      const selectedBusiness = availableBusinesses.find(b => b.bid === activeBid) || availableBusinesses[0] || null;

      setState({
        availableBusinesses,
        selectedBusiness,
        isLoading: false,
        error: null,
      });
    } else if (!isAuthenticated) {
      setState({
        selectedBusiness: null,
        availableBusinesses: [],
        isLoading: false,
        error: null,
      });
    }
  }, [businesses, activeBid, isAuthenticated]);

  useEffect(() => {
    const handleBusinessSwitch = async (event: CustomEvent) => {
      console.log('[BusinessContext] Business switched:', event.detail);
    };
    
    window.addEventListener('auth:business-switched', handleBusinessSwitch as EventListener);
    return () => {
      window.removeEventListener('auth:business-switched', handleBusinessSwitch as EventListener);
    };
  }, []);

  const updateBusinessDetails = (details: { gstin: string; pan: string; businessType: string }): void => {
    setState(prev => ({
      ...prev,
      selectedBusiness: prev.selectedBusiness
        ? { ...prev.selectedBusiness, ...details }
        : null,
    }));
  };

  const handleSwitchBusiness = async (businessId: string): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await authSwitchBusiness(businessId);
    } catch (error) {
      console.error('[BusinessContext] Failed to switch business:', error);
      setState(prev => ({ ...prev, isLoading: false, error: 'Failed to switch business' }));
      throw error;
    }
  };

  const value: BusinessContextType = {
    ...state,
    switchBusiness: handleSwitchBusiness,
    updateBusinessDetails,
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
