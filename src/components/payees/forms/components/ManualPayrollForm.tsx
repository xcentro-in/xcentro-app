
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Upload } from "lucide-react";
import ManualPayrollBankDetails from "./ManualPayrollBankDetails";

interface ManualPayrollFormProps {
  onSubmit: () => void;
}

const ManualPayrollForm = ({ onSubmit }: ManualPayrollFormProps) => {
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [isValidatingIfsc, setIsValidatingIfsc] = useState(false);
  const [ifscValid, setIfscValid] = useState<boolean | null>(null);
  const [bankName, setBankName] = useState("");
  const [salaryType, setSalaryType] = useState<"fixed" | "variable">("fixed");

  const handleIfscChange = (value: string) => {
    setIfscCode(value);
    if (value.length === 11) { // IFSC codes are 11 characters
      setIsValidatingIfsc(true);
      // Simulate IFSC validation
      setTimeout(() => {
        setIsValidatingIfsc(false);
        setIfscValid(true);
        setBankName("National Bank - Mumbai Branch"); // Auto-populated based on IFSC
      }, 1000);
    } else {
      setIfscValid(null);
      setBankName("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              type="button" 
              className="flex items-center gap-2" 
              onClick={() => window.location.href = "#bulk-upload"}
            >
              <Upload className="h-4 w-4" />
              Bulk Upload Employee Payroll Data
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2.5">
              <Label htmlFor="employeeName">Employee Full Name</Label>
              <Input id="employeeName" placeholder="Enter employee name" required className="h-11" />
            </div>
            
            <div className="space-y-2.5">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="For payslip notifications" required className="h-11" />
            </div>
            
            <ManualPayrollBankDetails
              accountNumber={accountNumber}
              setAccountNumber={setAccountNumber}
              ifscCode={ifscCode}
              bankName={bankName}
              isValidatingIfsc={isValidatingIfsc}
              ifscValid={ifscValid}
              handleIfscChange={handleIfscChange}
            />
            
            <div className="space-y-2.5">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input id="contactNumber" placeholder="For payment notifications" required className="h-11" />
            </div>
            
            <div className="space-y-2.5">
              <Label htmlFor="payrollCycle">Payroll Cycle</Label>
              <Select defaultValue="monthly">
                <SelectTrigger id="payrollCycle" className="h-11">
                  <SelectValue placeholder="Select payroll cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="custom">Custom Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2.5">
              <div className="flex justify-between">
                <Label htmlFor="salaryAmount">Salary Amount</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="salary-type"
                    checked={salaryType === "variable"}
                    onCheckedChange={(checked) => setSalaryType(checked ? "variable" : "fixed")}
                  />
                  <Label htmlFor="salary-type" className="text-sm cursor-pointer">
                    {salaryType === "fixed" ? "Fixed" : "Variable"}
                  </Label>
                </div>
              </div>
              <Input 
                id="salaryAmount" 
                type="number" 
                placeholder="Enter salary amount" 
                required 
                className="h-11"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button type="submit" className="w-auto h-11">
          Choose Payment Method
        </Button>
      </div>
    </form>
  );
};

export default ManualPayrollForm;
