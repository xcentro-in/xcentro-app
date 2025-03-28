
import { Button } from "@/components/ui/button";
import PaymentMethodSelector from "./PaymentMethodSelector";

interface PaymentMethodStepProps {
  selectedPaymentMethod: string | undefined;
  onSelect: (methodId: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const PaymentMethodStep = ({
  selectedPaymentMethod,
  onSelect,
  onBack,
  onNext
}: PaymentMethodStepProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium mb-2">Select Payment Method</h3>
      
      <PaymentMethodSelector 
        onSelect={onSelect}
        selectedMethodId={selectedPaymentMethod}
      />

      <div className="flex justify-between gap-3 mt-6">
        <Button variant="outline" onClick={onBack} className="w-auto">Back</Button>
        <Button 
          onClick={onNext} 
          className="w-auto"
          disabled={!selectedPaymentMethod}
        >
          Review Payment
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethodStep;
