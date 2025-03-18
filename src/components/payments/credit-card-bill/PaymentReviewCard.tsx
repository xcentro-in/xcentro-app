
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PaymentReviewCardProps {
  cardDetails: {
    cardIssuer: string;
    lastFourDigits: string;
    dueDate: string;
  };
  amount: string;
}

export default function PaymentReviewCard({ cardDetails, amount }: PaymentReviewCardProps) {
  const amountNum = parseInt(amount);
  const processingFee = amountNum * 0.005;
  const gatewayFee = 50;
  const totalPayable = amountNum + processingFee + gatewayFee;
  
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">PAYMENT DETAILS</h4>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm text-muted-foreground">Card Issuer</p>
                <p className="font-medium">{cardDetails.cardIssuer || "Selected Card"}</p>
              </div>
              {cardDetails.lastFourDigits && (
                <div>
                  <p className="text-sm text-muted-foreground">Card Number</p>
                  <p className="font-medium">**** {cardDetails.lastFourDigits}</p>
                </div>
              )}
              {cardDetails.dueDate && (
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="font-medium">{new Date(cardDetails.dueDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">PAYMENT AMOUNT</h4>
            <div className="mt-3 space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bill Amount</span>
                <span className="font-medium">₹{amountNum.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Processing Fee (0.5%)</span>
                <span>₹{processingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gateway Fee</span>
                <span>₹50.00</span>
              </div>
              
              <Separator className="my-2" />
              
              <div className="flex justify-between font-medium">
                <span>Total Payable</span>
                <span>₹{totalPayable.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
