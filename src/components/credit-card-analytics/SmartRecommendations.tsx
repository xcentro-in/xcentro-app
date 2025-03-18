
import React from "react";
import { CreditCard, AlertTriangle, CreditCardIcon, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Function to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

interface CardData {
  cardName: string;
  totalSpend: number;
  rewardsEarned: number;
  lateFees: number;
  interestCharged: number;
  otherPenalties: number;
  utilizationRate: number;
}

interface SmartRecommendationsProps {
  bestCard: CardData;
  worstCard: CardData;
  highUtilizationCard: CardData;
}

const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  bestCard,
  worstCard,
  highUtilizationCard
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Smart Recommendations</CardTitle>
        <CardDescription>AI-powered insights to optimize your credit card usage</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
          <div className="mt-0.5">
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">Consider using {bestCard.cardName} for large purchases</p>
            <p className="text-sm text-muted-foreground mt-1">
              This card offers the best rewards-to-fee ratio in your wallet, making it ideal for major expenses.
            </p>
            <Button variant="link" className="px-0 h-auto py-1 text-primary flex items-center gap-1">
              Switch spending to this card <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {worstCard.lateFees > 0 && (
          <div className="flex items-start gap-3 p-3 bg-red-500/5 rounded-lg">
            <div className="mt-0.5">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="font-medium">High late fees detected on {worstCard.cardName}</p>
              <p className="text-sm text-muted-foreground mt-1">
                You've paid {formatCurrency(worstCard.lateFees)} in late fees on this card. Consider setting up auto-payments to avoid these charges.
              </p>
              <Button variant="link" className="px-0 h-auto py-1 text-primary flex items-center gap-1">
                Set up auto-payment <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
        
        {highUtilizationCard.utilizationRate > 70 && (
          <div className="flex items-start gap-3 p-3 bg-amber-500/5 rounded-lg">
            <div className="mt-0.5">
              <CreditCardIcon className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="font-medium">High utilization on {highUtilizationCard.cardName}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your card is at {highUtilizationCard.utilizationRate}% of its limit. Consider making a partial payment before the statement date to reduce utilization.
              </p>
              <Button variant="link" className="px-0 h-auto py-1 text-primary flex items-center gap-1">
                Make a partial payment <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartRecommendations;
