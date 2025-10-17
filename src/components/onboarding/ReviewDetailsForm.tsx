
import { Card, CardContent } from "@/components/ui/card";
import { Check, AlertCircle, User, Shield, FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ReviewDetailsFormProps {
  formData: {
    kyc: {
      name: string;
      aadharNumber: string;
      panNumber: string;
      dateOfBirth: string;
    };
    role: {
      role: string;
    };
  };
}

const getRoleLabel = (role: string): string => {
  const labels: Record<string, string> = {
    owner: 'Business Owner',
    admin: 'Admin',
    finance_manager: 'Approver',
    accountant: 'Auditor'
  };
  return labels[role] || 'Not selected';
};

const getRoleDescription = (role: string): string => {
  const descriptions: Record<string, string> = {
    owner: 'Full super admin rights',
    admin: 'Rights to make changes',
    finance_manager: 'Approve expense payables',
    accountant: 'View-only access'
  };
  return descriptions[role] || '';
};

const ReviewDetailsForm = ({ formData }: ReviewDetailsFormProps) => {
  // Role is no longer required in the check since it's hardcoded to "owner"
  const isComplete = formData.kyc.name &&
                    formData.kyc.aadharNumber &&
                    formData.kyc.panNumber &&
                    formData.kyc.dateOfBirth;

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
              <h3 className="text-lg font-medium">{formData.kyc.name || "Name not provided"}</h3>
            </div>
          </div>

          <Separator />

          {/* Role Selection Display - COMMENTED OUT (role is now hardcoded to "owner") */}
          {/* <div>
            <h4 className="text-sm font-medium mb-3">Selected Role</h4>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{getRoleLabel(formData.role.role)}</p>
                <p className="text-xs text-muted-foreground">
                  {getRoleDescription(formData.role.role)}
                </p>
              </div>
              {formData.role.role ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-600" />
              )}
            </div>
          </div>

          <Separator /> */}

          <div>
            <h4 className="text-sm font-medium mb-3">KYC Information</h4>
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
                  <p className="text-sm font-medium">PAN Number</p>
                  <p className="text-xs text-muted-foreground">
                    {formData.kyc.panNumber || "Not provided"}
                  </p>
                </div>
                {formData.kyc.panNumber ? (
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
                  <p className="text-sm font-medium">Date of Birth</p>
                  <p className="text-xs text-muted-foreground">
                    {formData.kyc.dateOfBirth || "Not provided"}
                  </p>
                </div>
                {formData.kyc.dateOfBirth ? (
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
          After submission, your Aadhaar will be e-verified through UIDAI APIs 
          and your PAN will be validated. This typically completes within minutes. 
          You'll receive a confirmation once verification is complete.
        </p>
      </div>
    </div>
  );
};

export default ReviewDetailsForm;
