
import { Card } from "@/components/ui/card";
import { Upload, Users } from "lucide-react";

type EntryMethod = "manual" | "bulk" | "existing" | null;

interface PayrollEntryMethodStepProps {
  onMethodSelect: (method: EntryMethod) => void;
}

const PayrollEntryMethodStep = ({ onMethodSelect }: PayrollEntryMethodStepProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium mb-4">Select Entry Method</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          className="p-6 cursor-pointer border hover:border-primary hover:shadow-md transition-all"
          onClick={() => onMethodSelect("manual")}
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
          onClick={() => onMethodSelect("bulk")}
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
          onClick={() => onMethodSelect("existing")}
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
};

export default PayrollEntryMethodStep;
