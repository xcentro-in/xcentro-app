import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrentBusiness } from './useCurrentBusiness';
import { Payee, VendorPayee, BillerPayee, EmployeePayee } from '@/types/payee';
import { payeesAPI } from '@/services/api';
import {
  GetPayeeDetailsResponse,
  PayeeDetailsDataAPI,
  VendorPayeeDetailsAPI,
  BillerPayeeDetailsAPI,
  EmployeePayeeDetailsAPI
} from '@/types/payee-details-api';

// Server-side payee overview data structure
export interface PayeeOverview {
  payee: Payee;
  totalPaid: number;
  totalTransactions: number;
  lastTransactionDate: string | null;
  averageTransactionAmount: number;
  // Additional analytics for overview
  monthlySpend: {
    current: number;
    previous: number;
    percentageChange: number;
  };
  paymentMethodDistribution: {
    method: string;
    count: number;
    totalAmount: number;
  }[];
}

export interface PayeeDetailsResponse {
  overview: PayeeOverview;
  success: boolean;
  message?: string;
}

// Helper function to map API response to frontend Payee type
const mapAPIResponseToPayee = (apiPayee: PayeeDetailsDataAPI): Payee => {
  // Common fields
  const basePayee = {
    id: apiPayee.relation_id,
    name: apiPayee.display_name,
    email: apiPayee.contact_email,
    contactNumber: apiPayee.contact_phone,
    createdAt: new Date().toISOString(), // Not available in API
    updatedAt: new Date().toISOString(), // Not available in API
    isDefault: apiPayee.is_favorite,
    isActive: apiPayee.is_active,
  };

  // Map based on payee_type
  switch (apiPayee.payee_type) {
    case 'vendor': {
      const vendor = apiPayee as VendorPayeeDetailsAPI;
      return {
        ...basePayee,
        type: 'vendor' as const,
        accountNumber: vendor.bank_details?.account_number || '',
        bankName: vendor.bank_details?.bank_name || '',
        ifscCode: vendor.bank_details?.ifsc_code || '',
        gstin: vendor.gstin || '',
        defaultPaymentMode: 'bank' as const,
        tags: vendor.tags || [],
      } as VendorPayee;
    }

    case 'biller': {
      const biller = apiPayee as BillerPayeeDetailsAPI;
      return {
        ...basePayee,
        type: 'biller' as const,
        billerName: biller.biller_name,
        customerId: biller.mobile_number, // Using mobile_number as customerId
        billingCycle: 'monthly' as const,
        autoPayment: false,
      } as BillerPayee;
    }

    case 'employee': {
      const employee = apiPayee as EmployeePayeeDetailsAPI;
      return {
        ...basePayee,
        type: 'employee' as const,
        accountNumber: employee.bank_details?.account_number || '',
        bankName: employee.bank_details?.bank_name || '',
        ifscCode: employee.bank_details?.ifsc_code || '',
        salaryAmount: 0, // Not available in API
        salaryType: 'fixed' as const,
        payrollCycle: 'monthly' as const,
      } as EmployeePayee;
    }

    default:
      throw new Error(`Unknown payee type: ${(apiPayee as any).payee_type}`);
  }
};

// Hook for fetching payee details and overview data
export const usePayeeDetails = (payeeId: string) => {
  const [overview, setOverview] = useState<PayeeOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { businessId } = useCurrentBusiness();

  const fetchPayeeDetails = async () => {
    if (!businessId || !payeeId) {
      setError('Missing required parameters');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Call real API
      const response: GetPayeeDetailsResponse = await payeesAPI.getDetails(payeeId);

      if (response.status !== 'success' || !response.data) {
        throw new Error(response.message || 'Failed to fetch payee details');
      }

      // Map API response to frontend Payee type
      const payee = mapAPIResponseToPayee(response.data);

      // TODO: Analytics data (totalPaid, totalTransactions, etc.) should come from backend
      // For now, we'll use mock data for analytics calculation
      const { getPayeeTransactions, getPayeeTotalPayments, getPayeeLastTransactionDate } = await import('@/data/mockPayeeTransactions');

      const transactions = getPayeeTransactions(payeeId);
      const totalPaid = getPayeeTotalPayments(payeeId);
      const lastTransactionDate = getPayeeLastTransactionDate(payeeId);

      // Calculate additional analytics
      const totalTransactions = transactions.length;
      const averageTransactionAmount = totalTransactions > 0 ? totalPaid / totalTransactions : 0;

      // Calculate monthly spend (current vs previous month)
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const currentMonthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
      });

      const previousMonthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        return tDate.getMonth() === prevMonth && tDate.getFullYear() === prevYear;
      });

      const currentMonthSpend = currentMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
      const previousMonthSpend = previousMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
      const percentageChange = previousMonthSpend > 0 ?
        ((currentMonthSpend - previousMonthSpend) / previousMonthSpend) * 100 : 0;

      // Calculate payment method distribution
      const methodDistribution = transactions.reduce((acc, t) => {
        const existing = acc.find(item => item.method === t.method);
        if (existing) {
          existing.count++;
          existing.totalAmount += t.amount;
        } else {
          acc.push({
            method: t.method,
            count: 1,
            totalAmount: t.amount
          });
        }
        return acc;
      }, [] as { method: string; count: number; totalAmount: number; }[]);

      const overview: PayeeOverview = {
        payee,
        totalPaid,
        totalTransactions,
        lastTransactionDate,
        averageTransactionAmount,
        monthlySpend: {
          current: currentMonthSpend,
          previous: previousMonthSpend,
          percentageChange
        },
        paymentMethodDistribution: methodDistribution
      };

      setOverview(overview);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch payee details';
      setError(errorMessage);
      console.error('Error fetching payee details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update payee details (for edit functionality)
  const updatePayeeDetails = async (updates: Partial<Payee>) => {
    if (!businessId || !payeeId) {
      throw new Error('Missing required parameters');
    }

    try {
      // TODO: Replace with actual API call
      // const response = await api.payees.update(businessId, payeeId, updates);

      console.log('TODO: Update payee details via API:', updates);

      // Refresh data after update
      await fetchPayeeDetails();

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update payee details';
      throw new Error(errorMessage);
    }
  };

  // IFSC validation
  const validateIfsc = async (ifscCode: string): Promise<{ valid: boolean; bankName?: string }> => {
    try {
      // TODO: Replace with actual IFSC validation API
      // const response = await api.banks.validateIfsc(ifscCode);

      // Mock validation
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockBankNames: { [key: string]: string } = {
        'SBIN0000001': 'State Bank of India - Main Branch',
        'HDFC0000001': 'HDFC Bank - Corporate Branch',
        'ICIC0000001': 'ICICI Bank - Business Branch',
        'AXIS0000001': 'Axis Bank - Commercial Branch'
      };

      if (mockBankNames[ifscCode]) {
        return { valid: true, bankName: mockBankNames[ifscCode] };
      } else {
        return { valid: false };
      }

    } catch (err) {
      console.error('Error validating IFSC:', err);
      return { valid: false };
    }
  };

  useEffect(() => {
    if (payeeId) {
      fetchPayeeDetails();
    }
  }, [payeeId, businessId]);

  return {
    overview,
    isLoading,
    error,
    refetch: fetchPayeeDetails,
    updatePayeeDetails,
    validateIfsc
  };
};