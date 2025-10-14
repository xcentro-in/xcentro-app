
import { Wallet } from "lucide-react";
import { PaymentMethod } from "@/types/payment-method";
import { TransactionDetailCard } from "@/components/transactions/TransactionDetailCard";

interface PaymentMethodSectionProps {
  paymentMethod?: PaymentMethod;
}

export const PaymentMethodSection = ({
  paymentMethod,
}: PaymentMethodSectionProps) => {
  return (
    <TransactionDetailCard title="Payment Method" className="mt-4">
      {paymentMethod ? (
        <div className="flex items-start gap-3 p-2">
          <Wallet className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="space-y-1.5">
            {paymentMethod.type === "card" && (
              <>
                <p className="text-sm font-medium">
                  {paymentMethod.cardType.charAt(0).toUpperCase() + paymentMethod.cardType.slice(1)} ending in {paymentMethod.lastFourDigits}
                </p>
                <p className="text-sm text-muted-foreground">
                  {paymentMethod.cardholderName} - Expires {paymentMethod.expiryDate}
                </p>
              </>
            )}
            {paymentMethod.type === "bank" && (
              <>
                <p className="text-sm font-medium">
                  {paymentMethod.bankName} Account ending in {paymentMethod.lastFourDigits}
                </p>
                <p className="text-sm text-muted-foreground">
                  {paymentMethod.accountHolderName} - Bank Transfer
                </p>
              </>
            )}
            {paymentMethod.type === "bnpl" && (
              <>
                <p className="text-sm font-medium">
                  {paymentMethod.provider}
                </p>
                <p className="text-sm text-muted-foreground">
                  Repayment in {paymentMethod.repaymentTermDays} days
                </p>
              </>
            )}
            {paymentMethod.type === "upi" && (
              <>
                <p className="text-sm font-medium">
                  UPI: {paymentMethod.upiId}
                </p>
                <p className="text-sm text-muted-foreground">
                  {paymentMethod.linkedBank || "Linked bank account"}
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground p-2">No payment method selected</p>
      )}
    </TransactionDetailCard>
  );
};
