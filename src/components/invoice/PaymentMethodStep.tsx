
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InvoiceDetails } from "@/types/invoice";
import PaymentMethodSelector from "@/components/payments/PaymentMethodSelector";

interface PaymentMethodStepProps {
  invoiceDetails: InvoiceDetails;
  onSelect: (methodId: string) => void;
  onBack: () => void;
}

const PaymentMethodStep = ({ 
  invoiceDetails, 
  onSelect, 
  onBack 
}: PaymentMethodStepProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  
  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Select Payment Method</h2>
        <p className="text-muted-foreground">
          Choose how you want to pay {invoiceDetails.vendorName}
        </p>
      </div>
      
      <PaymentMethodSelector 
        onSelect={handleMethodSelect}
        selectedMethodId={selectedMethod || undefined}
      />
      
      <div className="pt-4 flex gap-3">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex-1"
        >
          Back
        </Button>
        <Button 
          onClick={() => selectedMethod && onSelect(selectedMethod)}
          disabled={!selectedMethod}
          className="flex-1"
        >
          Proceed to Pay
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethodStep;
