
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Loader2 } from "lucide-react";
import ManualPayrollForm from "./components/ManualPayrollForm";
import BulkUploadPayrollForm from "./components/BulkUploadPayrollForm";

interface PayrollPayeeFormProps {
  onSubmit: () => void;
}

const PayrollPayeeForm = ({ onSubmit }: PayrollPayeeFormProps) => {
  const [entryMethod, setEntryMethod] = useState<"manual" | "bulk" | null>(null);
  
  if (entryMethod === null) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium mb-4">Select Entry Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card 
            className="p-6 cursor-pointer border hover:border-primary hover:shadow-md transition-all"
            onClick={() => setEntryMethod("manual")}
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
                Add a single employee to payroll by filling out a form
              </p>
            </div>
          </Card>
          
          <Card 
            className="p-6 cursor-pointer border hover:border-primary hover:shadow-md transition-all"
            onClick={() => setEntryMethod("bulk")}
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
        
        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={() => onSubmit()}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">
          {entryMethod === "manual" ? "Manual Payroll Entry" : "Bulk Upload Payroll Data"}
        </h3>
        <Button variant="outline" onClick={() => setEntryMethod(null)}>
          Change Entry Method
        </Button>
      </div>
      
      {entryMethod === "manual" ? (
        <ManualPayrollForm onSubmit={onSubmit} />
      ) : (
        <BulkUploadPayrollForm onSubmit={onSubmit} />
      )}
    </>
  );
};

export default PayrollPayeeForm;
