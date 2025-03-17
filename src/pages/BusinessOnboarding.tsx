
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Building, Check, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import BusinessBasicInfoForm from "@/components/business/BusinessBasicInfoForm";
import BusinessTypeForm from "@/components/business/BusinessTypeForm";
import BusinessDocumentsForm from "@/components/business/BusinessDocumentsForm";
import BusinessReviewForm from "@/components/business/BusinessReviewForm";

type BusinessFormData = {
  name: string;
  pan: string;
  type: string;
  model: string;
  turnover: string;
  documents: {
    deed?: File | null;
    gst?: File | null;
  };
};

const initialFormData: BusinessFormData = {
  name: "",
  pan: "",
  type: "",
  model: "",
  turnover: "",
  documents: {
    deed: null,
    gst: null,
  }
};

const steps = ["Basic Info", "Business Details", "Documents", "Review"];

const BusinessOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BusinessFormData>(initialFormData);
  
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
    // In a real app, you would send the data to your backend here
    toast.success("Business submitted for verification!");
    navigate("/settings?tab=businesses");
  };
  
  const handleCancel = () => {
    navigate(-1);
  };
  
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const updateNestedFormData = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof BusinessFormData],
        [field]: value
      }
    }));
  };
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 md:px-0">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="icon" onClick={handleCancel} className="mr-4">
          <ChevronLeft className="h-5 w-5" />
        </Button>
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
        
        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <div className="md:hidden flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div 
                className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-xs font-medium"
              >
                {currentStep}
              </div>
              <span className="text-sm font-medium">{steps[currentStep - 1]}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Step {currentStep} of {steps.length}
            </div>
          </div>
          
          {currentStep === 1 && (
            <BusinessBasicInfoForm 
              formData={formData} 
              updateFormData={updateFormData}
            />
          )}
          
          {currentStep === 2 && (
            <BusinessTypeForm 
              formData={formData} 
              updateFormData={updateFormData}
            />
          )}
          
          {currentStep === 3 && (
            <BusinessDocumentsForm 
              formData={formData} 
              updateNestedFormData={updateNestedFormData}
            />
          )}
          
          {currentStep === 4 && (
            <BusinessReviewForm 
              formData={formData} 
            />
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
              <Button onClick={handleSubmit}>Submit for Verification</Button>
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
  return classes.filter(Boolean).join(' ');
}
