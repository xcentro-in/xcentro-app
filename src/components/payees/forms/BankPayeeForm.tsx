
import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { payeesAPI } from "@/services/api";
import PayeeTags from "./components/PayeeTags";
import BankDetailsSection from "./components/BankDetailsSection";
import SubmitButton from "./components/SubmitButton";

interface BankPayeeFormProps {
  onSubmit: () => void;
}

const BankPayeeForm = ({ onSubmit }: BankPayeeFormProps) => {
  const { user, refreshOnboardingStatus } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      // Call Razorpay IFSC API
      const response = await fetch(`https://ifsc.razorpay.com/${value}`);

      if (!response.ok) {
        throw new Error('Invalid IFSC code');
      }

      const data = await response.json();

      // Store bank name and branch name separately
      setBankName(data.BANK); // Only bank name
      setBranchName(data.BRANCH); // Only branch name
      setBankAddress(data.ADDRESS);
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate business ID exists
    if (!user?.businessId) {
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
      const response = await payeesAPI.create(user.businessId, requestBody);

      // Check response status
      if (response.status === 'success') {
        setApiResponse({
          status: 'success',
          message: response.message || 'Payee onboarded successfully',
          isFullyVerified: response.data?.is_fully_verified
        });

        // Refresh onboarding status to update hasAddedVendor flag
        // Use retry logic to handle backend delay in updating flags
        await refreshOnboardingStatus({ withRetry: true });

        // Call onSubmit callback after 2 seconds
        setTimeout(() => {
          onSubmit();
        }, 2000);
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
    } finally {
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

      {/* Success/Error Feedback */}
      {apiResponse.status === 'success' && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <AlertDescription className="flex flex-col gap-2">
            <span className="font-medium text-green-900">{apiResponse.message}</span>
            {apiResponse.isFullyVerified && (
              <span className="text-sm text-green-700 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Payee fully verified (GST, Bank, Cross-verification successful)
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {apiResponse.status === 'error' && (
        <Alert variant="destructive">
          <XCircle className="h-5 w-5" />
          <AlertDescription className="font-medium">
            {apiResponse.message}
          </AlertDescription>
        </Alert>
      )}

      <SubmitButton isSubmitting={isSubmitting} />
    </form>
  );
};

export default BankPayeeForm;
