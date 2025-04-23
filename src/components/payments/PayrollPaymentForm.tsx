
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

// Mock data for example employees
const mockEmployees: Employee[] = [
  {
    id: "emp-001",
    name: "John Doe",
    email: "john.doe@example.com",
    accountNumber: "1234567890",
    bankName: "HDFC Bank",
    salaryAmount: 75000,
    contactNumber: "+91 9876543210"
  },
  {
    id: "emp-002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    accountNumber: "9876543210",
    bankName: "ICICI Bank",
    salaryAmount: 82000,
    contactNumber: "+91 8765432109"
  },
  {
    id: "emp-003",
    name: "Raj Patel",
    email: "raj.patel@example.com",
    accountNumber: "5432167890",
    bankName: "SBI Bank",
    salaryAmount: 95000,
    contactNumber: "+91 7654321098"
  },
  {
    id: "emp-004",
    name: "Priya Singh",
    email: "priya.singh@example.com",
    accountNumber: "6789054321",
    bankName: "Axis Bank",
    salaryAmount: 68000,
    contactNumber: "+91 6543210987"
  }
];

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
    // Update the parent component's step counter
    onStepChange(1);
  };
  
  const handleDetailsComplete = (selectedEmps: Employee[] = []) => {
    setSelectedEmployees(selectedEmps);
    setCurrentStep('payment');
    // Update to step 2 in the parent component
    onStepChange(2);
  };
  
  const handlePaymentMethodSelected = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };
  
  const handleGoToRewardTopUp = () => {
    setCurrentStep('rewards');
    // Update to step 3 in the parent component
    onStepChange(3);
  };

  const handleRewardPackageSelected = (pkg: RewardPackage | null) => {
    setSelectedRewardPackage(pkg);
    setCurrentStep('review');
    // Update to step 4 in the parent component
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
