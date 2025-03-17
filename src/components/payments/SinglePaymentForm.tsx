
import { useState } from "react";
import { PaymentDetailsStep, PaymentType } from "./PaymentDetailsStep";
import { PaymentSummary } from "./PaymentSummary";
import PayeeSelectionStep from "./PayeeSelectionStep";
import PaymentMethodStep from "./PaymentMethodStep";

interface SinglePaymentFormProps {
  onStepChange: (step: number) => void;
}

const SinglePaymentForm = ({ onStepChange }: SinglePaymentFormProps) => {
  const [step, setStep] = useState(1);
  const [paymentType, setPaymentType] = useState<PaymentType>("now");
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [selectedPayee, setSelectedPayee] = useState<string>();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>();
  const [favoritePayees, setFavoritePayees] = useState<string[]>(["1", "3"]);
  
  const handleNext = () => {
    const nextStep = step + 1;
    setStep(nextStep);
    onStepChange(nextStep);
  };

  const handleBack = () => {
    const prevStep = step - 1;
    setStep(prevStep);
    onStepChange(prevStep);
  };
  
  const toggleFavorite = (payeeId: string) => {
    setFavoritePayees(prev => 
      prev.includes(payeeId) 
        ? prev.filter(id => id !== payeeId) 
        : [...prev, payeeId]
    );
  };

  return (
    <div className="space-y-6">
      {step === 1 && (
        <PaymentDetailsStep
          paymentType={paymentType}
          scheduledDate={scheduledDate}
          onPaymentTypeChange={setPaymentType}
          onScheduledDateChange={setScheduledDate}
          onNext={handleNext}
        />
      )}

      {step === 2 && (
        <PayeeSelectionStep
          selectedPayee={selectedPayee}
          setSelectedPayee={setSelectedPayee}
          favoritePayees={favoritePayees}
          toggleFavorite={toggleFavorite}
          onBack={handleBack}
          onNext={handleNext}
        />
      )}

      {step === 3 && (
        <PaymentMethodStep
          selectedPaymentMethod={selectedPaymentMethod}
          onSelect={setSelectedPaymentMethod}
          onBack={handleBack}
          onNext={handleNext}
        />
      )}

      {step === 4 && (
        <PaymentSummary
          paymentType={paymentType}
          scheduledDate={scheduledDate}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default SinglePaymentForm;
