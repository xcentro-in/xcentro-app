import { useState, useEffect, useCallback } from 'react';
import { useCurrentBusiness } from './useCurrentBusiness';
import { voucherAPI } from '@/services/api';

interface ApprovalCounts {
  pending: number;
  approved: number;
  rejected: number;
  request_changes: number;
}

export const useApprovalCounts = () => {
  const [counts, setCounts] = useState<ApprovalCounts>({
    pending: 0,
    approved: 0,
    rejected: 0,
    request_changes: 0,
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

      const response = await voucherAPI.getApprovalCounts();

      // Validate response structure
      if (
        response &&
        typeof response === 'object' &&
        'pending' in response &&
        'approved' in response &&
        'rejected' in response &&
        'request_changes' in response
      ) {
        setCounts(response as ApprovalCounts);
      } else {
        console.error('Unexpected response structure:', response);
        throw new Error('Invalid approval counts response structure');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch approval counts';
      setError(errorMessage);
      console.error('Error fetching approval counts:', err);
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
