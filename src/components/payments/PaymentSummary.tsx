
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { PaymentType } from "./PaymentDetailsStep";
import { Payee } from "@/types/payee";
import { PaymentMethod } from "@/types/payment-method";
import { CreditCard, FileText, User, Wallet, DollarSign, Award } from "lucide-react";
import { TransactionDetailCard } from "@/components/transactions/TransactionDetailCard";
import { Separator } from "@/components/ui/separator";

interface PaymentSummaryProps {
  paymentType: PaymentType;
  scheduledDate?: Date;
  amount: number;
  description: string;
  invoiceReference: string;
  frequency?: string;
  payee?: Payee;
  paymentMethod?: PaymentMethod;
  platformFee: number;
  gatewayFee: number;
  totalAmount: number;
  rewardPoints: number;
  onBack: () => void;
}

export const PaymentSummary = ({
  paymentType,
  scheduledDate,
  amount,
  description,
  invoiceReference,
  frequency,
  payee,
  paymentMethod,
  platformFee,
  gatewayFee,
  totalAmount,
  rewardPoints,
  onBack,
}: PaymentSummaryProps) => {
  return (
    <div className="space-y-6">
      <h3 className="font-medium text-lg">Review Payment</h3>
      
      {/* Payment Details Section */}
      <TransactionDetailCard title="Payment Details" className="mt-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-2">
            <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="space-y-1.5">
              <p className="text-sm font-medium">Payment Type</p>
              <p className="text-sm text-muted-foreground">
                {paymentType === "now" ? "Immediate Payment" : 
                 paymentType === "later" ? "Scheduled Payment" : "Recurring Payment"}
              </p>
            </div>
          </div>
          
          {scheduledDate && (
            <div className="flex items-start gap-3 p-2">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1.5">
                <p className="text-sm font-medium">Scheduled Date</p>
                <p className="text-sm text-muted-foreground">{format(scheduledDate, "PPP")}</p>
              </div>
            </div>
          )}
          
          {paymentType === "recurring" && frequency && (
            <div className="flex items-start gap-3 p-2">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1.5">
                <p className="text-sm font-medium">Frequency</p>
                <p className="text-sm text-muted-foreground capitalize">{frequency}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-start gap-3 p-2">
            <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="space-y-1.5">
              <p className="text-sm font-medium">Description</p>
              <p className="text-sm text-muted-foreground">
                {description || <span className="italic">No description provided</span>}
              </p>
            </div>
          </div>
          
          {invoiceReference && (
            <div className="flex items-start gap-3 p-2">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1.5">
                <p className="text-sm font-medium">Invoice Reference</p>
                <p className="text-sm text-muted-foreground">{invoiceReference}</p>
              </div>
            </div>
          )}
        </div>
      </TransactionDetailCard>
      
      {/* Payee Section */}
      <TransactionDetailCard title="Payee Information" className="mt-4">
        {payee ? (
          <div className="flex items-start gap-3 p-2">
            <User className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="space-y-1.5">
              <p className="text-sm font-medium">{payee.name}</p>
              <p className="text-sm text-muted-foreground">
                {payee.email}<br />
                {payee.contactNumber}
              </p>
              {payee.type === "bank" && (
                <p className="text-sm text-muted-foreground">
                  {payee.bankName} - Account ending with {payee.accountNumber.slice(-4)}
                </p>
              )}
              {payee.type === "biller" && (
                <p className="text-sm text-muted-foreground">
                  Biller: {payee.billerName} - Customer ID: {payee.customerId}
                </p>
              )}
              {payee.type === "payroll" && (
                <p className="text-sm text-muted-foreground">
                  {payee.bankName} - Account ending with {payee.accountNumber.slice(-4)}
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground p-2">No payee selected</p>
        )}
      </TransactionDetailCard>
      
      {/* Payment Method Section */}
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
                    {paymentMethod.accountHolderName} - {paymentMethod.transactionType.toUpperCase()}
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
      
      {/* Payment Summary Section */}
      <TransactionDetailCard title="Payment Summary" className="mt-4">
        <div className="p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-medium">${amount.toFixed(2)}</span>
          </div>
          
          <Separator className="my-2" />
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Platform Fee</span>
            <span className="font-medium">${platformFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Payment Gateway Fee</span>
            <span className="font-medium">${gatewayFee.toFixed(2)}</span>
          </div>
          
          <Separator className="my-2" />
          
          <div className="flex justify-between font-medium text-base">
            <span>Total Amount</span>
            <span>${totalAmount.toFixed(2)}</span>
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

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button className="flex-1">Confirm Payment</Button>
      </div>
    </div>
  );
};
