
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import PaymentMethodSelector from "@/components/payments/new-payment/shared/payment-methods/PaymentMethodSelector";
import { useNavigate } from "react-router-dom";

interface QuickPaySectionProps {
  onPaymentSuccess: () => void;
}

export default function QuickPaySection({ onPaymentSuccess }: QuickPaySectionProps) {
  const navigate = useNavigate();
  const [amount, setAmount] = useState<string>("");
  const [selectedCard, setSelectedCard] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and a single decimal point
    const value = e.target.value.replace(/[^0-9.]/g, "");
    if (value === "" || (/^\d*\.?\d{0,2}$/).test(value)) {
      setAmount(value);
    }
  };
  
  const handleRedirectToPaymentFlow = () => {
    // Navigate to the payment page and specify we want to show credit card payment with quick pay
    navigate("/new-payment", { 
      state: { 
        paymentCategory: "creditcard",
        paymentMethod: "quick" 
      } 
    });
  };
  
  const isAmountTooLow = parseFloat(amount) < 1000 && amount !== "";
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Quick Pay Credit Card Bill</CardTitle>
        <CardDescription>
          Make a quick payment to your credit card without uploading a statement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="card">Select Credit Card</Label>
              <div className="mt-2">
                <PaymentMethodSelector
                  onSelect={setSelectedCard}
                  selectedMethodId={selectedCard}
                  showOnlyCards={true}
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
              {isAmountTooLow && (
                <p className="text-sm text-red-500 mt-1">
                  Amount seems low for a credit card bill. Please verify.
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., March 2024 Credit Card Payment"
                className="mt-2"
              />
            </div>
          </div>
          
          {!selectedCard && amount && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>No card selected</AlertTitle>
              <AlertDescription>
                Please select a credit card to proceed with the payment.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-end">
            <Button 
              type="button" 
              onClick={handleRedirectToPaymentFlow}
              disabled={!amount || parseFloat(amount) <= 0 || !selectedCard}
            >
              Go to Payment Flow
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
