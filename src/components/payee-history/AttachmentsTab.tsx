import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Info, Loader2, ExternalLink, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { payeesAPI } from "@/services/api";
import { toast } from "sonner";

interface AttachmentsTabProps {
  relationId: string;
  payeeId: string;
  accountId: string;
  employeeName: string;
}

const AttachmentsTab = ({ relationId, payeeId, accountId, employeeName }: AttachmentsTabProps) => {
  const { user } = useAuth();
  const { businessId, businessName } = useCurrentBusiness();
  const [isLoading, setIsLoading] = useState(true);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [uploadedAt, setUploadedAt] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<{
    status: 'idle' | 'getting_url' | 'uploading' | 'confirming' | 'success' | 'error';
    message: string;
  }>({ status: 'idle', message: '' });

  // Fetch existing document
  useEffect(() => {
    const fetchDocument = async () => {
      if (!businessId) return;

      setIsLoading(true);
      try {
        const response = await payeesAPI.getEmployeeDocument(businessId, relationId);

        if (response.data.has_document && response.data.download_url) {
          setDocumentUrl(response.data.download_url);
          setUploadedAt(null); // API doesn't return uploaded_at
        }
      } catch (error) {
        console.error("Error fetching employee document:", error);
        // Don't show error toast for empty state
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [businessId, relationId]);

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
        relationId,
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
        relationId,
        businessId
      );

      if (confirmResponse.status === 'success') {
        setUploadProgress(100);
        setUploadStatus({
          status: 'success',
          message: 'Document uploaded successfully!'
        });

        toast.success("Remuneration document uploaded successfully");

        // Refresh document data
        const response = await payeesAPI.getEmployeeDocument(businessId, relationId);
        if (response.data.has_document && response.data.download_url) {
          setDocumentUrl(response.data.download_url);
        }

        // Reset file selection after successful upload
        setSelectedFile(null);
        setUploadStatus({ status: 'idle', message: '' });
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
      setUploadProgress(0);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading documents...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* RBI Compliance Info */}
      {!documentUrl && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertDescription className="text-amber-900">
            <p className="font-medium mb-2">Remuneration Document Required</p>
            <p className="text-sm">
              As per Reserve Bank of India (RBI) guidelines, we require proof of employee remuneration
              to process salary payments through our platform. Please upload an employment contract,
              offer letter, or salary slip to enable salary disbursements for this employee.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* RBI Guidelines Info */}
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-900">
          <p className="font-medium mb-1">About RBI Guidelines</p>
          <p className="text-sm">
            All salary payments must be backed by proper employment documentation to comply with
            regulatory requirements. Accepted documents include employment contracts, offer letters,
            or recent salary slips.
          </p>
        </AlertDescription>
      </Alert>

      {/* Existing Document Display */}
      {documentUrl && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Remuneration Document</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Employee: {employeeName}
                  </p>
                  {uploadedAt && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Uploaded: {new Date(uploadedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(documentUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Document
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Upload Card - Only show when no document exists */}
      {!documentUrl && (
        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="font-medium text-foreground mb-2">Upload Document</h3>
              <p className="text-sm text-muted-foreground">
                Upload the remuneration document to enable salary payments for this employee.
              </p>
            </div>

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
          {uploadStatus.status === 'error' && (
            <Alert variant="destructive">
              <AlertTriangle className="h-5 w-5" />
              <AlertDescription className="font-medium">
                {uploadStatus.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="w-full"
          >
            {isUploading ? "Uploading..." : "Upload Document"}
          </Button>
        </CardContent>
      </Card>
      )}
    </div>
  );
};

export default AttachmentsTab;
