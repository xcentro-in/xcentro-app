import { useState, useEffect, useCallback } from 'react';
import { processPaymentAPI } from '@/services/api';
import { PaymentListResponseAPI, PaymentListItemAPI } from '@/types/payment-list-api';
import { Payout } from '@/types/payout';
import { useAuth } from '@/contexts/AuthContext';

// Helper function to map API status to frontend status
const mapStatus = (apiStatus: string): 'Completed' | 'In Progress' | 'Failed' | 'Pending' => {
  switch (apiStatus) {
    case 'success':
      return 'Completed';
    case 'processing':
      return 'In Progress';
    case 'failed':
      return 'Failed';
    case 'pending':
      return 'Pending';
    default:
      return 'Pending';
  }
};

// Helper function to map payment method type
const mapPaymentMethodType = (type: string): 'credit' | 'bank' | 'upi' | 'bnpl' | 'other' => {
  if (['credit', 'bank', 'upi', 'bnpl', 'other'].includes(type)) {
    return type as 'credit' | 'bank' | 'upi' | 'bnpl' | 'other';
  }
  return 'other';
};

// Helper function to convert API payment to Payout
const mapPaymentToPayout = (payment: PaymentListItemAPI): Payout => {
  return {
    payoutId: payment.payoutId,
    date: payment.date,
    payees: payment.payees,
    billCount: payment.billCount,
    paymentMethod: {
      type: mapPaymentMethodType(payment.paymentMethod.type),
      cardProvider: payment.paymentMethod.cardProvider,
      bank: payment.paymentMethod.bank,
      last4: payment.paymentMethod.last4,
    },
    totalAmount: payment.totalAmount / 100, // Convert paise to rupees
    status: mapStatus(payment.status),
    breakdown: {
      bills: payment.breakdown.bills.map(bill => ({
        voucherId: bill.voucherId,
        billId: bill.billId,
        amount: bill.amount / 100, // Convert paise to rupees
      })),
      convenienceFee: payment.breakdown.convenienceFee / 100, // Convert paise to rupees
      gstOnFee: payment.breakdown.gstOnFee / 100, // Convert paise to rupees
    },
    retryOfPaymentId: payment.retryOfPaymentId,
    retryCount: payment.retryCount,
    hasSuccessfulRetry: payment.hasSuccessfulRetry,
  };
};

interface UsePaymentListParams {
  limit: number;
  offset: number;
}

export const usePaymentList = ({ limit, offset }: UsePaymentListParams) => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPayments = useCallback(async () => {
    if (!user?.businessId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await processPaymentAPI.list(user.businessId, { limit, offset });

      // The API returns the data directly (not wrapped in a "data" field)
      if (
        response &&
        typeof response === 'object' &&
        'payments' in response &&
        Array.isArray(response.payments)
      ) {
        const data = response as PaymentListResponseAPI;

        // Map API response to frontend Payout type
        const mappedPayouts = data.payments.map(mapPaymentToPayout);

        setPayouts(mappedPayouts);
        setTotalCount(data.total_count || 0);
      } else {
        // Log the actual response for debugging
        console.error('Unexpected response structure:', response);
        throw new Error('Invalid payment list response structure');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch payment list';
      setError(errorMessage);
      console.error('Payment list fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.businessId, limit, offset]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return {
    payouts,
    totalCount,
    isLoading,
    error,
    refetch: fetchPayments,
  };
};
