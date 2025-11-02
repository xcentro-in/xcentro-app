
import { useState, useEffect } from "react";
import { PaymentScheduleType } from "./common/PaymentScheduleSelector";
import PayrollEmployeeSelectionStep from "./PayrollEmployeeSelectionStep";
import PayrollPaymentMethodAndReviewStep from "./PayrollPaymentMethodAndReviewStep";
import { Employee } from "./types";
import { toast } from "sonner";
import { employeesAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface PayrollPaymentFormProps {
  onStepChange: (step: number) => void;
}

const PayrollPaymentForm = ({ onStepChange }: PayrollPaymentFormProps) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<'employees' | 'payment-review'>('employees');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | undefined>(undefined);
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Payment schedule states
  const [paymentType, setPaymentType] = useState<PaymentScheduleType>("now");
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [frequency, setFrequency] = useState<string>("monthly");

  // Fetch employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!user?.businessId) return;

      try {
        setIsLoading(true);
        const response = await employeesAPI.getAll(user.businessId);

        if (response.status === 'success' && response.data?.employees) {
          setEmployees(response.data.employees);
        } else {
          toast.error("Failed to load employees");
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
        toast.error("Failed to load employees");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, [user?.businessId]);

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

  // Show loading state while fetching employees
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading employees...</span>
      </div>
    );
  }

  if (currentStep === 'employees') {
    return (
      <PayrollEmployeeSelectionStep
        employees={employees}
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
