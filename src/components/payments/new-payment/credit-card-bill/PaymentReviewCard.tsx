
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CreditCard, BadgePercent } from "lucide-react";
import { RewardPackage } from "../shared/common/RewardTopUpStep";

interface PaymentReviewCardProps {
  cardDetails: {
    cardIssuer: string;
    lastFourDigits: string;
    dueDate: string;
    totalDue: string;
    minimumDue: string;
  };
  amount: string;
  rewardPackage?: RewardPackage | null;
}

const PaymentReviewCard = ({ cardDetails, amount, rewardPackage }: PaymentReviewCardProps) => {
  const amountValue = parseFloat(amount) || 0;
  const processingFee = amountValue * 0.01;
  const rewardPackageCost = rewardPackage ? amountValue * (rewardPackage.percentage / 100) : 0;
  const totalAmount = amountValue + processingFee + rewardPackageCost;

  const baseRewardPoints = Math.floor(amountValue / 10);
  const totalRewardPoints = rewardPackage 
    ? Math.floor(baseRewardPoints * rewardPackage.multiplier)
    : baseRewardPoints;
  const bonusPoints = totalRewardPoints - baseRewardPoints;

  return (
    <div className="space-y-6">
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{cardDetails.cardIssuer} •••• {cardDetails.lastFourDigits}</h3>
              <p className="text-sm text-muted-foreground">Due Date: {cardDetails.dueDate}</p>
            </div>
          </div>
          
          <Separator className="my-4" />

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bill Amount</span>
              <div>
                <span className="font-medium">₹{parseFloat(amount).toLocaleString()}</span>
                <Badge variant="outline" className="ml-2">
                  {amountValue === parseFloat(cardDetails.totalDue || "0") ? "Full Payment" : "Partial Payment"}
                </Badge>
              </div>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Processing Fee (1%)</span>
              <span>₹{processingFee.toLocaleString()}</span>
            </div>

            {rewardPackage && (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <BadgePercent className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">
                    {rewardPackage.name} Package ({rewardPackage.percentage}%)
                  </span>
                </div>
                <span>₹{rewardPackageCost.toLocaleString()}</span>
              </div>
            )}
            
            <Separator className="my-2" />
            
            <div className="flex justify-between font-medium">
              <span>Total Amount</span>
              <span>₹{totalAmount.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-primary">
              <span>Reward Points Earned</span>
              <span className="font-medium">
                {totalRewardPoints.toLocaleString()} points
                {bonusPoints > 0 && (
                  <span className="text-green-500 ml-1">(+{bonusPoints} bonus)</span>
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentReviewCard;
