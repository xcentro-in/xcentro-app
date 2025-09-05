import { useState } from "react";
import CombinedDetailsStep, { PaymentType } from "./CombinedDetailsStep";
import RewardTopUpStep, { RewardPackage } from "./common/RewardTopUpStep";
import PaymentMethodAndReviewStep from "./PaymentMethodAndReviewStep";
import { mockPayees } from "@/data/mockPayees";
import { toast } from "@/hooks/use-toast";

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

  const handleSubmit = () => {
    toast({
      title: "Payment Initiated",
      description: "Your payment has been successfully processed.",
    });
  };

  const payeeDetails = selectedPayee ? mockPayees.find(payee => payee.id === selectedPayee) : undefined;

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
        <CombinedDetailsStep
          paymentType={paymentType}
          scheduledDate={scheduledDate}
          amount={amount}
          description={description}
          invoiceReference={invoiceReference}
          frequency={frequency}
          selectedPayee={selectedPayee}
          favoritePayees={favoritePayees}
          onPaymentTypeChange={setPaymentType}
          onScheduledDateChange={setScheduledDate}
          onAmountChange={setAmount}
          onDescriptionChange={setDescription}
          onInvoiceReferenceChange={setInvoiceReference}
          onFrequencyChange={setFrequency}
          onPayeeSelect={setSelectedPayee}
          onNext={handleNext}
        />
      )}

      {step === 2 && (
        <RewardTopUpStep
          amount={parsedAmount}
          onBack={handleBack}
          onNext={handleRewardPackageSelected}
        />
      )}

      {step === 3 && payeeDetails && (
        <PaymentMethodAndReviewStep
          paymentType={paymentType}
          scheduledDate={scheduledDate}
          amount={parsedAmount}
          description={description}
          invoiceReference={invoiceReference}
          frequency={frequency}
          payee={payeeDetails}
          selectedRewardPackage={selectedRewardPackage}
          platformFee={platformFee}
          gatewayFee={gatewayFee}
          totalAmount={totalAmount}
          rewardPoints={rewardPoints}
          onBack={handleBack}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default SinglePaymentForm;
