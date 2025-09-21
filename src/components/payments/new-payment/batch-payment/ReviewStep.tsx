
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/formatters";
import { PaymentRow } from "./types";
import { mockPaymentMethods } from "@/data/mockPaymentMethods";
import { PaymentScheduleType } from "../shared/common/PaymentScheduleSelector";
import { RewardPackage } from "../shared/common/RewardTopUpStep";

interface ReviewStepProps {
  selectedRows: string[];
  selectedPaymentMethodId?: string;
  paymentRows: PaymentRow[];
  onBack: () => void;
  paymentType: PaymentScheduleType;
  scheduledDate?: Date;
  frequency: string;
  rewardPackage?: RewardPackage | null;
}

const ReviewStep = ({
  selectedRows,
  selectedPaymentMethodId,
  paymentRows,
  onBack,
  paymentType,
  scheduledDate,
  frequency,
  rewardPackage
}: ReviewStepProps) => {
  const selectedPaymentRows = useMemo(
    () => paymentRows.filter(row => selectedRows.includes(row.id)),
    [paymentRows, selectedRows]
  );
  
  const totalAmount = useMemo(
    () => selectedPaymentRows.reduce((sum, row) => sum + row.amount, 0),
    [selectedPaymentRows]
  );
  
  const paymentMethod = useMemo(
    () => selectedPaymentMethodId 
      ? mockPaymentMethods.find(m => m.id === selectedPaymentMethodId) 
      : undefined,
    [selectedPaymentMethodId]
  );
  
  const platformFee = totalAmount * 0.01;
  const processingFee = totalAmount * 0.005;
  
  const rewardPackageCost = rewardPackage 
    ? totalAmount * (rewardPackage.percentage / 100) 
    : 0;
  
  const finalAmount = totalAmount + platformFee + processingFee + rewardPackageCost;
  
  const baseRewardPoints = Math.floor(totalAmount / 10);
  const totalRewardPoints = rewardPackage 
    ? Math.floor(baseRewardPoints * rewardPackage.multiplier) 
    : baseRewardPoints;
  
  const bonusPoints = totalRewardPoints - baseRewardPoints;
  
  return (
    <div className="space-y-6">
      <h3 className="font-medium mb-4">Review Batch Payment</h3>
      
      <Card>
        <CardContent className="pt-6">
          <h4 className="font-medium mb-4">Payment Summary</h4>
          
          <div className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-md">
              <h5 className="font-medium mb-2">Transaction Details</h5>
              
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Number of Transactions</span>
                  <span>{selectedPaymentRows.length}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Type</span>
                  <span className="capitalize">{paymentType}</span>
                </div>
                
                {paymentType === "later" && scheduledDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Scheduled Date</span>
                    <span>{scheduledDate.toLocaleDateString()}</span>
                  </div>
                )}
                
                {paymentType === "recurring" && (
                  <>
                    {scheduledDate && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Start Date</span>
                        <span>{scheduledDate.toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Frequency</span>
                      <span className="capitalize">{frequency}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {paymentMethod && (
              <div className="bg-muted/30 p-4 rounded-md">
                <h5 className="font-medium mb-2">Payment Method</h5>
                
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Method</span>
                    <span className="capitalize">{paymentMethod.type}</span>
                  </div>
                  
                  {paymentMethod.type === "card" && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Card</span>
                      <span>{paymentMethod.cardType} •••• {paymentMethod.lastFourDigits}</span>
                    </div>
                  )}
                  
                  {paymentMethod.type === "bank" && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bank</span>
                      <span>{paymentMethod.bankName} •••• {paymentMethod.lastFourDigits}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="bg-muted/30 p-4 rounded-md">
              <h5 className="font-medium mb-2">Cost Summary</h5>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Payment Amount</span>
                  <span className="font-medium">{formatCurrency(totalAmount)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform Fee (1%)</span>
                  <span>{formatCurrency(platformFee)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Processing Fee (0.5%)</span>
                  <span>{formatCurrency(processingFee)}</span>
                </div>
                
                {rewardPackage && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Reward Package ({rewardPackage.name} {rewardPackage.percentage}%)
                    </span>
                    <span>{formatCurrency(rewardPackageCost)}</span>
                  </div>
                )}
                
                <Separator className="my-2" />
                
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatCurrency(finalAmount)}</span>
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
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
            <h4 className="font-medium">Payment Transactions ({selectedPaymentRows.length})</h4>
            
            <div className="space-y-2">
              {selectedPaymentRows.map(row => (
                <div key={row.id} className="border p-3 rounded-md flex justify-between items-center">
                  <div>
                    <div className="font-medium">{row.payee}</div>
                    <div className="text-xs text-muted-foreground">{row.description}</div>
                  </div>
                  <div className="font-medium">{formatCurrency(row.amount)}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between gap-4 mt-6">
            <Button variant="outline" onClick={onBack}>Back</Button>
            <Button className="flex-1">Confirm Payment</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewStep;
