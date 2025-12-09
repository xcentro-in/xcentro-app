import { useState, useEffect } from 'react';
import { useCurrentBusiness } from './useCurrentBusiness';
import { Transaction, TransactionStatus, PaymentMethod } from '@/types/transaction';
import { DateRange } from 'react-day-picker';
import { payeesAPI } from '@/services/api';
import { GetPayeeVouchersResponse, VoucherAPI } from '@/types/payee-vouchers-api';

// Helper function to parse payment method from API response
const parsePaymentMethod = (paymentMethodStr: string): PaymentMethod => {
  const lowerStr = paymentMethodStr.toLowerCase();

  if (lowerStr === 'n/a' || lowerStr === 'not available') {
    return 'bank'; // Default for draft vouchers
  } else if (lowerStr.includes('card')) {
    return 'credit';
  } else if (lowerStr.includes('bank') || lowerStr.includes('neft') || lowerStr.includes('rtgs')) {
    return 'bank';
  } else if (lowerStr.includes('upi')) {
    return 'upi';
  } else if (lowerStr.includes('bnpl') || lowerStr.includes('later')) {
    return 'bnpl';
  }

  return 'bank'; // Default fallback
};

// Helper function to map voucher status to transaction status
const mapVoucherStatus = (voucherStatus: string): TransactionStatus => {
  const lowerStatus = voucherStatus.toLowerCase();

  if (lowerStatus === 'draft') {
    return 'pending';
  } else if (lowerStatus === 'success' || lowerStatus === 'completed') {
    return 'completed';
  } else if (lowerStatus === 'failed') {
    return 'failed';
  } else if (lowerStatus === 'cancelled') {
    return 'cancelled';
  } else if (lowerStatus === 'upcoming' || lowerStatus === 'scheduled') {
    return 'upcoming';
  }

  return 'pending'; // Default fallback
};

// Helper function to map API voucher to frontend Transaction type
const mapVoucherToTransaction = (voucher: VoucherAPI): Transaction => {
  return {
    id: voucher.voucher_id.hashCode(), // Convert string to number for id
    transactionId: voucher.voucher_id,
    vendor: '', // Not available in voucher API (payee is already known)
    amount: voucher.net_amount / 100, // Convert paise to rupees
    status: mapVoucherStatus(voucher.status),
    date: voucher.created_at,
    method: parsePaymentMethod(voucher.payment_method),
    type: 'single', // Default type
    description: voucher.description || '',
    invoice: voucher.invoice_number,
  };
};

// Add hashCode method to String prototype for generating numeric IDs
declare global {
  interface String {
    hashCode(): number;
  }
}

String.prototype.hashCode = function() {
  let hash = 0;
  for (let i = 0; i < this.length; i++) {
    const char = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

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
    limit: 10,
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
  const { businessId } = useCurrentBusiness();

  // Server-side parameters that trigger API calls
  const {
    status = 'all',
    paymentMethod = 'all',
    dateRange,
    page = 1,
    limit = 10,
    sortBy = 'date',
    sortOrder = 'desc'
  } = filters;

  const fetchTransactions = async () => {
    if (!businessId || !payeeId || page === 0 || limit === 0) {
      // Don't fetch if page=0 or limit=0 (indicates tab not active)
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Call real API
      const response: GetPayeeVouchersResponse = await payeesAPI.getTransactions(
        businessId,
        payeeId,
        {
          status: status !== 'all' ? status : undefined,
          paymentMethod: paymentMethod !== 'all' ? paymentMethod : undefined,
          dateFrom: dateRange?.from?.toISOString(),
          dateTo: dateRange?.to?.toISOString(),
          page,
          limit,
          sortBy,
          sortOrder
        }
      );

      if (response.status !== 'success') {
        throw new Error('Failed to fetch vouchers');
      }

      // Handle empty vouchers (null or empty array)
      if (!response.vouchers || response.vouchers.length === 0) {
        setTransactions([]);
        setPagination({
          page: response.pagination.page,
          limit: response.pagination.limit,
          total: response.pagination.total,
          totalPages: response.pagination.total_pages
        });
        setAppliedFilters({
          status,
          paymentMethod,
          dateRange,
          totalResults: 0
        });
        return;
      }

      // Map vouchers to transactions
      const mappedTransactions = response.vouchers.map(mapVoucherToTransaction);

      // TODO: Apply client-side filters if needed (status, payment method, date range)
      // For now, backend handles all filtering via query params

      // Update state
      setTransactions(mappedTransactions);
      setPagination({
        page: response.pagination.page,
        limit: response.pagination.limit,
        total: response.pagination.total,
        totalPages: response.pagination.total_pages
      });
      setAppliedFilters({
        status,
        paymentMethod,
        dateRange,
        totalResults: response.pagination.total
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
    if (payeeId && businessId) {
      fetchTransactions();
    }
  }, [
    payeeId,
    businessId,
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