
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Loader2, ArrowRight, Users } from "lucide-react";
import ManualPayrollForm from "../payees/forms/components/ManualPayrollForm";
import BulkUploadPayrollForm from "../payees/forms/components/BulkUploadPayrollForm";
import PaymentMethodStep from "./PaymentMethodStep";
import { TransactionSummary } from "./common/TransactionSummary";
import { mockPaymentMethods } from "@/data/mockPaymentMethods";
import ExistingEmployeesPayment from "./payroll/ExistingEmployeesPayment";
import { PaymentScheduleType } from "./common/PaymentScheduleSelector";

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
  
  if (currentStep === 'selection') {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium mb-4">Select Entry Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card 
            className="p-6 cursor-pointer border hover:border-primary hover:shadow-md transition-all"
            onClick={() => {
              setEntryMethod("manual");
              setCurrentStep('details');
              onStepChange(1);
            }}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-blue-600"
                >
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  <path d="M12 11h4"></path>
                  <path d="M12 16h4"></path>
                  <path d="M8 11h.01"></path>
                  <path d="M8 16h.01"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium">Manual Entry</h3>
              <p className="text-sm text-muted-foreground">
                Process salary payment for a single employee
              </p>
            </div>
          </Card>
          
          <Card 
            className="p-6 cursor-pointer border hover:border-primary hover:shadow-md transition-all"
            onClick={() => {
              setEntryMethod("bulk");
              setCurrentStep('details');
              onStepChange(1);
            }}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Upload className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium">Bulk Upload</h3>
              <p className="text-sm text-muted-foreground">
                Upload a CSV file with multiple employees' payroll details
              </p>
            </div>
          </Card>

          <Card 
            className="p-6 cursor-pointer border hover:border-primary hover:shadow-md transition-all"
            onClick={() => {
              setEntryMethod("existing");
              setCurrentStep('details');
              onStepChange(1);
            }}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium">Pay Existing Employees</h3>
              <p className="text-sm text-muted-foreground">
                Select employees from your existing records
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (currentStep === 'details') {
    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">
            {entryMethod === "manual" 
              ? "Manual Payroll Entry" 
              : entryMethod === "bulk" 
                ? "Bulk Upload Payroll Data" 
                : "Pay Existing Employees"}
          </h3>
          <Button variant="outline" onClick={handleBack}>
            Change Entry Method
          </Button>
        </div>
        
        {entryMethod === "manual" ? (
          <ManualPayrollForm onSubmit={handleDetailsComplete} />
        ) : entryMethod === "bulk" ? (
          <BulkUploadPayrollForm onSubmit={handleDetailsComplete} />
        ) : (
          <ExistingEmployeesPayment 
            employees={mockEmployees} 
            onSubmit={(selectedEmployees) => handleDetailsComplete(selectedEmployees)} 
          />
        )}
      </>
    );
  }
  
  if (currentStep === 'payment') {
    return (
      <PaymentMethodStep 
        selectedPaymentMethod={selectedPaymentMethod}
        onSelect={handlePaymentMethodSelected}
        onBack={handleBack}
        onNext={handleGoToReview}
        paymentType={paymentType}
        scheduledDate={scheduledDate}
        frequency={frequency}
        onPaymentTypeChange={setPaymentType}
        onScheduledDateChange={setScheduledDate}
        onFrequencyChange={setFrequency}
      />
    );
  }
  
  if (currentStep === 'review') {
    const paymentMethod = mockPaymentMethods.find(m => m.id === selectedPaymentMethod);
    
    const employeesToProcess = entryMethod === "existing" 
      ? selectedEmployees 
      : entryMethod === "bulk" 
        ? mockEmployees 
        : [];

    return (
      <TransactionSummary
        paymentType={paymentType}
        scheduledDate={scheduledDate}
        frequency={frequency}
        amount={entryMethod === "manual" 
          ? 15000 
          : employeesToProcess.reduce((sum, emp) => sum + emp.salaryAmount, 0)} 
        description="Payroll payment"
        invoiceReference="PR-2023-001"
        payee={{
          id: "payroll-1",
          name: entryMethod === "manual" 
            ? "John Doe" 
            : `Multiple Employees (${employeesToProcess.length})`,
          email: entryMethod === "manual" ? "john.doe@example.com" : "",
          contactNumber: entryMethod === "manual" ? "9876543210" : "",
          type: "payroll",
          bankName: "HDFC Bank",
          accountNumber: entryMethod === "manual" ? "1234567890" : "Multiple Accounts",
          ifscCode: "HDFC0001234",
          salaryAmount: entryMethod === "manual" ? 15000 : 0,
          salaryType: "fixed",
          payrollCycle: "monthly",
          createdAt: new Date().toISOString(),
          isDefault: false
        }}
        paymentMethod={paymentMethod}
        platformFee={150}
        gatewayFee={50}
        totalAmount={entryMethod === "manual" 
          ? 15200 
          : employeesToProcess.reduce((sum, emp) => sum + emp.salaryAmount, 0) + 200}
        rewardPoints={entryMethod === "manual" 
          ? 152 
          : Math.floor((employeesToProcess.reduce((sum, emp) => sum + emp.salaryAmount, 0) + 200) / 100)}
        employees={entryMethod === "manual" ? undefined : employeesToProcess}
        onBack={handleBack}
      />
    );
  }
  
  return null;
};

export default PayrollPaymentForm;
