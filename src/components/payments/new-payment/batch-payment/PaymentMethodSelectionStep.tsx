
import { Button } from "@/components/ui/button";
import PaymentMethodSelector from "../shared/payment-methods/PaymentMethodSelector";
import PaymentScheduleSelector from "../shared/common/PaymentScheduleSelector";
import { PaymentType } from "@/types/payments";

interface PaymentMethodSelectionStepProps {
  selectedPaymentMethod?: string;
  onSelect: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
  paymentType: PaymentType;
  scheduledDate?: Date;
  frequency: string;
  onPaymentTypeChange: (value: PaymentType) => void;
  onScheduledDateChange: (date?: Date) => void;
  onFrequencyChange: (value: string) => void;
}

const PaymentMethodSelectionStep = ({
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
}: PaymentMethodSelectionStepProps) => {
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

export default PaymentMethodSelectionStep;
