
import { Button } from "@/components/ui/button";
import ManualPayrollForm from "@/components/payees/forms/components/ManualPayrollForm";
import BulkUploadPayrollForm from "@/components/payees/forms/components/BulkUploadPayrollForm";
import ExistingEmployeesPayment from "./ExistingEmployeesPayment";

interface PayrollDetailsStepProps {
  entryMethod: "manual" | "bulk" | "existing";
  onBack: () => void;
  onSubmit: (selectedEmployees?: any[]) => void;
  mockEmployees: any[];
}

const PayrollDetailsStep = ({
  entryMethod,
  onBack,
  onSubmit,
  mockEmployees
}: PayrollDetailsStepProps) => {
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
        <Button variant="outline" onClick={onBack}>
          Change Entry Method
        </Button>
      </div>
      
      {entryMethod === "manual" ? (
        <ManualPayrollForm onSubmit={() => onSubmit()} />
      ) : entryMethod === "bulk" ? (
        <BulkUploadPayrollForm onSubmit={() => onSubmit()} />
      ) : (
        <ExistingEmployeesPayment 
          employees={mockEmployees} 
          onSubmit={(selectedEmployees) => onSubmit(selectedEmployees)} 
        />
      )}
    </>
  );
};

export default PayrollDetailsStep;
