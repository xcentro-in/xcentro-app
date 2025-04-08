import { useState } from "react";
import { PaymentScheduleType } from "./common/PaymentScheduleSelector";
import PayrollEntryMethodStep from "./payroll/PayrollEntryMethodStep";
import PayrollDetailsStep from "./payroll/PayrollDetailsStep";
import PayrollPaymentMethodStep from "./payroll/PayrollPaymentMethodStep";
import PayrollReviewStep from "./payroll/PayrollReviewStep";

interface PayrollPaymentFormProps {
  onStepChange: (step: number) => void;
}

const PayrollPaymentForm = ({ onStepChange }: PayrollPaymentFormProps) => {
  const [currentStep, setCurrentStep] = useState<'selection' | 'details' | 'payment' | 'review'>('selection');
  const [entryMethod, setEntryMethod] = useState<"manual" | "bulk" | "existing" | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | undefined>(undefined);
  const [selectedEmployees, setSelectedEmployees] = useState<any[]>([]);
  
  // Payment schedule states
  const [paymentType, setPaymentType] = useState<PaymentScheduleType>("now");
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [frequency, setFrequency] = useState<string>("monthly");
  
  const mockEmployees = [
    {
      id: "emp-001",
      name: "John Doe",
      email: "john.doe@example.com",
      accountNumber: "1234567890",
      bankName: "HDFC Bank",
      salaryAmount: 45000,
      contactNumber: "9876543210",
    },
    {
      id: "emp-002",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      accountNumber: "2345678901",
      bankName: "ICICI Bank",
      salaryAmount: 52000,
      contactNumber: "9876543211",
    },
    {
      id: "emp-003",
      name: "Raj Patel",
      email: "raj.patel@example.com",
      accountNumber: "3456789012",
      bankName: "SBI Bank",
      salaryAmount: 38000,
      contactNumber: "9876543212",
    },
    {
      id: "emp-004",
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      accountNumber: "4567890123",
      bankName: "Axis Bank",
      salaryAmount: 48000,
      contactNumber: "9876543213",
    },
    {
      id: "emp-005",
      name: "David Wilson",
      email: "david.wilson@example.com",
      accountNumber: "5678901234",
      bankName: "HDFC Bank",
      salaryAmount: 55000,
      contactNumber: "9876543214",
    }
  ];
  
  const handleMethodSelect = (method: "manual" | "bulk" | "existing" | null) => {
    setEntryMethod(method);
    setCurrentStep('details');
    onStepChange(1);
  };
  
  const handleDetailsComplete = (selectedEmps = []) => {
    setSelectedEmployees(selectedEmps);
    setCurrentStep('payment');
    onStepChange(2);
  };
  
  const handlePaymentMethodSelected = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };
  
  const handleGoToReview = () => {
    setCurrentStep('review');
    onStepChange(3);
  };
  
  const handleBack = () => {
    if (currentStep === 'payment') {
      setCurrentStep('details');
      onStepChange(1);
    } else if (currentStep === 'review') {
      setCurrentStep('payment');
      onStepChange(2);
    } else if (currentStep === 'details') {
      setCurrentStep('selection');
      setEntryMethod(null);
      onStepChange(0);
    }
  };

  // Render the appropriate step based on currentStep
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
        onNext={handleGoToReview}
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
        onBack={handleBack}
        onSubmit={() => console.log("Payment submitted")}
      />
    );
  }
  
  return null;
};

export default PayrollPaymentForm;
