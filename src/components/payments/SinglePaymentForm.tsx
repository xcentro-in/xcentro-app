
import { useState } from "react";
import { PaymentDetailsStep } from "./PaymentDetailsStep";
import { TransactionSummary } from "./common/TransactionSummary";
import PayeeSelectionStep from "./PayeeSelectionStep";
import PaymentMethodStep from "./PaymentMethodStep";
import RewardTopUpStep, { RewardPackage } from "./common/RewardTopUpStep";
import { mockPayees } from "@/data/mockPayees";
import { mockPaymentMethods } from "@/data/mockPaymentMethods";
import { PaymentScheduleType } from "./common/PaymentScheduleSelector";

interface SinglePaymentFormProps {
  onStepChange: (step: number) => void;
}

const SinglePaymentForm = ({ onStepChange }: SinglePaymentFormProps) => {
  const [step, setStep] = useState(1);
  const [paymentType, setPaymentType] = useState<PaymentScheduleType>("now");
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [invoiceReference, setInvoiceReference] = useState<string>("");
  const [frequency, setFrequency] = useState<string>("monthly");
  const [selectedPayee, setSelectedPayee] = useState<string>();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>();
  const [favoritePayees, setFavoritePayees] = useState<string[]>(["1", "3"]);
  const [selectedRewardPackage, setSelectedRewardPackage] = useState<RewardPackage | null>(null);
  
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

  const handleRewardPackageSelected = (pkg: RewardPackage | null) => {
    setSelectedRewardPackage(pkg);
    handleNext();
  };

  const payeeDetails = selectedPayee ? mockPayees.find(payee => payee.id === selectedPayee) : undefined;
  
  const paymentMethodDetails = selectedPaymentMethod ? 
    mockPaymentMethods.find(method => method.id === selectedPaymentMethod) : undefined;

  const parsedAmount = amount ? parseFloat(amount) : 0;
  const rewardPackageCost = selectedRewardPackage ? (parsedAmount * selectedRewardPackage.percentage / 100) : 0;
  const platformFee = parsedAmount * 0.01;
  const gatewayFee = parsedAmount * 0.005;
  const totalAmount = parsedAmount + platformFee + gatewayFee + rewardPackageCost;
  
  const baseRewardPoints = Math.floor(parsedAmount / 10);
  const rewardPoints = selectedRewardPackage 
    ? Math.floor(baseRewardPoints * selectedRewardPackage.multiplier)
    : baseRewardPoints;

  return (
    <div className="space-y-6">
      {step === 1 && (
        <PaymentDetailsStep
          paymentType="now"
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
          paymentType={paymentType}
          scheduledDate={scheduledDate}
          frequency={frequency}
          onPaymentTypeChange={setPaymentType}
          onScheduledDateChange={setScheduledDate}
          onFrequencyChange={setFrequency}
          onBack={handleBack}
          onNext={handleNext}
        />
      )}

      {step === 4 && (
        <RewardTopUpStep
          amount={parsedAmount}
          onBack={handleBack}
          onNext={handleRewardPackageSelected}
        />
      )}

      {step === 5 && payeeDetails && (
        <TransactionSummary
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
          rewardPackage={selectedRewardPackage}
          totalAmount={totalAmount}
          rewardPoints={rewardPoints}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default SinglePaymentForm;
