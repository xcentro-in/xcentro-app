
import { useState } from "react";
import { PaymentDetailsStep, PaymentType } from "./PaymentDetailsStep";
import { PaymentSummary } from "./PaymentSummary";
import PayeeSelectionStep from "./PayeeSelectionStep";
import PaymentMethodStep from "./PaymentMethodStep";
import { mockPayees } from "@/data/mockPayees";
import { mockPaymentMethods } from "@/data/mockPaymentMethods";

interface SinglePaymentFormProps {
  onStepChange: (step: number) => void;
}

const SinglePaymentForm = ({ onStepChange }: SinglePaymentFormProps) => {
  const [step, setStep] = useState(1);
  const [paymentType, setPaymentType] = useState<PaymentType>("now");
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [invoiceReference, setInvoiceReference] = useState<string>("");
  const [frequency, setFrequency] = useState<string>("monthly");
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

  // Get the selected payee details
  const payeeDetails = selectedPayee ? mockPayees.find(payee => payee.id === selectedPayee) : undefined;
  
  // Get the selected payment method details
  const paymentMethodDetails = selectedPaymentMethod ? 
    mockPaymentMethods.find(method => method.id === selectedPaymentMethod) : undefined;

  // Calculate fees and total amount
  const parsedAmount = amount ? parseFloat(amount) : 0;
  const platformFee = parsedAmount * 0.01; // 1% platform fee
  const gatewayFee = parsedAmount * 0.005; // 0.5% gateway fee
  const totalAmount = parsedAmount + platformFee + gatewayFee;
  
  // Calculate reward points (1 point per $10 spent)
  const rewardPoints = Math.floor(parsedAmount / 10);

  return (
    <div className="space-y-6">
      {step === 1 && (
        <PaymentDetailsStep
          paymentType={paymentType}
          scheduledDate={scheduledDate}
          amount={amount}
          description={description}
          invoiceReference={invoiceReference}
          frequency={frequency}
          onPaymentTypeChange={setPaymentType}
          onScheduledDateChange={setScheduledDate}
          onAmountChange={setAmount}
          onDescriptionChange={setDescription}
          onInvoiceReferenceChange={setInvoiceReference}
          onFrequencyChange={setFrequency}
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
          amount={parsedAmount}
          description={description}
          invoiceReference={invoiceReference}
          frequency={frequency}
          payee={payeeDetails}
          paymentMethod={paymentMethodDetails}
          platformFee={platformFee}
          gatewayFee={gatewayFee}
          totalAmount={totalAmount}
          rewardPoints={rewardPoints}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default SinglePaymentForm;
