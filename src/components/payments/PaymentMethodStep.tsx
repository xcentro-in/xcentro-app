
import { Button } from "@/components/ui/button";
import PaymentMethodSelector from "./PaymentMethodSelector";
import PaymentScheduleSelector, { PaymentScheduleType } from "./common/PaymentScheduleSelector";

interface PaymentMethodStepProps {
  selectedPaymentMethod: string | undefined;
  onSelect: (methodId: string) => void;
  onBack: () => void;
  onNext: () => void;
  paymentType: PaymentScheduleType;
  scheduledDate?: Date;
  frequency: string;
  onPaymentTypeChange: (value: PaymentScheduleType) => void;
  onScheduledDateChange: (date?: Date) => void;
  onFrequencyChange: (value: string) => void;
}

const PaymentMethodStep = ({
  selectedPaymentMethod,
  onSelect,
  onBack,
  onNext,
  paymentType,
  scheduledDate,
  frequency,
  onPaymentTypeChange,
  onScheduledDateChange,
  onFrequencyChange
}: PaymentMethodStepProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium mb-2">Select Payment Method</h3>
      
      <PaymentMethodSelector 
        onSelect={onSelect}
        selectedMethodId={selectedPaymentMethod}
      />

      <PaymentScheduleSelector
        paymentType={paymentType}
        scheduledDate={scheduledDate}
        frequency={frequency}
        onPaymentTypeChange={onPaymentTypeChange}
        onScheduledDateChange={onScheduledDateChange}
        onFrequencyChange={onFrequencyChange}
      />

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack} className="w-auto">Back</Button>
        <Button 
          onClick={onNext} 
          className="w-auto"
          disabled={!selectedPaymentMethod || (paymentType === "later" && !scheduledDate) || (paymentType === "recurring" && (!scheduledDate || !frequency))}
        >
          Review Payment
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethodStep;
