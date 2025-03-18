
interface PaymentSummaryProps {
  paymentAmount: number;
  platformFee: number;
  gatewayFee: number;
  totalPayable: number;
}

export default function PaymentSummary({ 
  paymentAmount, 
  platformFee, 
  gatewayFee, 
  totalPayable 
}: PaymentSummaryProps) {
  return (
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
        
        <div className="flex justify-between items-center font-medium">
          <span>Total Payable</span>
          <span>₹{totalPayable.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
}
