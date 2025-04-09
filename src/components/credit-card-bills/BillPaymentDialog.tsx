
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
import PaymentMethodSelector from "@/components/payments/PaymentMethodSelector";
import PaymentOptions from "./PaymentOptions";
import BillSummary from "./BillSummary";
import PaymentSummary from "./PaymentSummary";

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
  
  import { formatCurrency } from '@/utils/formatters';
  
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
          <BillSummary bill={bill} />
          
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
          
          <PaymentSummary 
            paymentAmount={paymentAmount}
            platformFee={platformFee}
            gatewayFee={gatewayFee}
            totalPayable={totalPayable}
          />
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
