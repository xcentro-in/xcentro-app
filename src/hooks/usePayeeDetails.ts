import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Payee, BankPayee, BillerPayee, PayrollPayee } from '@/types/payee';

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

// Hook for fetching payee details and overview data
export const usePayeeDetails = (payeeId: string) => {
  const [overview, setOverview] = useState<PayeeOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPayeeDetails = async () => {
    if (!user?.businessId || !payeeId) {
      setError('Missing required parameters');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      // const response = await api.payees.getDetails(user.businessId, payeeId);

      // Mock API simulation
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Import mock data for simulation
      const { mockPayees } = await import('@/data/mockPayees');
      const { getPayeeTransactions, getPayeeTotalPayments, getPayeeLastTransactionDate } = await import('@/data/mockPayeeTransactions');

      const payee = mockPayees.find(p => p.id === payeeId);

      if (!payee) {
        throw new Error('Payee not found');
      }

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

      const mockOverview: PayeeOverview = {
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

      setOverview(mockOverview);

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
    if (!user?.businessId || !payeeId) {
      throw new Error('Missing required parameters');
    }

    try {
      // TODO: Replace with actual API call
      // const response = await api.payees.update(user.businessId, payeeId, updates);

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
  }, [payeeId, user?.businessId]);

  return {
    overview,
    isLoading,
    error,
    refetch: fetchPayeeDetails,
    updatePayeeDetails,
    validateIfsc
  };
};