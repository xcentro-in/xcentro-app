import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { voucherAPI } from '@/services/api';

interface VoucherCounts {
  all: number;
  paid: number;
  open: number;
  overdue: number;
}

export const useVoucherCounts = () => {
  const [counts, setCounts] = useState<VoucherCounts>({
    all: 0,
    paid: 0,
    open: 0,
    overdue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchCounts = useCallback(async () => {
    if (!user?.businessId) {
      setError('Missing business ID');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await voucherAPI.getVoucherCounts(user.businessId);

      // Validate response structure
      if (
        response &&
        typeof response === 'object' &&
        'all' in response &&
        'paid' in response &&
        'open' in response &&
        'overdue' in response
      ) {
        setCounts(response as VoucherCounts);
      } else {
        console.error('Unexpected response structure:', response);
        throw new Error('Invalid voucher counts response structure');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch voucher counts';
      setError(errorMessage);
      console.error('Error fetching voucher counts:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.businessId]);

  useEffect(() => {
    if (user?.businessId) {
      fetchCounts();
    }
  }, [user?.businessId, fetchCounts]);

  return {
    counts,
    isLoading,
    error,
    refetch: fetchCounts,
  };
};
