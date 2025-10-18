import { useState, useCallback } from 'react';
import { processPaymentAPI } from '@/services/api';
import { GetPaymentSourcesResponse, PaymentSource } from '@/types/payment-source';

export const usePaymentSources = () => {
  const [data, setData] = useState<GetPaymentSourcesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentSources = useCallback(async (params: {
    business_id: string;
    payment_context: string;
    base_amount: number;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await processPaymentAPI.getPaymentSourcesWithFees(params);
      setData(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch payment sources';
      setError(errorMessage);
      console.error('Payment sources fetch error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCardSources = useCallback((): PaymentSource[] => {
    if (!data?.data?.sources) return [];
    return data.data.sources.filter(source => source.source_type === 'card');
  }, [data]);

  const getBankSources = useCallback((): PaymentSource[] => {
    if (!data?.data?.sources) return [];
    return data.data.sources.filter(source => source.source_type === 'bank_account');
  }, [data]);

  const getAllowedSources = useCallback((): PaymentSource[] => {
    if (!data?.data?.sources) return [];
    return data.data.sources.filter(source => source.is_allowed);
  }, [data]);

  const getSourceById = useCallback((sourceId: string): PaymentSource | undefined => {
    if (!data?.data?.sources) return undefined;
    return data.data.sources.find(source => source.source_id === sourceId);
  }, [data]);

  return {
    sources: data?.data?.sources || [],
    cardSources: getCardSources(),
    bankSources: getBankSources(),
    allowedSources: getAllowedSources(),
    isLoading,
    error,
    fetchPaymentSources,
    getSourceById,
  };
};
