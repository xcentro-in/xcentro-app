import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Transaction } from '@/types/transaction';

// Server-side filter parameters
export interface PaymentHistoryFilters {
  // Column header filters (trigger API calls)
  dateRange?: 'last7days' | 'last30days' | 'last3months' | 'custom';
  customDateFrom?: string;
  customDateTo?: string;
  status?: string[]; // ['completed', 'pending', 'failed', 'cancelled']
  paymentMethod?: string[]; // ['credit', 'bank', 'upi', 'bnpl']

  // Pagination (triggers API calls)
  page?: number;
  limit?: number; // rows per page

  // Sorting (triggers API calls)
  sortBy?: 'date' | 'amount' | 'vendor' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface PaymentHistoryPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaymentHistoryResponse {
  transactions: Transaction[];
  pagination: PaymentHistoryPagination;
  appliedFilters: {
    dateRange?: string;
    status: string[];
    paymentMethod: string[];
    totalResults: number;
  };
}

export const usePaymentHistory = (filters: PaymentHistoryFilters = {}) => {
  const [data, setData] = useState<PaymentHistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Default parameters
  const {
    dateRange = 'last7days',
    customDateFrom,
    customDateTo,
    status = [],
    paymentMethod = [],
    page = 1,
    limit = 20,
    sortBy = 'date',
    sortOrder = 'desc'
  } = filters;

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      if (!user?.businessId) return;

      setIsLoading(true);
      setError(null);

      try {
        // TODO: Replace with actual API call
        // const queryParams = new URLSearchParams();
        // queryParams.append('businessId', user.businessId);
        // queryParams.append('dateRange', dateRange);
        // if (customDateFrom) queryParams.append('dateFrom', customDateFrom);
        // if (customDateTo) queryParams.append('dateTo', customDateTo);
        // if (status.length) queryParams.append('status', status.join(','));
        // if (paymentMethod.length) queryParams.append('paymentMethod', paymentMethod.join(','));
        // queryParams.append('page', page.toString());
        // queryParams.append('limit', limit.toString());
        // queryParams.append('sortBy', sortBy);
        // queryParams.append('sortOrder', sortOrder);

        // const response = await fetch(`/api/payments/history?${queryParams}`, {
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        //   },
        // });

        // Mock API simulation with filtering
        await new Promise(resolve => setTimeout(resolve, 500));

        // Import mock data
        const { mockPaymentHistory } = await import('@/data/mockPaymentHistory');

        // Simulate server-side filtering
        let filteredTransactions = [...mockPaymentHistory];

        // Apply date range filter (server-side)
        const now = new Date();
        let dateFrom: Date, dateTo: Date;

        switch (dateRange) {
          case 'last7days':
            dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'last30days':
            dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case 'last3months':
            dateFrom = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
          case 'custom':
            dateFrom = customDateFrom ? new Date(customDateFrom) : new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            dateTo = customDateTo ? new Date(customDateTo) : now;
            break;
          default:
            dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        }

        if (!dateTo) dateTo = now;

        filteredTransactions = filteredTransactions.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return transactionDate >= dateFrom && transactionDate <= dateTo;
        });

        // Apply status filter (server-side)
        if (status.length > 0) {
          filteredTransactions = filteredTransactions.filter(transaction =>
            status.includes(transaction.status as any)
          );
        }

        // Apply payment method filter (server-side)
        if (paymentMethod.length > 0) {
          filteredTransactions = filteredTransactions.filter(transaction =>
            paymentMethod.includes(transaction.method as any)
          );
        }

        // Apply sorting (server-side)
        filteredTransactions.sort((a, b) => {
          let aValue: any, bValue: any;

          switch (sortBy) {
            case 'date':
              aValue = new Date(a.date);
              bValue = new Date(b.date);
              break;
            case 'amount':
              aValue = a.amount;
              bValue = b.amount;
              break;
            case 'vendor':
              aValue = a.vendor.toLowerCase();
              bValue = b.vendor.toLowerCase();
              break;
            case 'status':
              aValue = a.status;
              bValue = b.status;
              break;
            default:
              aValue = new Date(a.date);
              bValue = new Date(b.date);
          }

          if (sortOrder === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
          } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
          }
        });

        // Apply pagination (server-side)
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

        const response: PaymentHistoryResponse = {
          transactions: paginatedTransactions,
          pagination: {
            page,
            limit,
            total: filteredTransactions.length,
            totalPages: Math.ceil(filteredTransactions.length / limit)
          },
          appliedFilters: {
            dateRange,
            status,
            paymentMethod,
            totalResults: filteredTransactions.length
          }
        };

        setData(response);
      } catch (err) {
        setError('Failed to fetch payment history');
        console.error('Payment history error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [
    user?.businessId,
    dateRange,
    customDateFrom,
    customDateTo,
    JSON.stringify(status), // Serialize arrays for dependency
    JSON.stringify(paymentMethod),
    page,
    limit,
    sortBy,
    sortOrder
  ]);

  const refetch = () => {
    setData(null);
    setIsLoading(true);
    // The useEffect will trigger automatically
  };

  return {
    transactions: data?.transactions || [],
    pagination: data?.pagination,
    appliedFilters: data?.appliedFilters,
    isLoading,
    error,
    refetch
  };
};