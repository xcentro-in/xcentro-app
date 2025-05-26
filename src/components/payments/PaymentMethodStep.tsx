
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Select Payment Method & Schedule</h2>
        <p className="text-muted-foreground">
          Choose your payment method and when to process the payment
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Payment Method</h3>
          <PaymentMethodSelector 
            onSelect={onSelect}
            selectedMethodId={selectedPaymentMethod}
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-lg">Payment Schedule</h3>
          <div className="border rounded-lg p-4">
            <PaymentScheduleSelector
              paymentType={paymentType}
              scheduledDate={scheduledDate}
              frequency={frequency}
              onPaymentTypeChange={onPaymentTypeChange}
              onScheduledDateChange={onScheduledDateChange}
              onFrequencyChange={onFrequencyChange}
            />
          </div>
        </div>
      </div>

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
