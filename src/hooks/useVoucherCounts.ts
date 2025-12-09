import { useState, useEffect, useCallback } from 'react';
import { voucherAPI } from '@/services/api';
import { useCurrentBusiness } from './useCurrentBusiness';

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
  const { businessId } = useCurrentBusiness();

  const fetchCounts = useCallback(async () => {
    if (!businessId) {
      setError('Missing business ID');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await voucherAPI.getVoucherCounts(businessId);

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
  }, [businessId]);

  useEffect(() => {
    if (businessId) {
      fetchCounts();
    }
  }, [businessId, fetchCounts]);

  return {
    counts,
    isLoading,
    error,
    refetch: fetchCounts,
  };
};
