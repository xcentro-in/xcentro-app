
import { useState } from "react";
import { PaymentScheduleType } from "./common/PaymentScheduleSelector";
import PayrollEntryMethodStep from "./payroll/PayrollEntryMethodStep";
import PayrollDetailsStep from "./payroll/PayrollDetailsStep";
import PayrollPaymentMethodStep from "./payroll/PayrollPaymentMethodStep";
import PayrollReviewStep from "./payroll/PayrollReviewStep";
import RewardTopUpStep, { RewardPackage } from "./common/RewardTopUpStep";
import { Employee } from "./payroll/types";

interface PayrollPaymentFormProps {
  onStepChange: (step: number) => void;
}

const PayrollPaymentForm = ({ onStepChange }: PayrollPaymentFormProps) => {
  const [currentStep, setCurrentStep] = useState<'selection' | 'details' | 'payment' | 'rewards' | 'review'>('selection');
  const [entryMethod, setEntryMethod] = useState<"manual" | "bulk" | "existing" | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | undefined>(undefined);
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  const [selectedRewardPackage, setSelectedRewardPackage] = useState<RewardPackage | null>(null);
  
  // Payment schedule states
  const [paymentType, setPaymentType] = useState<PaymentScheduleType>("now");
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [frequency, setFrequency] = useState<string>("monthly");
  
  const handleMethodSelect = (method: "manual" | "bulk" | "existing" | null) => {
    setEntryMethod(method);
    setCurrentStep('details');
    onStepChange(1);
  };
  
  const handleDetailsComplete = (selectedEmps: Employee[] = []) => {
    setSelectedEmployees(selectedEmps);
    setCurrentStep('payment');
    onStepChange(2);
  };
  
  const handlePaymentMethodSelected = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };
  
  const handleGoToRewardTopUp = () => {
    setCurrentStep('rewards');
    onStepChange(3);
  };

  const handleRewardPackageSelected = (pkg: RewardPackage | null) => {
    setSelectedRewardPackage(pkg);
    setCurrentStep('review');
    onStepChange(4);
  };
  
  const handleBack = () => {
    if (currentStep === 'payment') {
      setCurrentStep('details');
      onStepChange(1);
    } else if (currentStep === 'rewards') {
      setCurrentStep('payment');
      onStepChange(2);
    } else if (currentStep === 'review') {
      setCurrentStep('rewards');
      onStepChange(3);
    } else if (currentStep === 'details') {
      setCurrentStep('selection');
      setEntryMethod(null);
      onStepChange(0);
    }
  };

  // Calculate total salary amount
  const totalAmount = selectedEmployees.reduce((sum, emp) => sum + emp.salaryAmount, 0);

  if (currentStep === 'selection') {
    return <PayrollEntryMethodStep onMethodSelect={handleMethodSelect} />;
  }

  if (currentStep === 'details' && entryMethod) {
    return (
      <PayrollDetailsStep
        entryMethod={entryMethod}
        onBack={handleBack}
        onSubmit={handleDetailsComplete}
        mockEmployees={mockEmployees}
      />
    );
  }
  
  if (currentStep === 'payment') {
    return (
      <PayrollPaymentMethodStep 
        selectedPaymentMethod={selectedPaymentMethod}
        paymentType={paymentType}
        scheduledDate={scheduledDate}
        frequency={frequency}
        onPaymentMethodChange={handlePaymentMethodSelected}
        onPaymentTypeChange={setPaymentType}
        onScheduledDateChange={setScheduledDate}
        onFrequencyChange={setFrequency}
        onBack={handleBack}
        onNext={handleGoToRewardTopUp}
      />
    );
  }

  if (currentStep === 'rewards') {
    return (
      <RewardTopUpStep
        amount={totalAmount}
        onBack={handleBack}
        onNext={handleRewardPackageSelected}
      />
    );
  }
  
  if (currentStep === 'review') {
    return (
      <PayrollReviewStep
        selectedEmployees={selectedEmployees}
        selectedPaymentMethod={selectedPaymentMethod}
        paymentType={paymentType}
        scheduledDate={scheduledDate}
        frequency={frequency}
        rewardPackage={selectedRewardPackage}
        onBack={handleBack}
        onSubmit={() => console.log("Payment submitted")}
      />
    );
  }
  
  return null;
};

export default PayrollPaymentForm;
