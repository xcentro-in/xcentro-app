
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Loader2, ArrowRight } from "lucide-react";
import ManualPayrollForm from "../payees/forms/components/ManualPayrollForm";
import BulkUploadPayrollForm from "../payees/forms/components/BulkUploadPayrollForm";
import PaymentMethodStep from "./PaymentMethodStep";
import { PaymentSummary } from "./PaymentSummary";
import { mockPaymentMethods } from "@/data/mockPaymentMethods";

interface PayrollPaymentFormProps {
  onStepChange: (step: number) => void;
}

const PayrollPaymentForm = ({ onStepChange }: PayrollPaymentFormProps) => {
  const [currentStep, setCurrentStep] = useState<'selection' | 'details' | 'payment' | 'review'>('selection');
  const [entryMethod, setEntryMethod] = useState<"manual" | "bulk" | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | undefined>(undefined);
  
  // Handle the completion of the payroll details form (manual or bulk)
  const handleDetailsComplete = () => {
    setCurrentStep('payment');
    onStepChange(2); // Update the progress indicator
  };
  
  // Handle payment method selection
  const handlePaymentMethodSelected = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };
  
  // Move to the review step
  const handleGoToReview = () => {
    setCurrentStep('review');
    onStepChange(3); // Update the progress indicator
  };
  
  // Go back to the previous step
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
  
  // Render the entry method selection screen
  if (currentStep === 'selection') {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium mb-4">Select Entry Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>
      </div>
    );
  }

  // Render the payment details form
  if (currentStep === 'details') {
    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">
            {entryMethod === "manual" ? "Manual Payroll Entry" : "Bulk Upload Payroll Data"}
          </h3>
          <Button variant="outline" onClick={handleBack}>
            Change Entry Method
          </Button>
        </div>
        
        {entryMethod === "manual" ? (
          <ManualPayrollForm onSubmit={handleDetailsComplete} />
        ) : (
          <BulkUploadPayrollForm onSubmit={handleDetailsComplete} />
        )}
      </>
    );
  }
  
  // Render the payment method selection step
  if (currentStep === 'payment') {
    return (
      <PaymentMethodStep 
        selectedPaymentMethod={selectedPaymentMethod}
        onSelect={handlePaymentMethodSelected}
        onBack={handleBack}
        onNext={handleGoToReview}
      />
    );
  }
  
  // Render the review step
  if (currentStep === 'review') {
    // Find the selected payment method from the mock data
    const paymentMethod = mockPaymentMethods.find(m => m.id === selectedPaymentMethod);
    
    return (
      <PaymentSummary
        paymentType="now"
        amount={15000} // Example amount
        description="Payroll payment"
        invoiceReference="PR-2023-001"
        payee={{
          id: "payroll-1",
          name: entryMethod === "manual" ? "John Doe" : "Multiple Employees",
          email: entryMethod === "manual" ? "john.doe@example.com" : "",
          contactNumber: entryMethod === "manual" ? "9876543210" : "",
          type: "payroll",
          bankName: "HDFC Bank",
          accountNumber: entryMethod === "manual" ? "1234567890" : "Multiple Accounts",
          createdAt: new Date().toISOString(),
          isDefault: false
        }}
        paymentMethod={paymentMethod}
        platformFee={150}
        gatewayFee={50}
        totalAmount={15200}
        rewardPoints={152}
        onBack={handleBack}
      />
    );
  }
  
  // Fallback (shouldn't reach here with proper state management)
  return null;
};

export default PayrollPaymentForm;
