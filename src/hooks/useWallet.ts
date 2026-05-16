import { useState, useEffect, useCallback } from 'react';
import { walletAPI } from '@/services/api';
import { GetWalletResponse, WalletData } from '@/types/wallet';
import { useCurrentBusiness } from './useCurrentBusiness';

export const useWallet = () => {
  const [data, setData] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useCurrentBusiness();

  const fetchWallet = useCallback(async () => {
    if (!businessId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await walletAPI.fetch();
      // Ensure the response matches GetWalletResponse structure
      if (
        response &&
        typeof response === 'object' &&
        'data' in response &&
        'endpoint' in response &&
        'message' in response &&
        'status' in response
      ) {
        setData((response as GetWalletResponse).data);
      } else {
        throw new Error('Invalid wallet response structure');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch wallet data';
      setError(errorMessage);
      console.error('Wallet fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  return {
    data,
    cards: data?.stored_cards || [],
    bankAccounts: data?.bank_accounts || [],
    upiDetails: data?.upi_details,
    creditLines: data?.credit_lines,
    lastUpdated: data?.last_updated,
    isLoading,
    error,
    refetch: fetchWallet,
  };
};
