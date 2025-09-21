
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ThumbsUp, ThumbsDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentRecommendation {
  paymentMethodId: string;
  reason: string;
  rewardPoints: number;
  partnerName: string;
  confidenceScore: number;
}

interface PaymentRecommendationProps {
  recommendation: PaymentRecommendation;
  onSelect: (methodId: string) => void;
  onFeedback: (isHelpful: boolean) => void;
  onDismiss: () => void;
  className?: string;
}

const PaymentRecommendationCard = ({
  recommendation,
  onSelect,
  onFeedback,
  onDismiss,
  className
}: PaymentRecommendationProps) => {
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [isPositive, setIsPositive] = useState<boolean | null>(null);

  const handleFeedback = (helpful: boolean) => {
    setFeedbackGiven(true);
    setIsPositive(helpful);
    onFeedback(helpful);
  };

  const handleSelect = () => {
    onSelect(recommendation.paymentMethodId);
  };

  return (
    <Card className={cn(
      "border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm transition-all hover:shadow-md",
      className
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
              <Sparkles className="h-4 w-4 text-blue-600" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                  Recommended for you
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {recommendation.confidenceScore}% match
                </Badge>
              </div>
              
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                {recommendation.reason}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  size="sm" 
                  onClick={handleSelect}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Use This Method
                </Button>
                
                {!feedbackGiven ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Was this helpful?</span>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleFeedback(true)}
                        className="h-7 w-7 p-0 hover:bg-green-100"
                      >
                        <ThumbsUp className="h-3 w-3 text-green-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleFeedback(false)}
                        className="h-7 w-7 p-0 hover:bg-red-100"
                      >
                        <ThumbsDown className="h-3 w-3 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      Thanks for your feedback!
                    </span>
                    {isPositive ? (
                      <ThumbsUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <ThumbsDown className="h-3 w-3 text-red-600" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={onDismiss}
            className="h-7 w-7 p-0 hover:bg-gray-100 flex-shrink-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentRecommendationCard;
