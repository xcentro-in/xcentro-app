
import { DollarSign, Award } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { TransactionDetailCard } from "@/components/transactions/TransactionDetailCard";
import {formatCurrency} from "@/utils/formatters"

interface PaymentSummarySectionProps {
  amount: number;
  platformFee: number;
  gatewayFee: number;
  totalAmount: number;
  rewardPoints: number;
}

export const PaymentSummarySection = ({
  amount,
  platformFee,
  gatewayFee,
  totalAmount,
  rewardPoints,
}: PaymentSummarySectionProps) => {
  return (
    <TransactionDetailCard title="Payment Summary" className="mt-4">
      <div className="p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Amount</span>
          <span className="font-medium">{formatCurrency(amount)}</span>
        </div>
        
        <Separator className="my-2" />
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Platform Fee</span>
          <span className="font-medium">{formatCurrency(platformFee)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Payment Gateway Fee</span>
          <span className="font-medium">{formatCurrency(gatewayFee)}</span>
        </div>
        
        <Separator className="my-2" />
        
        <div className="flex justify-between font-medium text-base">
          <span>Total Amount</span>
          <span>{formatCurrency(totalAmount)}</span>
        </div>
        
        <div className="flex justify-between text-sm text-green-600 bg-green-50 p-2 rounded-md items-center mt-3">
          <div className="flex items-center">
            <Award className="h-4 w-4 mr-2" />
            <span>Reward Points to be Earned</span>
          </div>
          <span className="font-medium">{rewardPoints} points</span>
        </div>
      </div>
    </TransactionDetailCard>
  );
};
