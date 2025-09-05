import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/formatters";
import { mockPaymentMethods } from "@/data/mockPaymentMethods";
import { PaymentMethod } from "@/types/payment-method";
import { Payee } from "@/types/payee";
import { PaymentType } from "./CombinedDetailsStep";
import { RewardPackage } from "./common/RewardTopUpStep";
import PaymentMethodSelector from "./PaymentMethodSelector";
import RewardTopUpStep from "./common/RewardTopUpStep";

interface PaymentMethodAndReviewStepProps {
  paymentType: PaymentType;
  scheduledDate?: Date;
  amount: number;
  description: string;
  invoiceReference: string;
  frequency: string;
  payee: Payee;
  selectedRewardPackage?: RewardPackage | null;
  platformFee: number;
  gatewayFee: number;
  totalAmount: number;
  rewardPoints: number;
  selectedPaymentMethod?: string;
  enableConditionalRewardTopup?: boolean;
  onBack: () => void;
  onSubmit: () => void;
  onRewardPackageChange?: (pkg: RewardPackage | null) => void;
}

const PaymentMethodAndReviewStep = ({
  paymentType,
  scheduledDate,
  amount,
  description,
  invoiceReference,
  frequency,
  payee,
  selectedRewardPackage,
  platformFee,
  gatewayFee,
  totalAmount,
  rewardPoints,
  selectedPaymentMethod: initialPaymentMethod,
  enableConditionalRewardTopup = false,
  onBack,
  onSubmit,
  onRewardPackageChange
}: PaymentMethodAndReviewStepProps) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(initialPaymentMethod || "");
  const [showRewardSection, setShowRewardSection] = useState(false);

  const paymentMethodDetails = selectedPaymentMethod 
    ? mockPaymentMethods.find(method => method.id === selectedPaymentMethod)
    : undefined;

  // Check if reward top-up should be available for the selected payment method
  const shouldShowRewardTopup = enableConditionalRewardTopup && 
    paymentMethodDetails?.type === 'bank';

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  const formatScheduleText = () => {
    if (paymentType === "now") return "Immediate";
    if (paymentType === "later" && scheduledDate) {
      return `Scheduled for ${scheduledDate.toLocaleDateString()}`;
    }
    if (paymentType === "recurring" && scheduledDate) {
      return `Recurring ${frequency} starting ${scheduledDate.toLocaleDateString()}`;
    }
    return "Not specified";
  };

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

  const handleRewardPackageSelected = (pkg: RewardPackage | null) => {
    onRewardPackageChange?.(pkg);
    setShowRewardSection(false);
  };

  // Calculate totals with current reward package
  const currentRewardPackageCost = selectedRewardPackage ? (amount * selectedRewardPackage.percentage / 100) : 0;
  const currentTotalAmount = amount + platformFee + gatewayFee + currentRewardPackageCost;
  
  const baseRewardPoints = Math.floor(amount / 10);
  const currentRewardPoints = selectedRewardPackage 
    ? Math.floor(baseRewardPoints * selectedRewardPackage.multiplier)
    : baseRewardPoints;

  const handleConfirmPayment = () => {
    onSubmit();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Final Review</h2>
        <p className="text-muted-foreground">
          Review your payment details and confirm the transaction
        </p>
      </div>

      {/* Payment Method Selection */}
      {!selectedPaymentMethod && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentMethodSelector 
              onSelect={handlePaymentMethodSelect}
              selectedMethodId={selectedPaymentMethod}
            />
          </CardContent>
        </Card>
      )}

      {/* Payment Method Display and Reward Options */}
      {selectedPaymentMethod && paymentMethodDetails && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Selected Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 border rounded-md">
                <div className={`h-10 w-10 rounded-full ${
                  paymentMethodDetails.type === 'card' ? 'bg-primary/10' : 
                  paymentMethodDetails.type === 'bank' ? 'bg-purple-500/10' : 
                  paymentMethodDetails.type === 'upi' ? 'bg-blue-500/10' : 
                  'bg-green-500/10'
                } flex items-center justify-center`}>
                  {/* Icon would go here */}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{getPaymentMethodDisplay(paymentMethodDetails)}</div>
                  <div className="text-xs text-muted-foreground">
                    {paymentMethodDetails.type === 'card' && `Exp: ${paymentMethodDetails.expiryDate}`}
                    {paymentMethodDetails.type === 'bank' && `${paymentMethodDetails.transactionType.toUpperCase()}`}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedPaymentMethod("")}
                  className="w-auto"
                >
                  Change
                </Button>
              </div>

              {/* Reward Top-Up Option */}
              {shouldShowRewardTopup && (
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">Reward Booster</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedRewardPackage 
                          ? `${selectedRewardPackage.name} - ${selectedRewardPackage.multiplier}x points`
                          : 'Earn extra rewards on this payment'
                        }
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowRewardSection(!showRewardSection)}
                      className="w-auto"
                    >
                      {selectedRewardPackage ? 'Change' : 'Add Booster'}
                    </Button>
                  </div>
                  
                  {showRewardSection && (
                    <div className="mt-4">
                      <RewardTopUpStep
                        amount={amount}
                        onBack={() => setShowRewardSection(false)}
                        onNext={handleRewardPackageSelected}
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">To: {payee.name}</span>
                  <span className="font-medium">{formatCurrency(amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Schedule</span>
                  <span className="text-sm">{formatScheduleText()}</span>
                </div>
                {description && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Description</span>
                    <span className="text-sm max-w-32 text-right">{description}</span>
                  </div>
                )}
                {invoiceReference && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reference</span>
                    <span className="text-sm">{invoiceReference}</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Amount</span>
                  <span className="font-medium">{formatCurrency(amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <span className="font-medium">{formatCurrency(platformFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gateway Fee</span>
                  <span className="font-medium">{formatCurrency(gatewayFee)}</span>
                </div>
                
                {selectedRewardPackage && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Reward Booster ({selectedRewardPackage.percentage}%)
                    </span>
                    <span className="font-medium">{formatCurrency(currentRewardPackageCost)}</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between font-semibold">
                  <span>Total Payable</span>
                  <span className="text-lg">{formatCurrency(currentTotalAmount)}</span>
                </div>
                
                <div className="flex justify-between text-primary">
                  <span>Reward Points</span>
                  <span className="font-medium">
                    {currentRewardPoints.toLocaleString()} points
                    {selectedRewardPackage && (
                      <span className="text-green-500 ml-1">
                        (+{currentRewardPoints - baseRewardPoints} bonus)
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex justify-between gap-4">
        <Button variant="outline" onClick={onBack} className="w-auto">
          Back
        </Button>
        <Button 
          onClick={handleConfirmPayment}
          disabled={!selectedPaymentMethod}
          className="w-auto"
        >
          Confirm Payment
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethodAndReviewStep;