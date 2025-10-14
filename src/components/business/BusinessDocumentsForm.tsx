
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, Upload, X, Building2 } from "lucide-react";
import { useState } from "react";
import { businessTypesRequiringCIN } from "@/data/mockBusinesses";
import { toast } from "sonner";

interface BusinessDocumentsFormProps {
  formData: {
    type: string;
    documents: {
      cin?: string;
      deed?: File | null;
    };
  };
  updateNestedFormData: (parent: string, field: string, value: any) => void;
}

const BusinessDocumentsForm = ({ formData, updateNestedFormData }: BusinessDocumentsFormProps) => {
  const [deedFileName, setDeedFileName] = useState<string | null>(
    formData.documents.deed ? formData.documents.deed.name : null
  );

  const needsCIN = businessTypesRequiringCIN.includes(formData.type);

  const handleDeedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file type (only PDF)
      if (file.type !== 'application/pdf') {
        toast.error("Please upload a PDF file only");
        e.target.value = '';
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        e.target.value = '';
        return;
      }

      updateNestedFormData("documents", "deed", file);
      setDeedFileName(file.name);
    }
  };

  const handleRemoveDeed = () => {
    updateNestedFormData("documents", "deed", null);
    setDeedFileName(null);
  };

  const handleCINChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    updateNestedFormData("documents", "cin", value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Business Documents</h2>
        <p className="text-muted-foreground text-sm">
          {needsCIN 
            ? "Provide your Corporate Identification Number (CIN)"
            : "Upload the required registration document"}
        </p>
      </div>

      <div className="space-y-4">
        {needsCIN ? (
          // CIN Number Input for Corporate Entities
          <div>
            <Label htmlFor="cin" className="mb-2 block">
              Corporate Identification Number (CIN) <span className="text-destructive">*</span>
            </Label>
            <Card className="bg-muted/40">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Enter your 21-character CIN</p>
                      <p className="text-xs text-muted-foreground">
                        Format: LXXXXX[State][Year]XXX[XXX]XXXXXX
                      </p>
                    </div>
                  </div>
                  
                  <Input
                    id="cin"
                    type="text"
                    placeholder="L12345MH2020PTC123456"
                    value={formData.documents.cin || ""}
                    onChange={handleCINChange}
                    maxLength={21}
                    required
                    className="bg-background font-mono text-sm"
                  />
                  
                  <p className="text-xs text-muted-foreground">
                    Your CIN can be found on your Certificate of Incorporation
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Business Deed Upload for Other Entities
          <div>
            <Label className="mb-2 block">
              Business Deed/Registration Document <span className="text-destructive">*</span>
            </Label>
            <Card className="bg-muted/40">
              <CardContent className="p-4">
                {deedFileName ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{deedFileName}</p>
                        <p className="text-xs text-muted-foreground">Document uploaded</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleRemoveDeed}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <Upload className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-sm font-medium mb-1">Upload Business Deed</p>
                    <p className="text-xs text-muted-foreground text-center mb-3">
                      Supported format: PDF only (Max 5MB)
                    </p>
                    <div className="relative">
                      <Input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept=".pdf"
                        onChange={handleDeedUpload}
                      />
                      <Button variant="outline" size="sm">
                        Choose File
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Information Box */}
      <div className="rounded-lg border p-4 bg-muted/30">
        <h3 className="text-sm font-medium mb-2">
          {needsCIN ? "About CIN" : "Document Requirements"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {needsCIN 
            ? "The Corporate Identification Number (CIN) is a 21-character alphanumeric code assigned to companies registered in India. This helps us verify your business registration."
            : "Please upload your business registration document, partnership deed, or any official document that proves your business registration."}
        </p>
      </div>
    </div>
  );
};

export default BusinessDocumentsForm;
