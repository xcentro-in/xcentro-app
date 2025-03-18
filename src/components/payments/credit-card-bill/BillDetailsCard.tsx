
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

interface BillDetailsCardProps {
  cardDetails: {
    cardIssuer: string;
    lastFourDigits: string;
    dueDate: string;
    totalDue: string;
    minimumDue: string;
  };
  amount: string;
  onAmountChange: (amount: string) => void;
}

export default function BillDetailsCard({ 
  cardDetails, 
  amount, 
  onAmountChange 
}: BillDetailsCardProps) {
  const [paymentType, setPaymentType] = useState<"full" | "minimum" | "custom">("full");
  
  const handlePaymentTypeChange = (value: string) => {
    const type = value as "full" | "minimum" | "custom";
    setPaymentType(type);
    
    if (type === "full" && cardDetails.totalDue) {
      onAmountChange(cardDetails.totalDue);
    } else if (type === "minimum" && cardDetails.minimumDue) {
      onAmountChange(cardDetails.minimumDue);
    }
  };
  
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    if (value === "" || (/^\d*\.?\d{0,2}$/).test(value)) {
      onAmountChange(value);
    }
  };
  
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <h4 className="font-medium mb-3">Extracted Bill Details</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div>
            <p className="text-sm text-muted-foreground">Card Issuer</p>
            <p className="font-medium">{cardDetails.cardIssuer}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Card Number</p>
            <p className="font-medium">**** {cardDetails.lastFourDigits}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Due Date</p>
            <p className="font-medium">{new Date(cardDetails.dueDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Amount Due</p>
            <p className="font-medium">₹{parseInt(cardDetails.totalDue).toLocaleString()}</p>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <h4 className="font-medium mb-3">Select Payment Amount</h4>
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
                ₹{parseInt(cardDetails.totalDue).toLocaleString()}
              </span>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="minimum" id="payment-minimum" />
            <Label htmlFor="payment-minimum" className="flex-1">
              Pay Minimum Due
              <span className="block text-sm text-muted-foreground mt-0.5">
                ₹{parseInt(cardDetails.minimumDue).toLocaleString()}
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
                  value={amount}
                  onChange={handleCustomAmountChange}
                  onClick={() => setPaymentType("custom")}
                  className="pl-8"
                  placeholder="Enter custom amount"
                />
              </div>
            </div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
