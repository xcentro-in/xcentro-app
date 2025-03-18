
import { CreditCardBill } from "@/types/credit-card-bill";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface PaymentOptionsProps {
  bill: CreditCardBill;
  onAmountChange: (amount: number) => void;
}

export default function PaymentOptions({ bill, onAmountChange }: PaymentOptionsProps) {
  const [paymentType, setPaymentType] = useState<"full" | "minimum" | "custom">("full");
  const [customAmount, setCustomAmount] = useState<string>(bill.totalDueAmount.toString());
  
  const handlePaymentTypeChange = (value: string) => {
    const type = value as "full" | "minimum" | "custom";
    setPaymentType(type);
    
    if (type === "full") {
      onAmountChange(bill.totalDueAmount);
    } else if (type === "minimum") {
      onAmountChange(bill.minimumDueAmount);
    } else if (type === "custom") {
      onAmountChange(parseFloat(customAmount) || 0);
    }
  };
  
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    if (value === "" || (/^\d*\.?\d{0,2}$/).test(value)) {
      setCustomAmount(value);
      if (paymentType === "custom") {
        onAmountChange(parseFloat(value) || 0);
      }
    }
  };
  
  return (
    <div className="space-y-4">
      <RadioGroup 
        value={paymentType} 
        onValueChange={handlePaymentTypeChange}
        className="space-y-3"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="full" id="payment-full" />
          <Label htmlFor="payment-full" className="flex-1">
            Pay Full Amount
            <span className="block text-sm text-muted-foreground mt-0.5">
              ₹{bill.totalDueAmount.toLocaleString()}
            </span>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="minimum" id="payment-minimum" />
          <Label htmlFor="payment-minimum" className="flex-1">
            Pay Minimum Due
            <span className="block text-sm text-muted-foreground mt-0.5">
              ₹{bill.minimumDueAmount.toLocaleString()}
            </span>
          </Label>
        </div>
        
        <div className="flex items-start space-x-2">
          <RadioGroupItem value="custom" id="payment-custom" className="mt-2.5" />
          <div className="flex-1">
            <Label htmlFor="payment-custom">Custom Amount</Label>
            <div className="relative mt-1.5">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-muted-foreground">₹</span>
              </div>
              <Input
                id="custom-amount"
                type="text"
                value={customAmount}
                onChange={handleCustomAmountChange}
                onClick={() => setPaymentType("custom")}
                className="pl-8"
                placeholder="Enter custom amount"
              />
            </div>
          </div>
        </div>
      </RadioGroup>

      {paymentType === "minimum" && (
        <div className="p-3 bg-amber-50 text-amber-800 text-sm rounded-md">
          Paying only the minimum due will incur interest charges of approximately ₹{Math.round((bill.totalDueAmount - bill.minimumDueAmount) * (bill.interestRate || 3) / 100).toLocaleString()} next month.
        </div>
      )}
      
      {paymentType === "custom" && parseFloat(customAmount) < bill.minimumDueAmount && (
        <div className="p-3 bg-red-50 text-red-800 text-sm rounded-md">
          This amount is below the minimum due. You may incur late payment charges.
        </div>
      )}
    </div>
  );
}
