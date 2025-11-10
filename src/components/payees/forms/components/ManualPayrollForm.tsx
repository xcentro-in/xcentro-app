
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { XCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { payeesAPI } from "@/services/api";
import ManualPayrollBankDetails from "./ManualPayrollBankDetails";

interface ManualPayrollFormProps {
  onEmployeeCreated: (employeeData: {
    relation_id: string;
    payee_id: string;
    account_id: string;
    employee_name: string;
  }) => void;
}

const ManualPayrollForm = ({ onEmployeeCreated }: ManualPayrollFormProps) => {
  const { user, refreshOnboardingStatus } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields
  const [employeeName, setEmployeeName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");

  // Bank details from IFSC API
  const [bankName, setBankName] = useState("");
  const [branchName, setBranchName] = useState("");

  // Validation states
  const [isValidatingIfsc, setIsValidatingIfsc] = useState(false);
  const [ifscValid, setIfscValid] = useState<boolean | null>(null);

  // Error state only (success goes directly to next page)
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleIfscChange = async (value: string) => {
    setIfscCode(value);

    // Reset states if length is not 11
    if (value.length !== 11) {
      setIfscValid(null);
      setBankName("");
      setBranchName("");
      return;
    }

    // IFSC codes are exactly 11 characters
    setIsValidatingIfsc(true);
    setIfscValid(null);

    try {
      // Call Razorpay IFSC API
      const response = await fetch(`https://ifsc.razorpay.com/${value}`);

      if (!response.ok) {
        throw new Error('Invalid IFSC code');
      }

      const data = await response.json();

      // Store bank name and branch name separately
      setBankName(data.BANK);
      setBranchName(data.BRANCH);
      setIfscValid(true);

    } catch (error) {
      console.error('Error validating IFSC:', error);
      setIfscValid(false);
      setBankName("");
      setBranchName("");
    } finally {
      setIsValidatingIfsc(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate business ID exists
    if (!user?.businessId) {
      setErrorMessage('Business ID not found. Please log in again.');
      return;
    }

    // Reset previous error
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      // Build request body according to API specification
      const requestBody = {
        payee_type: "employee",
        display_name: employeeName,
        contact_email: email || undefined,
        contact_phone: contactNumber || undefined,
        employee: {
          full_name: employeeName,
          email: email,
          phone: contactNumber,
          employment_type: "full-time",
          account_number: accountNumber,
          ifsc_code: ifscCode,
          account_holder_name: employeeName.toUpperCase(),
          bank_name: bankName,
          branch_name: branchName,
          account_type: "savings",
          account_label: "Salary Account"
        }
      };

      // Make API call with X-Business-ID header
      const response = await payeesAPI.create(user.businessId, requestBody);

      // API returns nested response: { status, message, data: { relation_id, payee_id, ... } }
      const employeeData = response.data || response;

      // Refresh onboarding status
      // Use retry logic to handle backend delay in updating flags
      await refreshOnboardingStatus({ withRetry: true });

      // Navigate immediately to document upload step
      onEmployeeCreated({
        relation_id: employeeData.relation_id,
        payee_id: employeeData.payee_id,
        account_id: employeeData.account_id,
        employee_name: employeeName
      });

    } catch (error: any) {
      console.error('Error onboarding employee:', error);

      // Handle error response from API
      // API returns { error: "onboarding_failed", message: "..." }
      const errMsg = error?.response?.message || error?.message || 'An unexpected error occurred';
      setErrorMessage(errMsg);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-6">

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2.5">
              <Label htmlFor="employeeName">Employee Full Name</Label>
              <Input
                id="employeeName"
                placeholder="Enter employee name"
                required
                className="h-11"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="For payslip notifications"
                required
                className="h-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <ManualPayrollBankDetails
              accountNumber={accountNumber}
              setAccountNumber={setAccountNumber}
              ifscCode={ifscCode}
              bankName={bankName && branchName ? `${bankName}, ${branchName}` : ""}
              isValidatingIfsc={isValidatingIfsc}
              ifscValid={ifscValid}
              handleIfscChange={handleIfscChange}
            />

            <div className="space-y-2.5">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                placeholder="For payment notifications"
                required
                className="h-11"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Feedback Only */}
      {errorMessage && (
        <Alert variant="destructive">
          <XCircle className="h-5 w-5" />
          <AlertDescription className="font-medium">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          className="w-auto h-11"
          disabled={isSubmitting || !ifscValid}
        >
          {isSubmitting ? "Adding Employee..." : "Continue"}
        </Button>
      </div>
    </form>
  );
};

export default ManualPayrollForm;
