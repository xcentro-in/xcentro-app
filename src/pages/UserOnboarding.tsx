import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { parseISO, isValid } from "date-fns";
import KYCDetailsForm from "@/components/onboarding/KYCDetailsForm";
// import RoleSelectionForm from "@/components/onboarding/RoleSelectionForm";
import ReviewDetailsForm from "@/components/onboarding/ReviewDetailsForm";
import { userAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { openAndMonitorPopup } from "@/lib/popupUtils";
import { determineUserRoute } from "@/services/onboardingRouter";
import { isKycComplete, validateAadhaar, validatePAN } from "@/constants/onboarding";

type UserFormData = {
  name: string;
  aadharNumber: string;
  panNumber: string;
  dateOfBirth: string;
  // Role is hardcoded to "owner" now, not user-selectable
  // role: string;
};

const initialFormData: UserFormData = {
  name: "",
  aadharNumber: "",
  panNumber: "",
  dateOfBirth: "",
  // role: "owner", // Hardcoded to owner
};

// Steps array - removed "Select Role" step
const steps = ["KYC Details", "Review"];

const UserOnboarding = () => {
  const navigate = useNavigate();
  const { initializeUser, user, userRoles, onboardingStatus } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingStatus, setIsFetchingStatus] = useState(true);
  const [aadhaarPopup, setAadhaarPopup] = useState<Window | null>(null);
  const [aadhaarLink, setAadhaarLink] = useState("");
  const [isPopupBlocked, setIsPopupBlocked] = useState(false);
  const [hasApiError, setHasApiError] = useState(false);
  const popupCheckIntervalRef = useRef<number | null>(null);

  // Determine flow type
  // Note: BusinessOnboarding stores in localStorage, not sessionStorage
  const businessId = localStorage.getItem("business-id");
  const isJoinFlow = !businessId;

  const progress = (currentStep / steps.length) * 100;

  // Fetch user onboarding status on mount - ProtectedRoute handles access control
  useEffect(() => {
    const fetchOnboardingStatus = async () => {
      try {
        const statusResponse = await userAPI.getOnboardingStatus();
        const { name, dob, taxId, mobile, kycStatus, nationalId } = statusResponse.data;

        // If KYC is already completed or verified, redirect to dashboard
        if (isKycComplete(kycStatus)) {
          console.log("KYC has already been completed, redirecting to dashboard");
          toast.error("KYC has already been completed");
          navigate("/", { replace: true });
          return;
        }

        // If KYC is not in "not_started" state, pre-fill available data
        if (kycStatus !== "kyc_not_started") {
          // Auto-fill available fields (don't fill Aadhaar for security)
          setFormData((prev) => ({
            ...prev,
            name: name || "",
            dateOfBirth: dob || "",
            panNumber: taxId || "",
            aadharNumber: "", // Always let user fill Aadhaar again
          }));

          console.log("Pre-filled user data from status:", { name, dob, taxId, kycStatus });
        }
      } catch (error: any) {
        // If status endpoint returns 404 or error, start fresh (no pre-fill)
        console.log("No existing user onboarding found, starting fresh");
      } finally {
        setIsFetchingStatus(false);
      }
    };

    fetchOnboardingStatus();
  }, [navigate]);

  // Listen for postMessage from KYC callback page (optional, just for logging)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Extract base URL from VITE_API_URL
      const apiBaseUrl = import.meta.env.VITE_API_URL
        ? new URL(import.meta.env.VITE_API_URL).origin
        : null;

      const trustedOrigins = [
        window.location.origin,
        apiBaseUrl,
        'http://localhost:8888',
        'https://api.xcentro.in',
        'https://api-staging.xcentro.in',
        'https://api-dev.xcentro.in',
      ].filter(Boolean) as string[];

      // Security check: Verify message origin
      if (!trustedOrigins.includes(event.origin)) {
        return;
      }

      const message = event.data;

      // Log KYC completion message (actual completion happens on popup close)
      if (message?.type === 'KYC_COMPLETE') {
        console.log('KYC completion message received:', message);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleNext = () => {
    // Step 1: Validate KYC details
    if (currentStep === 1) {
      if (!formData.name || !formData.aadharNumber || !formData.panNumber || !formData.dateOfBirth) {
        toast.error("Please complete all required fields");
        return;
      }

      if (!validateAadhaar(formData.aadharNumber)) {
        toast.error("Please enter a valid 12-digit Aadhaar number");
        return;
      }

      if (!validatePAN(formData.panNumber)) {
        toast.error("Please enter a valid PAN number (e.g., ABCDE1234F)");
        return;
      }
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Open Aadhaar verification popup
  const openAadhaarPopup = (url: string) => {
    const cleanup = openAndMonitorPopup(
      url,
      "aadhaar-verification",
      "width=800,height=600,scrollbars=yes",
      async () => {
        // Popup closed callback
        setAadhaarPopup(null);
        setIsPopupBlocked(false);
        popupCheckIntervalRef.current = null;

        console.log('Aadhaar verification popup closed, completing onboarding...');

        // Automatically complete onboarding when popup closes
        await handleCompleteOnboarding();
      },
      () => {
        // Popup blocked callback
        setIsPopupBlocked(true);
        setIsLoading(false);
        toast.error(
          "Popup was blocked. Please enable popups for this site and try again.",
          {
            duration: 8000,
            description: "Click the popup blocker icon in your browser's address bar to allow popups."
          }
        );
      }
    );

    // If popup opened successfully, store cleanup function
    if (cleanup) {
      // We need to track the popup window for potential manual closing
      // The cleanup function is stored in the ref for component unmount
      setIsPopupBlocked(false);
      popupCheckIntervalRef.current = 1; // Just a truthy value to indicate monitoring is active
    }
  };

  const handleCompleteOnboarding = async () => {
    try {
      // Determine flow type using existing roles from AuthContext
      let isInvitedUser = false;
      let existingRole = "owner"; // Default role for new business flow

      if (userRoles && userRoles.length > 0) {
        isInvitedUser = true;
        existingRole = userRoles[0].role;
      }

      // For invited users: use their existing role
      // For new business: use "owner"
      const claimedRole = existingRole;

      console.log("Completing user onboarding:", {
        claimedRole,
        businessId,
        isJoinFlow,
        isInvitedUser,
        existingRole
      });

      // Call complete onboarding API
      const completeResponse = await userAPI.completeOnboarding(
        claimedRole,
        isInvitedUser ? undefined : (businessId || undefined),
        undefined // gstin removed from form
      );

      console.log("Complete onboarding response:", completeResponse);

      if (isKycComplete(completeResponse.data.status)) {
        toast.success("User onboarding completed successfully!");

        // Clear business-id from localStorage since onboarding is complete
        localStorage.removeItem('business-id');
        console.log("Cleared business-id from localStorage");

        // Re-initialize user data to get fresh roles and onboarding status
        console.log("Re-initializing user data after KYC completion...");
        await initializeUser();

        // Use centralized routing logic
        const routingDecision = determineUserRoute(
          '/onboarding',
          user,
          userRoles,
          onboardingStatus
        );

        console.log("Routing decision after KYC:", routingDecision);

        if (routingDecision.shouldNavigate) {
          navigate(routingDecision.targetRoute, { replace: true });
        }
      } else {
        toast.error("KYC verification incomplete. Please try again.");
        setIsLoading(false);
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to complete user onboarding.";
      toast.error(errorMessage);
      console.error("Complete onboarding error:", error);
      setHasApiError(true);
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setHasApiError(false);
    setIsPopupBlocked(false);

    try {
      // Always initialize the KYC flow, even if KYC was previously in progress
      // This ensures we have a valid transaction ID for the current verification session
      console.log("Initializing user onboarding and Aadhaar verification");

      // Date is already in yyyy-MM-dd format from native date input
      // Just validate it's a valid date
      const parsedDate = parseISO(formData.dateOfBirth);

      if (!parsedDate || !isValid(parsedDate)) {
        toast.error("Invalid date of birth");
        setIsLoading(false);
        return;
      }

      // Use the date as-is (already in yyyy-MM-dd format)
      const apiDateFormat = formData.dateOfBirth;
      console.log("Date of birth:", apiDateFormat);

      // Remove dashes from Aadhaar for API
      const aadhaarForApi = formData.aadharNumber.replace(/-/g, '');

      const initResponse = await userAPI.initOnboarding(
        formData.name,
        apiDateFormat,
        formData.panNumber,
        aadhaarForApi,
        businessId || undefined
      );

      setAadhaarLink(initResponse.data.aadhaarLink);

      // Step 2: Open Aadhaar verification popup
      openAadhaarPopup(initResponse.data.aadhaarLink);
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to initialize user onboarding.";
      toast.error(errorMessage);
      console.error("Init onboarding error:", error);
      setHasApiError(true);
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRetry = () => {
    // If we have aadhaarLink and it's just a popup block, reopen popup
    if (aadhaarLink && isPopupBlocked && !hasApiError) {
      setIsLoading(true);
      setIsPopupBlocked(false);
      openAadhaarPopup(aadhaarLink);
    } else {
      // Otherwise, restart from beginning (API failed or no aadhaarLink)
      setHasApiError(false);
      setIsPopupBlocked(false);
      setAadhaarLink("");
      handleSubmit();
    }
  };

  // Show loading state while fetching status
  if (isFetchingStatus) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 md:px-0">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading user information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background w-full">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            
            <p className="text-muted-foreground mt-1">Please complete the following steps to set up your account</p>
          </div>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
        <div className="hidden md:block space-y-1 sticky top-20 self-start">
          <Progress value={progress} className="h-2 mb-4" />

          <div className="space-y-6">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isCompleted = currentStep > stepNumber;
              const isCurrent = currentStep === stepNumber;

              return (
                <div key={step} className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium shrink-0",
                      isCompleted
                        ? "bg-primary text-white"
                        : isCurrent
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground",
                    )}
                  >
                    {isCompleted ? <Check className="h-3.5 w-3.5" /> : stepNumber}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isCompleted ? "text-primary" : isCurrent ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {step}
                    </span>
                    {isCurrent && <span className="text-xs text-muted-foreground mt-0.5">Current step</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <div className="md:hidden flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-xs font-medium">
                {currentStep}
              </div>
              <span className="text-sm font-medium">{steps[currentStep - 1]}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Step {currentStep} of {steps.length}
            </div>
          </div>

          {currentStep === 1 && (
            <KYCDetailsForm
              formData={{
                name: formData.name,
                aadharNumber: formData.aadharNumber,
                panNumber: formData.panNumber,
                dateOfBirth: formData.dateOfBirth,
              }}
              updateFormData={(data) => {
                setFormData((prev) => ({ ...prev, ...data }));
              }}
            />
          )}

          {/* Role Selection Step - COMMENTED OUT */}
          {/* {currentStep === 2 && (
            <RoleSelectionForm
              formData={{ role: "owner" }}
              updateFormData={(data) => updateFormData("role", data.role)}
            />
          )} */}

          {currentStep === 2 && (
            <ReviewDetailsForm
              formData={{
                kyc: {
                  name: formData.name,
                  aadharNumber: formData.aadharNumber,
                  panNumber: formData.panNumber,
                  dateOfBirth: formData.dateOfBirth,
                },
                role: {
                  role: "owner", // Hardcoded to owner
                },
              }}
            />
          )}

          <div className="flex justify-between mt-8 pt-4 border-t">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1 || isLoading}>
              Previous
            </Button>

            {currentStep < steps.length ? (
              <Button onClick={handleNext}>Continue</Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  "Submit for Verification"
                )}
              </Button>
            )}
          </div>

          {isLoading && aadhaarPopup && (
            <div className="rounded-lg border p-4 bg-blue-50 border-blue-200 mt-4">
              <div className="flex items-start gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-blue-800">Verification in Progress</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Complete the Aadhaar verification in the popup window. This page will automatically continue
                    once you're done.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRetry}
                    className="mt-3"
                  >
                    Retry Verification
                  </Button>
                </div>
              </div>
            </div>
          )}

          {isPopupBlocked && aadhaarLink && !hasApiError && (
            <div className="rounded-lg border p-4 bg-orange-50 border-orange-200 mt-4">
              <div className="flex items-start gap-3">
                <div className="text-orange-600">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-orange-800">Popup Blocked</h3>
                  <p className="text-sm text-orange-700 mt-1">
                    Your browser blocked the Aadhaar verification popup. Please enable popups for this site and click the button below to try again.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRetry}
                    className="mt-3"
                  >
                    Open Verification Popup
                  </Button>
                </div>
              </div>
            </div>
          )}

          {hasApiError && (
            <div className="rounded-lg border p-4 bg-red-50 border-red-200 mt-4">
              <div className="flex items-start gap-3">
                <div className="text-red-600">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-800">Verification Failed</h3>
                  <p className="text-sm text-red-700 mt-1">
                    Something went wrong. Please retry from start.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRetry}
                    className="mt-3"
                  >
                    Retry from Start
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
        </div>
      </div>
    </div>
  );
};

export default UserOnboarding;
