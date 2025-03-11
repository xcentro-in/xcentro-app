
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { PaymentType } from "./PaymentDetailsStep";

interface PaymentSummaryProps {
  paymentType: PaymentType;
  scheduledDate?: Date;
  onBack: () => void;
}

export const PaymentSummary = ({
  paymentType,
  scheduledDate,
  onBack,
}: PaymentSummaryProps) => {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <h3 className="font-semibold">Payment Summary</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Payment Type</span>
            <span className="font-medium">{paymentType === "now" ? "Immediate Payment" : 
              paymentType === "later" ? "Scheduled Payment" : "Recurring Payment"}</span>
          </div>
          {scheduledDate && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Scheduled Date</span>
              <span className="font-medium">{format(scheduledDate, "PPP")}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-medium">$2,500.00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Platform Fee</span>
            <span className="font-medium">$25.00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Payment Gateway Fee</span>
            <span className="font-medium">$12.50</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-medium">
              <span>Total Amount</span>
              <span>$2,537.50</span>
            </div>
          </div>
          <div className="flex justify-between text-sm text-green-600 bg-green-50 p-2 rounded-md">
            <span>Reward Points to be Earned</span>
            <span>250 points</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button className="flex-1">Confirm Payment</Button>
      </div>
    </div>
  );
};
