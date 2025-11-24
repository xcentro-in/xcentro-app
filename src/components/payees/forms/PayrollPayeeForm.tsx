
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ManualPayrollForm from "./components/ManualPayrollForm";
import EmployeeDocumentUploadStep from "./components/EmployeeDocumentUploadStep";

interface PayrollPayeeFormProps {
  onSubmit: () => void;
}

const PayrollPayeeForm = ({ onSubmit }: EmployeePayeeFormProps) => {
  const [step, setStep] = useState<"entry" | "document">("entry");
  const [employeeData, setEmployeeData] = useState<{
    relation_id: string;
    payee_id: string;
    account_id: string;
    employee_name: string;
  } | null>(null);

  const handleEmployeeCreated = (data: {
    relation_id: string;
    payee_id: string;
    account_id: string;
    employee_name: string;
  }) => {
    setEmployeeData(data);
    setStep("document");
  };

  const handleDocumentUploadComplete = () => {
    // Complete the entire flow
    onSubmit();
  };

  const handleBack = () => {
    setStep("entry");
    setEmployeeData(null);
  };

  // Document upload step
  if (step === "document" && employeeData) {
    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Employee Document Upload</h3>
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <EmployeeDocumentUploadStep
          employeeData={employeeData}
          onUploadComplete={handleDocumentUploadComplete}
        />
      </>
    );
  }

  return (
    <ManualPayrollForm onEmployeeCreated={handleEmployeeCreated} />
  );
};

export default PayrollPayeeForm;
