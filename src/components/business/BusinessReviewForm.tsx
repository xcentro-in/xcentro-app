
import { Card, CardContent } from "@/components/ui/card";
import { Check, Building, FileText, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface BusinessReviewFormProps {
  formData: {
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
}

const BusinessReviewForm = ({ formData }: BusinessReviewFormProps) => {
  const isComplete = formData.name && 
                     formData.pan && 
                     formData.type && 
                     formData.model && 
                     formData.turnover && 
                     formData.documents.deed;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Review Your Information</h2>
        <p className="text-muted-foreground text-sm">
          Please review the information you've provided before submission
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
                  Some required information is missing. Please go back and complete all fields marked as required.
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
              <Building className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">{formData.name || "Business Name"}</h3>
              <p className="text-sm text-muted-foreground">{formData.pan || "PAN"}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-3">Business Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Business Type</p>
                <p className="font-medium">{formData.type || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Business Model</p>
                <p className="font-medium">{formData.model || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Annual Turnover</p>
                <p className="font-medium">{formData.turnover || "Not specified"}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-3">Uploaded Documents</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Business Deed</p>
                  <p className="text-xs text-muted-foreground">
                    {formData.documents.deed ? formData.documents.deed.name : "Not uploaded"}
                  </p>
                </div>
                {formData.documents.deed ? (
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
                  <p className="text-sm font-medium">GST Certificate (Optional)</p>
                  <p className="text-xs text-muted-foreground">
                    {formData.documents.gst ? formData.documents.gst.name : "Not uploaded"}
                  </p>
                </div>
                {formData.documents.gst ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <span className="text-xs text-muted-foreground">Optional</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg border p-4 bg-muted/30">
        <h3 className="text-sm font-medium mb-2">What happens next?</h3>
        <p className="text-sm text-muted-foreground">
          After submission, our team will review your business details. This typically takes 1-2 business days. 
          You'll receive a notification once your business is verified and ready to use.
        </p>
      </div>
    </div>
  );
};

export default BusinessReviewForm;
