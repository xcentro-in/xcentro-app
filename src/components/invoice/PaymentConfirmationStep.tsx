
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { InvoiceDetails } from "@/types/invoice";
import { mockPaymentMethods } from "@/data/mockPaymentMethods";
import { PaymentMethod } from "@/types/payment-method";
import { formatCurrency } from "@/utils/formatters";
import { RewardPackage } from "../payments/common/RewardTopUpStep";

interface PaymentConfirmationStepProps {
  invoiceDetails: InvoiceDetails;
  paymentMethodId: string;
  rewardPackage: RewardPackage | null;
  onConfirm: () => void;
  onBack: () => void;
}

const PaymentConfirmationStep = ({ 
  invoiceDetails, 
  paymentMethodId,
  rewardPackage,
  onConfirm,
  onBack 
}: PaymentConfirmationStepProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const paymentMethod = mockPaymentMethods.find(m => m.id === paymentMethodId);
  
  if (!paymentMethod) {
    return <div>Payment method not found</div>;
  }

  const platformFee = invoiceDetails.amount * 0.02;
  const rewardPackageCost = rewardPackage ? invoiceDetails.amount * (rewardPackage.percentage / 100) : 0;
  const totalAmount = invoiceDetails.amount + platformFee + rewardPackageCost;

  const baseRewardPoints = Math.floor(invoiceDetails.amount / 10);
  const totalRewardPoints = rewardPackage ? Math.floor(baseRewardPoints * rewardPackage.multiplier) : baseRewardPoints;
  const bonusPoints = totalRewardPoints - baseRewardPoints;

  const getPaymentMethodDisplay = (method: PaymentMethod) => {
    switch (method.type) {
      case 'card':
        return `${method.cardType} **** ${method.lastFourDigits}`;
      case 'bank':
        return `${method.bankName} **** ${method.lastFourDigits}`;
      case 'upi':
        return method.upiId;
      case 'bnpl':
        return method.provider;
    }
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    onConfirm();
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Payment Confirmation</h2>
        <p className="text-muted-foreground">
          Review and confirm your payment to {invoiceDetails.vendorName}
        </p>
      </div>
      
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Invoice Details</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vendor</span>
                  <span className="font-medium">{invoiceDetails.vendorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Invoice Number</span>
                  <span className="font-medium">{invoiceDetails.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Invoice Date</span>
                  <span className="font-medium">{invoiceDetails.invoiceDate?.toString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Due Date</span>
                  <span className="font-medium">{invoiceDetails.dueDate?.toString()}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Payment Method</h3>
              
              <div className="flex items-center gap-3 p-3 border rounded-md">
                <div className={`h-10 w-10 rounded-full ${
                  paymentMethod.type === 'card' ? 'bg-primary/10' : 
                  paymentMethod.type === 'bank' ? 'bg-purple-500/10' : 
                  paymentMethod.type === 'upi' ? 'bg-blue-500/10' : 
                  'bg-green-500/10'
                } flex items-center justify-center`}>
                  {/* Icon would go here */}
                </div>
                <div>
                  <div className="font-medium">{getPaymentMethodDisplay(paymentMethod)}</div>
                  <div className="text-xs text-muted-foreground">
                    {paymentMethod.type === 'card' && `Exp: ${paymentMethod.expiryDate}`}
                    {paymentMethod.type === 'bank' && `${paymentMethod.transactionType.toUpperCase()}`}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h3 className="font-medium text-lg">Payment Summary</h3>
            
            <div className="space-y-2 bg-muted/30 p-4 rounded-md">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Invoice Amount</span>
                <span className="font-medium">{formatCurrency(invoiceDetails.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform Fee (2%)</span>
                <span className="font-medium">{formatCurrency(platformFee)}</span>
              </div>
              
              {rewardPackage && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Reward Package ({rewardPackage.name} {rewardPackage.percentage}%)
                  </span>
                  <span className="font-medium">{formatCurrency(rewardPackageCost)}</span>
                </div>
              )}
              
              <Separator className="my-2" />
              
              <div className="flex justify-between font-semibold">
                <span>Total Payable</span>
                <span className="text-lg">{formatCurrency(totalAmount)}</span>
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
          
          <div className="flex justify-between gap-4">
            <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
              Back
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Processing...' : 'Confirm Payment'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentConfirmationStep;
