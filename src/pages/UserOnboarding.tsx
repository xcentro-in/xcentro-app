
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import KYCDetailsForm from "@/components/onboarding/KYCDetailsForm";
import ContactDetailsForm from "@/components/onboarding/ContactDetailsForm";
import ProfileDetailsForm from "@/components/onboarding/ProfileDetailsForm";
import ReviewDetailsForm from "@/components/onboarding/ReviewDetailsForm";

type OnboardingFormData = {
  kyc: {
    aadharNumber: string;
    aadharFrontUrl: string;
    aadharBackUrl: string;
  };
  contact: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    email: string;
    phone: string;
  };
  profile: {
    name: string;
    kycStatus: "pending" | "verified" | "rejected";
  };
};

const initialFormData: OnboardingFormData = {
  kyc: {
    aadharNumber: "",
    aadharFrontUrl: "",
    aadharBackUrl: "",
  },
  contact: {
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    email: "",
    phone: "",
  },
  profile: {
    name: "",
    kycStatus: "pending",
  },
};

const steps = ["KYC Details", "Contact Information", "Profile Details", "Review"];

const UserOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>(initialFormData);
  
  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
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

  const handleSubmit = () => {
    // Here you would submit the data to your backend
    navigate("/dashboard");
  };

  const updateFormData = (section: keyof OnboardingFormData, data: Partial<OnboardingFormData[keyof OnboardingFormData]>) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data
      }
    }));
  };

  return (
    <div className="min-h-screen bg-background w-full">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Complete Your Profile</h1>
              <img 
                src="https://ik.imagekit.io/mddzdzy9m/PaySphere/logo_dark_name_transaparent.png?updatedAt=1745093647693&tr=w-150,h-150,c-at_max" 
                alt="PaySphere Logo" 
                className="h-20 w-auto object-contain"
              />
            </div>
            <p className="text-muted-foreground mt-1">Please complete the following steps to set up your account</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
            <div className="hidden md:block space-y-1 sticky top-20 self-start">
              <Progress
                value={progress}
                className="h-2 mb-4"
              />
              
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
                          isCompleted ? "bg-primary text-white" : 
                          isCurrent ? "bg-primary text-white" : 
                          "bg-muted text-muted-foreground"
                        )}
                      >
                        {isCompleted ? <Check className="h-3.5 w-3.5" /> : stepNumber}
                      </div>
                      <div className="flex flex-col">
                        <span 
                          className={cn(
                            "text-sm font-medium",
                            isCompleted ? "text-primary" : 
                            isCurrent ? "text-foreground" : 
                            "text-muted-foreground"
                          )}
                        >
                          {step}
                        </span>
                        {isCurrent && (
                          <span className="text-xs text-muted-foreground mt-0.5">Current step</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-card border rounded-lg p-6 shadow-sm w-full">
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
                  formData={formData.kyc}
                  updateFormData={(data) => updateFormData("kyc", data)}
                />
              )}

              {currentStep === 2 && (
                <ContactDetailsForm
                  formData={formData.contact}
                  updateFormData={(data) => updateFormData("contact", data)}
                />
              )}

              {currentStep === 3 && (
                <ProfileDetailsForm
                  formData={formData.profile}
                  updateFormData={(data) => updateFormData("profile", data)}
                />
              )}

              {currentStep === 4 && (
                <ReviewDetailsForm formData={formData} />
              )}

              <div className="flex justify-between mt-8 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>

                {currentStep < steps.length ? (
                  <Button onClick={handleNext}>Continue</Button>
                ) : (
                  <Button onClick={handleSubmit}>Complete Setup</Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOnboarding;

// Helper function for conditional classes
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
