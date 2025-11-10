import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Building, Check, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import BusinessBasicInfoForm from "@/components/business/BusinessBasicInfoForm";
import BusinessTypeForm from "@/components/business/BusinessTypeForm";
import BusinessDocumentsForm from "@/components/business/BusinessDocumentsForm";
import BusinessReviewForm from "@/components/business/BusinessReviewForm";
import { businessAPI, userAPI } from "@/services/api";
import {
  toBackendBusinessType,
  toFrontendBusinessType,
  requiresCIN as checkRequiresCIN,
  requiresDeedUpload as checkRequiresDeedUpload
} from "@/lib/businessTypeMapping";

type BusinessFormData = {
  name: string;
  gstin: string;
  type: string;
  model: string;
  turnover: string;
  documents: {
    cin?: string;
    deed?: File | null;
  };
};

const initialFormData: BusinessFormData = {
  name: "",
  gstin: "",
  type: "",
  model: "",
  turnover: "",
  documents: {
    cin: "",
    deed: null,
  },
};

// Helper function to determine if a business type requires CIN
const requiresCIN = (businessType: string): boolean => {
  // Convert frontend type to backend format and check
  const backendType = toBackendBusinessType(businessType);
  return checkRequiresCIN(backendType);
};

// Helper function to determine if a business type requires deed upload
const requiresDeedUpload = (businessType: string): boolean => {
  // Convert frontend type to backend format and check
  const backendType = toBackendBusinessType(businessType);
  return checkRequiresDeedUpload(backendType);
};

const steps = ["Basic Info", "Business Details", "Documents", "Review"];

const BusinessOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BusinessFormData>(initialFormData);
  const [businessId, setBusinessId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingStatus, setIsFetchingStatus] = useState(true);

  const progress = (currentStep / steps.length) * 100;

  // Fetch business onboarding status on mount - ProtectedRoute handles access control
  useEffect(() => {
    const fetchOnboardingStatus = async () => {
      try {
        const statusResponse = await businessAPI.getOnboardingStatus();
        const { bid, name, gstin, kybStatus, kybInitiated, businessType, cid } = statusResponse.data;

        // If KYB is not in "not_started" state, pre-fill the form
        if (kybStatus !== "kyc_not_started" && kybInitiated) {
          setBusinessId(bid || "");
          if (bid) {
            localStorage.setItem('business-id', bid);
          }

          // Auto-fill Step 1: Basic Info
          setFormData((prev) => ({
            ...prev,
            name: name || "",
            gstin: gstin || "",
            // Auto-fill Step 2: Business Type (if backend sends it - convert to frontend format)
            type: businessType ? toFrontendBusinessType(businessType) : prev.type,
            // Auto-fill CIN if available
            documents: {
              ...prev.documents,
              cin: cid || prev.documents.cin,
            },
          }));

          console.log("Pre-filled business data from status:", { bid, name, gstin, kybStatus, businessType, cid });
        }
      } catch (error: any) {
        // If status endpoint returns 404 or error, start fresh (no pre-fill)
        console.log("No existing business onboarding found, starting fresh");
      } finally {
        setIsFetchingStatus(false);
      }
    };

    fetchOnboardingStatus();
  }, []);

  const canProceedFromStep3 = (): boolean => {
    if (requiresCIN(formData.type)) {
      // For corporate entities, CIN is required (21 characters)
      return formData.documents.cin !== undefined && formData.documents.cin.length === 21;
    } else if (requiresDeedUpload(formData.type)) {
      // For partnerships, trusts, etc., Business Deed is required
      return formData.documents.deed !== null;
    }
    // For other business types (like Sole Proprietorship), no document required
    return true;
  };

  const handleNext = () => {
    // Step 3: Check documents validation
    if (currentStep === 3 && !canProceedFromStep3()) {
      toast.error("Please complete all required fields");
      return;
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

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      let bid = businessId;

      // Step 1: Initialize business onboarding (only if not already initiated)
      if (!bid) {
        try {
          const initResponse = await businessAPI.initOnboarding(formData.name, formData.gstin);
          bid = initResponse.data.bid;

          // Store bid in state and localStorage
          setBusinessId(bid);
          localStorage.setItem('business-id', bid);
        } catch (initError: any) {
          // Handle 409 Conflict: Business already exists
          if (initError.status === 409) {
            console.log("Business already exists, fetching existing business status...");
            toast.info("Resuming existing business onboarding...");

            try {
              // Fetch the existing business status
              const statusResponse = await businessAPI.getOnboardingStatus();
              const existingBusiness = statusResponse.data;

              // Extract bid and pre-fill form data
              bid = existingBusiness.bid || "";

              if (bid) {
                setBusinessId(bid);
                localStorage.setItem('business-id', bid);

                // Pre-fill form with existing data
                setFormData((prev) => ({
                  ...prev,
                  name: existingBusiness.name || prev.name,
                  gstin: existingBusiness.gstin || prev.gstin,
                  type: existingBusiness.businessType
                    ? toFrontendBusinessType(existingBusiness.businessType)
                    : prev.type,
                  documents: {
                    ...prev.documents,
                    cin: existingBusiness.cid || prev.documents.cin,
                  },
                }));

                console.log("Resumed existing business:", { bid, status: existingBusiness.kybStatus });
              } else {
                throw new Error("Could not retrieve business ID from existing business");
              }
            } catch (statusError) {
              console.error("Failed to fetch existing business status:", statusError);
              throw new Error("Business already exists but could not retrieve details. Please contact support.");
            }
          } else {
            // Other init errors - rethrow
            throw initError;
          }
        }
      } else {
        console.log("Using existing business ID:", bid);
      }

      // Step 2: Handle document upload if deed is required
      if (requiresDeedUpload(formData.type) && formData.documents.deed) {
        console.log("Uploading business deed for", formData.type);

        // Get presigned URL
        const uploadUrlResponse = await businessAPI.getUploadUrl(bid);
        const uploadUrl = uploadUrlResponse.data.url;
        console.log("Got presigned URL:", uploadUrl);

        // Upload file to S3
        await businessAPI.uploadToS3(uploadUrl, formData.documents.deed);
        console.log("File uploaded to S3 successfully");

        // Confirm upload
        await businessAPI.confirmUpload(bid);
        console.log("Upload confirmed");
      }

      // If deed is required, verify it has been uploaded before proceeding
      if (requiresDeedUpload(formData.type)) {
        const status = await businessAPI.getOnboardingStatus();
        if (status.data.requiresDeedUpload && !status.data.hasDeedUploaded) {
          toast.error("A business deed is required. Please upload the document before submitting.");
          setIsLoading(false);
          return; // Stop execution
        }
      }

      // Step 3: Complete business onboarding
      // Convert frontend business type to backend format
      const backendBusinessType = toBackendBusinessType(formData.type);
      const completeResponse = await businessAPI.completeOnboarding(
        bid,
        backendBusinessType,
        undefined, // PAN removed - backend derives from GSTIN
        requiresCIN(formData.type) ? formData.documents.cin : undefined,
        formData.model, // Business model
        formData.turnover // Business turnover
      );

      console.log("Business onboarding complete response:", completeResponse);
      toast.success("Business onboarding completed successfully!");

      // Step 4: Check business onboarding status
      console.log("Checking business onboarding status...");
      const businessStatus = await businessAPI.getOnboardingStatus();
      const kybStatus = businessStatus.data.kybStatus;
      console.log("Business onboarding status:", kybStatus);

      // Step 5: If KYB completed/verified, refresh roles
      if (kybStatus === "kyc_completed" || kybStatus === "kyc_verified") {
        console.log("KYB completed, refreshing user roles...");

        try {
          const rolesResponse = await userAPI.getRoles();
          const roles = rolesResponse.data;
          console.log("User roles after KYB complete:", roles);

          // If user now has roles, navigate based on kycNeeded
          if (roles.length > 0) {
            const primaryRole = roles[0];

            if (primaryRole.kycNeeded) {
              console.log("KYC needed, navigating to user onboarding");
              navigate("/onboarding", { replace: true });
            } else {
              // This shouldn't normally happen (KYC should be needed after KYB)
              console.log("KYC not needed, this is unusual but proceeding to onboarding");
              navigate("/onboarding", { replace: true });
            }
          } else {
            // No roles yet, proceed to user onboarding
            console.log("No roles assigned yet, navigating to user onboarding");
            navigate("/onboarding", { replace: true });
          }
        } catch (error) {
          // If roles fetch fails, still proceed to user onboarding
          console.error("Failed to fetch roles after KYB, proceeding to user onboarding:", error);
          navigate("/onboarding", { replace: true });
        }
      } else {
        // KYB not completed yet, navigate to user onboarding anyway
        navigate("/onboarding", { replace: true });
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to complete business onboarding. Please try again.";
      toast.error(errorMessage);
      console.error("Business onboarding error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateNestedFormData = (parent: string, field: string, value: any) => {
    setFormData((prev) => {
      // Using type assertion to avoid spread type error
      const parentObj = prev[parent as keyof typeof prev];

      if (typeof parentObj === "object" && parentObj !== null) {
        return {
          ...prev,
          [parent]: {
            ...parentObj,
            [field]: value,
          },
        };
      }
      return prev;
    });
  };

  // Show loading state while fetching status
  if (isFetchingStatus) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 md:px-0">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading business information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 md:px-0">
      <div className="flex items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building className="h-6 w-6" />
            Add New Business
          </h1>
          <p className="text-muted-foreground mt-1">Complete the following steps to add a new business</p>
        </div>
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

          {currentStep === 1 && <BusinessBasicInfoForm formData={formData} updateFormData={updateFormData} />}

          {currentStep === 2 && <BusinessTypeForm formData={formData} updateFormData={updateFormData} />}

          {currentStep === 3 && (
            <BusinessDocumentsForm
              formData={{
                type: formData.type,
                documents: formData.documents,
              }}
              updateNestedFormData={updateNestedFormData}
            />
          )}

          {currentStep === 4 && <BusinessReviewForm formData={formData} />}

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
        </div>
      </div>
    </div>
  );
};

export default BusinessOnboarding;

// Helper function for conditional classes
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
