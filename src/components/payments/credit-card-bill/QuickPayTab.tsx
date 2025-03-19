
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import PaymentMethodSelector from "@/components/payments/PaymentMethodSelector";
import { mockCreditCardBills } from "@/data/mockCreditCardBills";

interface QuickPayTabProps {
  onContinue: (amount: string, cardDetails: any) => void;
}

export default function QuickPayTab({ onContinue }: QuickPayTabProps) {
  const [amount, setAmount] = useState<string>("");
  const [cardDetails, setCardDetails] = useState({
    cardIssuer: "",
    lastFourDigits: "",
    dueDate: "",
    totalDue: "",
    minimumDue: "",
  });
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and a single decimal point
    const value = e.target.value.replace(/[^0-9.]/g, "");
    if (value === "" || (/^\d*\.?\d{0,2}$/).test(value)) {
      setAmount(value);
    }
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="creditCard">Select Credit Card</Label>
            <div className="mt-2">
              <PaymentMethodSelector
                onSelect={(id) => {
                  // Find the selected method from the mock data
                  const cardBill = mockCreditCardBills.find(bill => bill.id === "ccb-001");
                  if (cardBill) {
                    setCardDetails({
                      cardIssuer: cardBill.cardIssuer,
                      lastFourDigits: cardBill.lastFourDigits,
                      dueDate: cardBill.dueDate,
                      totalDue: cardBill.totalDueAmount.toString(),
                      minimumDue: cardBill.minimumDueAmount.toString(),
                    });
                  }
                }}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="amount">Payment Amount (₹)</Label>
            <div className="relative mt-2">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-muted-foreground">₹</span>
              </div>
              <Input
                id="amount"
                type="text"
                value={amount}
                onChange={handleAmountChange}
                className="pl-8"
                placeholder="Enter amount"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center p-3 mt-6 bg-amber-50 rounded-md text-amber-800">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium">Pay with caution</p>
            <p>Without uploading the bill, we can't verify due dates or minimum payments.</p>
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <Button
            onClick={() => onContinue(amount, cardDetails)}
            disabled={!amount || parseFloat(amount) <= 0}
          >
            Continue to Payment Method
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
