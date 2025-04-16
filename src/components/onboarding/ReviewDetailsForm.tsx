
import { Card, CardContent } from "@/components/ui/card";
import { Check, AlertCircle, User, MapPin, FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ReviewDetailsFormProps {
  formData: {
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
}

const ReviewDetailsForm = ({ formData }: ReviewDetailsFormProps) => {
  const isComplete = formData.kyc.aadharNumber && 
                    formData.kyc.aadharFrontUrl &&
                    formData.kyc.aadharBackUrl &&
                    formData.contact.email &&
                    formData.contact.phone &&
                    formData.profile.name;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Review Your Information</h2>
        <p className="text-muted-foreground text-sm">
          Please review your information before submission
        </p>
      </div>

      {!isComplete && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800">Missing Information</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Some required information is missing. Please go back and complete all required fields.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">{formData.profile.name || "Name not provided"}</h3>
              <p className="text-sm text-muted-foreground">{formData.contact.email || "Email not provided"}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-3">Contact Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{formData.contact.address || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">City</p>
                <p className="font-medium">{formData.contact.city || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">State</p>
                <p className="font-medium">{formData.contact.state || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{formData.contact.phone || "Not provided"}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-3">KYC Documents</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Aadhar Number</p>
                  <p className="text-xs text-muted-foreground">
                    {formData.kyc.aadharNumber || "Not provided"}
                  </p>
                </div>
                {formData.kyc.aadharNumber ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Aadhar Documents</p>
                  <p className="text-xs text-muted-foreground">
                    {(formData.kyc.aadharFrontUrl && formData.kyc.aadharBackUrl) 
                      ? "Both documents uploaded" 
                      : "Documents missing"}
                  </p>
                </div>
                {(formData.kyc.aadharFrontUrl && formData.kyc.aadharBackUrl) ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg border p-4 bg-muted/30">
        <h3 className="text-sm font-medium mb-2">What happens next?</h3>
        <p className="text-sm text-muted-foreground">
          After submission, we'll verify your information and KYC documents. 
          This typically takes 1-2 business days. You'll receive an email once your verification is complete.
        </p>
      </div>
    </div>
  );
};

export default ReviewDetailsForm;
