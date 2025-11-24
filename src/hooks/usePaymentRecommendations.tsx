
import { useState, useEffect } from "react";

interface PaymentRecommendation {
  paymentMethodId: string;
  reason: string;
  rewardPoints: number;
  partnerName: string;
  confidenceScore: number;
}

interface UsePaymentRecommendationsProps {
  amount?: number;
  payeeId?: string;
  enabled?: boolean;
}

// Mock recommendation data - in real app this would come from API
const mockRecommendations: PaymentRecommendation[] = [
  {
    paymentMethodId: "1",
    reason: "Using HDFC Millenia will give you 500 reward points with best redemption over Marriott Bonvoy for this transaction amount.",
    rewardPoints: 500,
    partnerName: "Marriott Bonvoy",
    confidenceScore: 92
  },
  {
    paymentMethodId: "3",
    reason: "Your HDFC Bank account offers instant settlement with zero processing fees for this vendor category.",
    rewardPoints: 0,
    partnerName: "",
    confidenceScore: 85
  }
];

export const usePaymentRecommendations = ({
  amount,
  payeeId,
  enabled = true
}: UsePaymentRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<PaymentRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !amount) return;

    const fetchRecommendations = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Filter recommendations based on amount and payee
        const filteredRecommendations = mockRecommendations.filter(rec => {
          if (amount > 10000) return rec.paymentMethodId === "1"; // Recommend credit card for large amounts
          return true;
        });
        
        setRecommendations(filteredRecommendations.slice(0, 1)); // Show top recommendation
      } catch (err) {
        setError("Failed to fetch recommendations");
        console.error("Error fetching payment recommendations:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [amount, payeeId, enabled]);

  const submitFeedback = async (recommendationId: string, isHelpful: boolean) => {
    try {
      // Simulate API call for feedback
      console.log("Submitting feedback:", { recommendationId, isHelpful });
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      console.error("Error submitting feedback:", err);
    }
  };

  return {
    recommendations,
    isLoading,
    error,
    submitFeedback
  };
};
