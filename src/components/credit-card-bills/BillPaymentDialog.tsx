
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CreditCardBill } from "@/types/credit-card-bill";
import { format, parseISO } from "date-fns";
import PaymentMethodSelector from "@/components/payments/PaymentMethodSelector";
import PaymentOptions from "./PaymentOptions";

interface BillPaymentDialogProps {
  bill: CreditCardBill | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentSuccess: () => void;
}

export default function BillPaymentDialog({
  bill,
  open,
  onOpenChange,
  onPaymentSuccess,
}: BillPaymentDialogProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [paymentAmount, setPaymentAmount] = useState<number>(bill?.totalDueAmount || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAmountChange = (amount: number) => {
    setPaymentAmount(amount);
  };

  const handleSubmit = () => {
    if (!bill || !selectedPaymentMethod) return;
    
    setIsSubmitting(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsSubmitting(false);
      onPaymentSuccess();
      onOpenChange(false);
    }, 1500);
  };
  
  if (!bill) return null;
  
  // Calculate fees
  const platformFee = paymentAmount * 0.005; // 0.5% platform fee
  const gatewayFee = 50; // Fixed gateway fee
  const totalPayable = paymentAmount + platformFee + gatewayFee;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Pay Credit Card Bill</DialogTitle>
          <DialogDescription>
            {bill.cardIssuer} Card ending in {bill.lastFourDigits}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 py-2">
            <div>
              <p className="text-sm text-muted-foreground">Statement Date</p>
              <p className="font-medium">
                {bill.statementDate 
                  ? format(parseISO(bill.statementDate), "dd MMM yyyy") 
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Due Date</p>
              <p className="font-medium">
                {format(parseISO(bill.dueDate), "dd MMM yyyy")}
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-sm font-medium mb-3">Select Payment Amount</h3>
            <PaymentOptions bill={bill} onAmountChange={handleAmountChange} />
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-sm font-medium mb-3">Select Payment Method</h3>
            <PaymentMethodSelector
              onSelect={setSelectedPaymentMethod}
              selectedMethodId={selectedPaymentMethod}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Payment Summary</h3>
            
            <div className="bg-muted p-3 rounded-md space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Bill Amount</span>
                <span className="font-medium">₹{paymentAmount.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Platform Fee (0.5%)</span>
                <span>₹{platformFee.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Payment Gateway Fee</span>
                <span>₹{gatewayFee.toFixed(2)}</span>
              </div>
              
              <Separator className="my-1" />
              
              <div className="flex justify-between items-center font-medium">
                <span>Total Payable</span>
                <span>₹{totalPayable.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedPaymentMethod || isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Confirm Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
