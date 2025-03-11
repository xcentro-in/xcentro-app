
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
import { CheckCircle, Loader2, Upload } from "lucide-react";

interface PayrollPayeeFormProps {
  onSubmit: () => void;
}

const PayrollPayeeForm = ({ onSubmit }: PayrollPayeeFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [accountNumberMatch, setAccountNumberMatch] = useState(true);
  const [salaryType, setSalaryType] = useState<"fixed" | "variable">("fixed");
  const [ifscCode, setIfscCode] = useState("");
  const [isValidatingIfsc, setIsValidatingIfsc] = useState(false);
  const [ifscValid, setIfscValid] = useState<boolean | null>(null);
  const [bankName, setBankName] = useState("");

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

  const handleConfirmAccountChange = (value: string) => {
    setConfirmAccountNumber(value);
    setAccountNumberMatch(value === accountNumber || value === "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit();
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="employeeName">Employee Full Name</Label>
              <Input id="employeeName" placeholder="Enter employee name" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="For payslip notifications" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Bank Account Number</Label>
              <Input 
                id="accountNumber" 
                placeholder="Enter account number" 
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmAccountNumber" className={!accountNumberMatch ? "text-destructive" : ""}>
                Confirm Account Number
              </Label>
              <Input 
                id="confirmAccountNumber" 
                placeholder="Re-enter account number" 
                value={confirmAccountNumber}
                onChange={(e) => handleConfirmAccountChange(e.target.value)}
                className={!accountNumberMatch ? "border-destructive" : ""}
                required 
              />
              {!accountNumberMatch && confirmAccountNumber && (
                <p className="text-xs text-destructive">Account numbers do not match</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ifscCode">IFSC Code</Label>
              <div className="relative">
                <Input 
                  id="ifscCode" 
                  placeholder="Enter IFSC code" 
                  value={ifscCode}
                  onChange={(e) => handleIfscChange(e.target.value)}
                  className={ifscValid === true ? "pr-10 border-green-500" : "pr-10"}
                  required 
                />
                {isValidatingIfsc && (
                  <Loader2 className="absolute right-3 top-2.5 h-5 w-5 animate-spin text-muted-foreground" />
                )}
                {ifscValid === true && (
                  <CheckCircle className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input 
                id="bankName" 
                placeholder="Auto-populated from IFSC" 
                value={bankName}
                readOnly
                className="bg-muted"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input id="contactNumber" placeholder="For payment notifications" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payrollCycle">Payroll Cycle</Label>
              <Select defaultValue="monthly">
                <SelectTrigger id="payrollCycle">
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
            
            <div className="space-y-2">
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
              />
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <Button type="button" variant="outline" className="w-full flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Bulk Upload Employee Payroll Data
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Upload multiple employees at once using our CSV template
            </p>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || !accountNumberMatch}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Saving Payee...
            </>
          ) : (
            <>Save Payroll Payee</>
          )}
        </Button>
      </div>
    </form>
  );
};

export default PayrollPayeeForm;
