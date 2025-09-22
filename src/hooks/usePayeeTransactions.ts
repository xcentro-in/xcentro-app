import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Transaction, TransactionStatus, PaymentMethod } from '@/types/transaction';
import { DateRange } from 'react-day-picker';

// Server-side filter parameters for payee transactions
export interface PayeeTransactionFilters {
  // Column header filters (trigger API calls)
  status?: TransactionStatus | 'all';
  paymentMethod?: PaymentMethod | 'all';
  dateRange?: DateRange;

  // Pagination (triggers API calls)
  page?: number;
  limit?: number;

  // Sorting (triggers API calls)
  sortBy?: 'date' | 'amount' | 'status' | 'method';
  sortOrder?: 'asc' | 'desc';
}

export interface PayeeTransactionPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PayeeTransactionResponse {
  transactions: Transaction[];
  pagination: PayeeTransactionPagination;
  appliedFilters: {
    status: TransactionStatus | 'all';
    paymentMethod: PaymentMethod | 'all';
    dateRange?: DateRange;
    totalResults: number;
  };
  success: boolean;
  message?: string;
}

// Hook for fetching payee transaction history with server-side filtering
export const usePayeeTransactions = (
  payeeId: string,
  filters: PayeeTransactionFilters = {}
) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<PayeeTransactionPagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [appliedFilters, setAppliedFilters] = useState({
    status: 'all' as TransactionStatus | 'all',
    paymentMethod: 'all' as PaymentMethod | 'all',
    dateRange: undefined as DateRange | undefined,
    totalResults: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Server-side parameters that trigger API calls
  const {
    status = 'all',
    paymentMethod = 'all',
    dateRange,
    page = 1,
    limit = 20,
    sortBy = 'date',
    sortOrder = 'desc'
  } = filters;

  const fetchTransactions = async () => {
    if (!user?.businessId || !payeeId || page === 0 || limit === 0) {
      // Don't fetch if page=0 or limit=0 (indicates tab not active)
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      /*
      const response = await api.payees.getTransactions(user.businessId, payeeId, {
        status: status !== 'all' ? status : undefined,
        paymentMethod: paymentMethod !== 'all' ? paymentMethod : undefined,
        dateFrom: dateRange?.from?.toISOString(),
        dateTo: dateRange?.to?.toISOString(),
        page,
        limit,
        sortBy,
        sortOrder
      });
      */

      // Mock API simulation
      console.log('TODO: Fetching payee transactions with filters:', {
        payeeId,
        status,
        paymentMethod,
        dateRange,
        page,
        limit,
        sortBy,
        sortOrder
      });

      await new Promise(resolve => setTimeout(resolve, 800));

      // Import and filter mock data
      const { getPayeeTransactions } = await import('@/data/mockPayeeTransactions');
      let allTransactions = getPayeeTransactions(payeeId);

      // Apply server-side filters
      let filteredTransactions = allTransactions;

      // Status filter
      if (status !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => t.status === status);
      }

      // Payment method filter
      if (paymentMethod !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => t.method === paymentMethod);
      }

      // Date range filter
      if (dateRange?.from || dateRange?.to) {
        filteredTransactions = filteredTransactions.filter(t => {
          const tDate = new Date(t.date);
          const from = dateRange.from;
          const to = dateRange.to;

          if (from && to) {
            return tDate >= from && tDate <= to;
          } else if (from) {
            return tDate >= from;
          } else if (to) {
            return tDate <= to;
          }
          return true;
        });
      }

      // Sorting
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
          case 'status':
            aValue = a.status;
            bValue = b.status;
            break;
          case 'method':
            aValue = a.method;
            bValue = b.method;
            break;
          default:
            aValue = new Date(a.date);
            bValue = new Date(b.date);
        }

        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      // Pagination
      const total = filteredTransactions.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + limit);

      // Update state
      setTransactions(paginatedTransactions);
      setPagination({
        page,
        limit,
        total,
        totalPages
      });
      setAppliedFilters({
        status,
        paymentMethod,
        dateRange,
        totalResults: total
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transactions';
      setError(errorMessage);
      console.error('Error fetching payee transactions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (payeeId && user?.businessId) {
      fetchTransactions();
    }
  }, [
    payeeId,
    user?.businessId,
    status,
    paymentMethod,
    dateRange?.from,
    dateRange?.to,
    page,
    limit,
    sortBy,
    sortOrder
  ]);

  return {
    transactions,
    pagination,
    appliedFilters,
    isLoading,
    error,
    refetch: fetchTransactions
  };
};