
import { useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { payeesAPI } from "@/services/api";
import { toast } from "sonner";
import PayeeTags from "./components/PayeeTags";
import BankDetailsSection from "./components/BankDetailsSection";

interface BankPayeeFormProps {
  onSubmit: () => void;
}

const BankPayeeForm = ({ onSubmit }: BankPayeeFormProps) => {
  const { user } = useAuth();
  const { businessId, businessName } = useCurrentBusiness();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form fields
  const [payeeName, setPayeeName] = useState("");
  const [gstin, setGstin] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  // Bank details from IFSC API
  const [bankName, setBankName] = useState(""); // Only bank name
  const [branchName, setBranchName] = useState(""); // Only branch name
  const [bankAddress, setBankAddress] = useState("");
  const [accountHolderName, setAccountHolderName] = useState(""); // Will be auto-filled from IFSC

  // Validation states
  const [isValidatingIfsc, setIsValidatingIfsc] = useState(false);
  const [ifscValid, setIfscValid] = useState<boolean | null>(null);

  // Success/Error states
  const [apiResponse, setApiResponse] = useState<{
    status: 'success' | 'error' | null;
    message: string;
    isFullyVerified?: boolean;
  }>({ status: null, message: '' });

  // Legacy - commented out PayeeTags
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleIfscChange = async (value: string) => {
    setIfscCode(value);

    // Reset states if length is not 11
    if (value.length !== 11) {
      setIfscValid(null);
      setBankName("");
      setBranchName("");
      setBankAddress("");
      return;
    }

    // IFSC codes are exactly 11 characters
    setIsValidatingIfsc(true);
    setIfscValid(null);

    try {
      // Call backend IFSC validation API
      const response = await payeesAPI.validateIfsc(value);

      if (response.status !== 'success') {
        throw new Error('Invalid IFSC code');
      }

      const data = response.data;

      // Store bank name and branch name separately
      setBankName(data.bank); // Only bank name
      setBranchName(data.branch); // Only branch name
      setBankAddress(data.address);
      setIfscValid(true);

    } catch (error) {
      console.error('Error validating IFSC:', error);
      setIfscValid(false);
      setBankName("");
      setBranchName("");
      setBankAddress("");
    } finally {
      setIsValidatingIfsc(false);
    }
  };
  
  // Check if all required fields are filled
  const isFormValid =
    payeeName.trim() !== "" &&
    accountNumber.trim() !== "" &&
    ifscCode.trim() !== "" &&
    contactNumber.trim() !== "" &&
    ifscValid === true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate business ID exists
    if (!businessId) {
      setApiResponse({
        status: 'error',
        message: 'Business ID not found. Please log in again.'
      });
      return;
    }

    // Reset previous response
    setApiResponse({ status: null, message: '' });
    setIsSubmitting(true);

    try {
      // Build request body according to API specification
      const requestBody = {
        payee_type: "vendor",
        display_name: payeeName,
        contact_email: email || undefined, // Optional
        contact_phone: contactNumber || undefined, // Optional
        notes: "", // Optional - can be added later if needed
        vendor: {
          gstin: gstin || undefined,
          account_number: accountNumber,
          ifsc_code: ifscCode,
          account_holder_name: payeeName, // Using payee name as account holder name
          bank_name: bankName, // Only bank name (from IFSC API)
          branch_name: branchName // Only branch name (from IFSC API)
        }
      };

      // Make API call with X-Business-ID header
      const response = await payeesAPI.create(businessId, requestBody);

      // Check response status
      if (response.status === 'success') {
        // Show success state on button
        setIsSuccess(true);

        // Show success toast
        toast.success("Vendor added successfully", {
          description: response.data?.is_fully_verified
            ? "Vendor verified successfully"
            : "Vendor details saved"
        });

        // Call onSubmit callback after 1.5 seconds
        // Flag will be updated automatically when PayeeList renders and detects vendors exist
        setTimeout(() => {
          onSubmit();
        }, 1500);
      } else {
        throw new Error(response.message || 'Failed to onboard payee');
      }

    } catch (error: any) {
      console.error('Error onboarding payee:', error);

      // Handle error response
      const errorMessage = error?.message || 'An unexpected error occurred';
      setApiResponse({
        status: 'error',
        message: errorMessage
      });
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Tag selection section at the top for prominence */}
      {/* <PayeeTags 
        selectedTags={selectedTags} 
        setSelectedTags={setSelectedTags} 
      /> */}
      
      <BankDetailsSection
        payeeName={payeeName}
        setPayeeName={setPayeeName}
        gstin={gstin}
        setGstin={setGstin}
        accountNumber={accountNumber}
        setAccountNumber={setAccountNumber}
        ifscCode={ifscCode}
        bankName={bankName && branchName ? `${bankName}, ${branchName}` : ""}
        bankAddress={bankAddress}
        email={email}
        setEmail={setEmail}
        contactNumber={contactNumber}
        setContactNumber={setContactNumber}
        isValidatingIfsc={isValidatingIfsc}
        ifscValid={ifscValid}
        handleIfscChange={handleIfscChange}
      />

      {/* Error Feedback */}
      {apiResponse.status === 'error' && (
        <Alert variant="destructive">
          <XCircle className="h-5 w-5" />
          <AlertDescription className="font-medium">
            {apiResponse.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!isFormValid || isSubmitting || isSuccess}
          className={`h-11 px-6 ${isSuccess ? 'bg-green-600 hover:bg-green-600' : ''}`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Vendor...
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Added Successfully
            </>
          ) : (
            <>Save Vendor</>
          )}
        </Button>
      </div>
    </form>
  );
};

export default BankPayeeForm;
