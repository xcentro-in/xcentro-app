
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Check, X } from "lucide-react";
import { useState } from "react";

interface BusinessDocumentsFormProps {
  formData: {
    documents: {
      deed?: File | null;
      gst?: File | null;
    };
  };
  updateNestedFormData: (parent: string, field: string, value: any) => void;
}

const BusinessDocumentsForm = ({ formData, updateNestedFormData }: BusinessDocumentsFormProps) => {
  const [deedFileName, setDeedFileName] = useState<string | null>(
    formData.documents.deed ? formData.documents.deed.name : null
  );
  const [gstFileName, setGstFileName] = useState<string | null>(
    formData.documents.gst ? formData.documents.gst.name : null
  );

  const handleDeedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      updateNestedFormData("documents", "deed", file);
      setDeedFileName(file.name);
    }
  };

  const handleGstUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      updateNestedFormData("documents", "gst", file);
      setGstFileName(file.name);
    }
  };

  const handleRemoveDeed = () => {
    updateNestedFormData("documents", "deed", null);
    setDeedFileName(null);
  };

  const handleRemoveGst = () => {
    updateNestedFormData("documents", "gst", null);
    setGstFileName(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Business Documents</h2>
        <p className="text-muted-foreground text-sm">
          Upload the required documents for business verification
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="mb-2 block">Business Deed/Registration Document <span className="text-destructive">*</span></Label>
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
                    Supported formats: PDF, JPG, PNG (Max 5MB)
                  </p>
                  <div className="relative">
                    <Input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept=".pdf,.jpg,.jpeg,.png"
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

        <div>
          <Label className="mb-2 block">GST Certificate (Optional)</Label>
          <Card className="bg-muted/40">
            <CardContent className="p-4">
              {gstFileName ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{gstFileName}</p>
                      <p className="text-xs text-muted-foreground">Document uploaded</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleRemoveGst}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm font-medium mb-1">Upload GST Certificate</p>
                  <p className="text-xs text-muted-foreground text-center mb-3">
                    Supported formats: PDF, JPG, PNG (Max 5MB)
                  </p>
                  <div className="relative">
                    <Input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleGstUpload}
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
      </div>
    </div>
  );
};

export default BusinessDocumentsForm;
