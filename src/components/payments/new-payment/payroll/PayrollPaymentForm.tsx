
import { useState } from "react";
import { PaymentScheduleType } from "./common/PaymentScheduleSelector";
import PayrollEmployeeSelectionStep from "./PayrollEmployeeSelectionStep";
import PayrollPaymentMethodAndReviewStep from "./PayrollPaymentMethodAndReviewStep";
import { Employee } from "./types";
import { toast } from "sonner";

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
  const [currentStep, setCurrentStep] = useState<'employees' | 'payment-review'>('employees');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | undefined>(undefined);
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  
  // Payment schedule states
  const [paymentType, setPaymentType] = useState<PaymentScheduleType>("now");
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [frequency, setFrequency] = useState<string>("monthly");
  
  const handleEmployeesSelect = (employees: Employee[]) => {
    setSelectedEmployees(employees);
  };
  
  const handleNext = () => {
    setCurrentStep('payment-review');
    onStepChange(1);
  };
  
  const handleBack = () => {
    setCurrentStep('employees');
    onStepChange(0);
  };

  const handlePaymentMethodSelected = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  const handleSubmit = () => {
    toast.success("Payroll payment initiated successfully!");
    console.log("Payroll payment submitted");
  };

  if (currentStep === 'employees') {
    return (
      <PayrollEmployeeSelectionStep
        employees={mockEmployees}
        selectedEmployees={selectedEmployees}
        paymentType={paymentType}
        scheduledDate={scheduledDate}
        frequency={frequency}
        onEmployeesSelect={handleEmployeesSelect}
        onPaymentTypeChange={setPaymentType}
        onScheduledDateChange={setScheduledDate}
        onFrequencyChange={setFrequency}
        onNext={handleNext}
      />
    );
  }
  
  if (currentStep === 'payment-review') {
    return (
      <PayrollPaymentMethodAndReviewStep
        selectedEmployees={selectedEmployees}
        selectedPaymentMethod={selectedPaymentMethod}
        paymentType={paymentType}
        scheduledDate={scheduledDate}
        frequency={frequency}
        onPaymentMethodChange={handlePaymentMethodSelected}
        onBack={handleBack}
        onSubmit={handleSubmit}
      />
    );
  }
  
  return null;
};

export default PayrollPaymentForm;
