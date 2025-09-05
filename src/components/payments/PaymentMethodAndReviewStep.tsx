import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PaymentMethodSelector from "./PaymentMethodSelector";
import { PaymentMethod } from "@/types/payment-method";
import { Payee } from "@/types/payee";
import { RewardPackage } from "./common/RewardTopUpStep";
import { TransactionDetailCard } from "@/components/transactions/TransactionDetailCard";
import { formatCurrency } from "@/utils/formatters";
import { mockPaymentMethods } from "@/data/mockPaymentMethods";
import { PaymentType } from "./CombinedDetailsStep";
import { format } from "date-fns";

interface PaymentMethodAndReviewStepProps {
  paymentType: PaymentType;
  scheduledDate?: Date;
  amount: number;
  description: string;
  invoiceReference: string;
  frequency: string;
  payee: Payee;
  selectedRewardPackage: RewardPackage | null;
  platformFee: number;
  gatewayFee: number;
  totalAmount: number;
  rewardPoints: number;
  onBack: () => void;
  onSubmit?: () => void;
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
  onBack,
  onSubmit
}: PaymentMethodAndReviewStepProps) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>();

  const paymentMethodDetails = selectedPaymentMethod 
    ? mockPaymentMethods.find(method => method.id === selectedPaymentMethod)
    : undefined;

  const rewardCost = selectedRewardPackage ? (amount * selectedRewardPackage.percentage / 100) : 0;

  const handleConfirmPayment = () => {
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Payment Method & Review</h2>
        <p className="text-muted-foreground">
          Choose your payment method and review the transaction
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Method Selection */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Select Payment Method</h3>
          <PaymentMethodSelector
            onSelect={setSelectedPaymentMethod}
            selectedMethodId={selectedPaymentMethod}
          />
        </div>

        {/* Transaction Review */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Transaction Summary</h3>
          
          <div className="space-y-4">
            {/* Payee Details */}
            <TransactionDetailCard title="Payee Details">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{payee.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{payee.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="capitalize">{payee.type}</span>
                </div>
              </div>
            </TransactionDetailCard>

            {/* Payment Details */}
            <TransactionDetailCard title="Payment Details">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-medium">{formatCurrency(amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Description:</span>
                  <span>{description || "No description"}</span>
                </div>
                {invoiceReference && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Invoice Ref:</span>
                    <span>{invoiceReference}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Schedule:</span>
                  <span className="capitalize">
                    {paymentType === "now" ? "Pay Now" : 
                     paymentType === "later" ? `Scheduled: ${scheduledDate ? format(scheduledDate, "PPP") : ""}` :
                     `Recurring: ${frequency} from ${scheduledDate ? format(scheduledDate, "PPP") : ""}`}
                  </span>
                </div>
              </div>
            </TransactionDetailCard>

            {/* Payment Method */}
            {paymentMethodDetails && (
              <TransactionDetailCard title="Payment Method">
                <div className="space-y-2">
                  {paymentMethodDetails.type === "card" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Card:</span>
                        <span>**** {paymentMethodDetails.lastFourDigits}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Holder:</span>
                        <span>{paymentMethodDetails.cardholderName}</span>
                      </div>
                    </>
                  )}
                  {paymentMethodDetails.type === "bank" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bank:</span>
                        <span>{paymentMethodDetails.bankName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Account:</span>
                        <span>**** {paymentMethodDetails.lastFourDigits}</span>
                      </div>
                    </>
                  )}
                </div>
              </TransactionDetailCard>
            )}

            {/* Reward Package */}
            {selectedRewardPackage && (
              <TransactionDetailCard title="Reward Package">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Package:</span>
                    <span className="font-medium">{selectedRewardPackage.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost:</span>
                    <span>{formatCurrency(rewardCost)}</span>
                  </div>
                </div>
              </TransactionDetailCard>
            )}

            {/* Payment Summary */}
            <TransactionDetailCard title="Payment Summary">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span>{formatCurrency(amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform Fee:</span>
                  <span>{formatCurrency(platformFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gateway Fee:</span>
                  <span>{formatCurrency(gatewayFee)}</span>
                </div>
                {selectedRewardPackage && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reward Cost:</span>
                    <span>{formatCurrency(rewardCost)}</span>
                  </div>
                )}
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount:</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
                <div className="flex justify-between text-primary">
                  <span className="text-muted-foreground">Reward Points:</span>
                  <span className="font-medium">{rewardPoints} points</span>
                </div>
              </div>
            </TransactionDetailCard>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
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