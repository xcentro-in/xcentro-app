
import React from "react";
import { 
  CreditCard, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  CreditCardIcon
} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

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

interface KeyInsightsCardProps {
  bestCard: CardData;
  worstCard: CardData;
  highUtilizationCard: CardData;
}

export const KeyInsightsCard: React.FC<KeyInsightsCardProps> = ({ 
  bestCard, 
  worstCard, 
  highUtilizationCard 
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Best Card to Use</CardTitle>
          <CardDescription>Based on rewards to fees ratio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="font-semibold text-lg">{bestCard.cardName}</p>
                <p className="text-sm text-muted-foreground">Rewards/Fee Ratio: Excellent</p>
              </div>
            </div>
            <TrendingUp className="h-6 w-6 text-green-500" />
          </div>
          <div className="mt-4">
            <div className="text-sm flex justify-between">
              <span>Rewards Earned</span>
              <span className="font-medium">{formatCurrency(bestCard.rewardsEarned)}</span>
            </div>
            <div className="text-sm flex justify-between mt-1">
              <span>Total Fees</span>
              <span className="font-medium">{formatCurrency(bestCard.lateFees + bestCard.interestCharged + bestCard.otherPenalties)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Highest Fees Card</CardTitle>
          <CardDescription>Card with most hidden charges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-300" />
              </div>
              <div>
                <p className="font-semibold text-lg">{worstCard.cardName}</p>
                <p className="text-sm text-muted-foreground">High fees to rewards ratio</p>
              </div>
            </div>
            <TrendingDown className="h-6 w-6 text-red-500" />
          </div>
          <div className="mt-4">
            <div className="text-sm flex justify-between">
              <span>Total Fees</span>
              <span className="font-medium">{formatCurrency(worstCard.lateFees + worstCard.interestCharged + worstCard.otherPenalties)}</span>
            </div>
            <div className="text-sm flex justify-between mt-1 text-red-500">
              <span>Late Fees</span>
              <span className="font-medium">{formatCurrency(worstCard.lateFees)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">High Utilization Alert</CardTitle>
          <CardDescription>Card closest to credit limit</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-full">
                <CreditCardIcon className="h-6 w-6 text-amber-600 dark:text-amber-300" />
              </div>
              <div>
                <p className="font-semibold text-lg">{highUtilizationCard.cardName}</p>
                <p className="text-sm text-muted-foreground">Utilization: {highUtilizationCard.utilizationRate}%</p>
              </div>
            </div>
            {highUtilizationCard.utilizationRate > 80 ? (
              <AlertTriangle className="h-6 w-6 text-red-500" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-amber-500" />
            )}
          </div>
          <div className="mt-4">
            <div className="w-full bg-muted rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  highUtilizationCard.utilizationRate > 80 ? 'bg-red-500' : 
                  highUtilizationCard.utilizationRate > 60 ? 'bg-amber-500' : 
                  'bg-green-500'
                }`} 
                style={{ width: `${highUtilizationCard.utilizationRate}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {highUtilizationCard.utilizationRate > 80 
                ? "High utilization may impact credit score" 
                : "Maintain utilization below 30% for optimal credit score"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KeyInsightsCard;
