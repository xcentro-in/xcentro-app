
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KYCDetailsFormProps {
  formData: {
    aadharNumber: string;
    aadharFrontUrl: string;
    aadharBackUrl: string;
  };
  updateFormData: (data: Partial<KYCDetailsFormProps['formData']>) => void;
}

const KYCDetailsForm = ({ formData, updateFormData }: KYCDetailsFormProps) => {
  const handleAadharFrontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, you would upload this to your storage
      updateFormData({ aadharFrontUrl: URL.createObjectURL(e.target.files[0]) });
    }
  };

  const handleAadharBackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, you would upload this to your storage
      updateFormData({ aadharBackUrl: URL.createObjectURL(e.target.files[0]) });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">KYC Details</h2>
        <p className="text-muted-foreground text-sm">
          Please provide your Aadhar details for verification
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="aadharNumber">Aadhar Number</Label>
          <Input
            id="aadharNumber"
            value={formData.aadharNumber}
            onChange={(e) => updateFormData({ aadharNumber: e.target.value })}
            placeholder="XXXX-XXXX-XXXX"
          />
        </div>

        <div>
          <Label className="mb-2 block">Aadhar Front</Label>
          <Card className="bg-muted/40">
            <CardContent className="p-4">
              <div className="flex flex-col items-center justify-center py-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm font-medium mb-1">Upload Aadhar Front</p>
                <p className="text-xs text-muted-foreground text-center mb-3">
                  Supported formats: PDF, JPG, PNG (Max 5MB)
                </p>
                <div className="relative">
                  <Input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleAadharFrontUpload}
                  />
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Label className="mb-2 block">Aadhar Back</Label>
          <Card className="bg-muted/40">
            <CardContent className="p-4">
              <div className="flex flex-col items-center justify-center py-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm font-medium mb-1">Upload Aadhar Back</p>
                <p className="text-xs text-muted-foreground text-center mb-3">
                  Supported formats: PDF, JPG, PNG (Max 5MB)
                </p>
                <div className="relative">
                  <Input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleAadharBackUpload}
                  />
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default KYCDetailsForm;
