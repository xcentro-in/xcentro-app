
import PaymentMethodStep from "../PaymentMethodStep";
import { PaymentScheduleType } from "../common/PaymentScheduleSelector";

interface PayrollPaymentMethodStepProps {
  selectedPaymentMethod: string | undefined;
  paymentType: PaymentScheduleType;
  scheduledDate?: Date;
  frequency: string;
  onPaymentMethodChange: (methodId: string) => void;
  onPaymentTypeChange: (value: PaymentScheduleType) => void;
  onScheduledDateChange: (date?: Date) => void;
  onFrequencyChange: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const PayrollPaymentMethodStep = ({
  selectedPaymentMethod,
  paymentType,
  scheduledDate,
  frequency,
  onPaymentMethodChange,
  onPaymentTypeChange,
  onScheduledDateChange,
  onFrequencyChange,
  onBack,
  onNext,
}: PayrollPaymentMethodStepProps) => {
  return (
    <PaymentMethodStep
      selectedPaymentMethod={selectedPaymentMethod}
      onSelect={onPaymentMethodChange}
      onBack={onBack}
      onNext={onNext}
      paymentType={paymentType}
      scheduledDate={scheduledDate}
      frequency={frequency}
      onPaymentTypeChange={onPaymentTypeChange}
      onScheduledDateChange={onScheduledDateChange}
      onFrequencyChange={onFrequencyChange}
    />
  );
};

export default PayrollPaymentMethodStep;
