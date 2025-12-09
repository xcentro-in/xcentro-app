
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { payeesAPI } from "@/services/api";
import { toast } from "sonner";

interface EmployeeDocumentUploadStepProps {
  employeeData: {
    relation_id: string;
    payee_id: string;
    account_id: string;
    employee_name: string;
  };
  onUploadComplete: () => void;
}

const EmployeeDocumentUploadStep = ({ employeeData, onUploadComplete }: EmployeeDocumentUploadStepProps) => {
  const { user } = useAuth();
  const { businessId, businessName } = useCurrentBusiness();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<{
    status: 'idle' | 'getting_url' | 'uploading' | 'confirming' | 'success' | 'error';
    message: string;
  }>({ status: 'idle', message: '' });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setSelectedFile(file);
      setUploadStatus({ status: 'idle', message: '' });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !businessId) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Step 1: Get presigned S3 URL
      setUploadStatus({ status: 'getting_url', message: 'Getting upload URL...' });
      const presignedResponse = await payeesAPI.getEmployeeDocPresignedUrl(
        employeeData.relation_id,
        businessId
      );

      if (!presignedResponse.data.upload_url) {
        throw new Error('Failed to get upload URL');
      }

      setUploadProgress(20);

      // Step 2: Upload file to S3 using PUT
      setUploadStatus({ status: 'uploading', message: 'Uploading document...' });

      await payeesAPI.uploadToS3(presignedResponse.data.upload_url, selectedFile);

      setUploadProgress(70);

      // Step 3: Confirm upload with backend
      setUploadStatus({ status: 'confirming', message: 'Confirming upload...' });

      const confirmResponse = await payeesAPI.confirmEmployeeDocUpload(
        employeeData.relation_id,
        businessId
      );

      if (confirmResponse.status === 'success') {
        setUploadProgress(100);
        setUploadStatus({
          status: 'success',
          message: 'Document uploaded successfully! Employee onboarding complete.'
        });

        toast.success("Employee onboarded successfully with remuneration document");

        // Complete the flow after 2 seconds
        setTimeout(() => {
          onUploadComplete();
        }, 2000);
      } else {
        throw new Error(confirmResponse.message || 'Failed to confirm upload');
      }

    } catch (error: any) {
      console.error('Error uploading document:', error);
      setUploadStatus({
        status: 'error',
        message: error?.message || 'Failed to upload document. Please try again.'
      });
      toast.error("Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message - Employee Created */}
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <AlertDescription className="text-green-900">
          <p className="font-medium">
            Employee <span className="underline">{employeeData.employee_name}</span> created successfully in the system!
          </p>
          <p className="text-sm mt-1">
            Please upload the remuneration document to complete the onboarding process.
          </p>
        </AlertDescription>
      </Alert>

      {/* RBI Compliance Disclaimer */}
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-900">
          <p className="font-medium mb-2">RBI Compliance Requirement</p>
          <p className="text-sm">
            As per Reserve Bank of India (RBI) guidelines, we require proof of employee remuneration
            to process salary payments through our platform. Please upload an employment contract,
            offer letter, or salary slip to complete the employee onboarding process.
          </p>
        </AlertDescription>
      </Alert>

      {/* File Upload Card */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label
                htmlFor="remunerationDoc"
                className="flex items-center justify-center gap-2 px-4 h-11 border border-input rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span className="text-sm">Select Document</span>
              </label>
              <input
                id="remunerationDoc"
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
              />
              {selectedFile && (
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{selectedFile.name}</span>
                  <span className="text-muted-foreground">
                    ({(selectedFile.size / 1024).toFixed(2)} KB)
                  </span>
                </div>
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
            </p>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{uploadStatus.message}</span>
                <span className="font-medium">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Status Messages */}
          {uploadStatus.status === 'success' && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-green-900 font-medium">
                {uploadStatus.message}
              </AlertDescription>
            </Alert>
          )}

          {uploadStatus.status === 'error' && (
            <Alert variant="destructive">
              <XCircle className="h-5 w-5" />
              <AlertDescription className="font-medium">
                {uploadStatus.message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => onUploadComplete()}
          disabled={isUploading}
        >
          Skip for Now
        </Button>
        <Button
          type="button"
          onClick={handleUpload}
          disabled={!selectedFile || isUploading || uploadStatus.status === 'success'}
          className="h-11"
        >
          {isUploading ? "Uploading..." : "Upload Document"}
        </Button>
      </div>

      {/* Warning for Skip */}
      {!isUploading && uploadStatus.status !== 'success' && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertDescription className="text-amber-900">
            <p className="font-medium text-sm">
              Note: Skipping document upload will prevent salary payments to this employee until
              the remuneration document is provided.
            </p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default EmployeeDocumentUploadStep;
