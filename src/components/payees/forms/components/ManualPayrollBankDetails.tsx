
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Loader2 } from "lucide-react";

interface ManualPayrollBankDetailsProps {
  accountNumber: string;
  setAccountNumber: (value: string) => void;
  ifscCode: string;
  bankName: string;
  isValidatingIfsc: boolean;
  ifscValid: boolean | null;
  handleIfscChange: (value: string) => void;
}

const ManualPayrollBankDetails = ({
  accountNumber,
  setAccountNumber,
  ifscCode,
  bankName,
  isValidatingIfsc,
  ifscValid,
  handleIfscChange
}: ManualPayrollBankDetailsProps) => {
  return (
    <>
      <div className="space-y-2.5">
        <Label htmlFor="accountNumber">Bank Account Number</Label>
        <Input 
          id="accountNumber" 
          placeholder="Enter account number" 
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          required 
          className="h-11"
        />
      </div>
      
      <div className="space-y-2.5">
        <Label htmlFor="ifscCode">IFSC Code</Label>
        <div className="relative">
          <Input 
            id="ifscCode" 
            placeholder="Enter IFSC code" 
            value={ifscCode}
            onChange={(e) => handleIfscChange(e.target.value)}
            className={`h-11 pr-10 ${ifscValid === true ? "border-green-500" : ""}`}
            required 
          />
          {isValidatingIfsc && (
            <Loader2 className="absolute right-3 top-3 h-5 w-5 animate-spin text-muted-foreground" />
          )}
          {ifscValid === true && (
            <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-green-500" />
          )}
        </div>
      </div>
      
      <div className="space-y-2.5">
        <Label htmlFor="bankName">Bank Name</Label>
        <Input 
          id="bankName" 
          placeholder="Auto-populated from IFSC" 
          value={bankName}
          readOnly
          className="h-11 bg-muted"
        />
      </div>
    </>
  );
};

export default ManualPayrollBankDetails;
