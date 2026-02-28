import { useState, useRef } from "react";
import { toast } from "sonner";
import { batchPaymentsAPI } from "@/services/api";
import { trackEvent } from "@/lib/analytics";

import { BatchUploadResponse } from "./types";
import { useAuth } from '@/contexts/AuthContext';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { Button } from "@/components/ui/button";

interface UploadStepProps {
  setStep: (step: number) => void;
  setUploadResponse: (response: BatchUploadResponse) => void;
}

const UploadStep = ({ setStep, setUploadResponse }: UploadStepProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { businessId, businessName } = useCurrentBusiness();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleProcessFile = async () => {
    if (!selectedFile || !businessId) return;

    setIsProcessing(true);

    try {
      const response = await batchPaymentsAPI.upload(selectedFile);
      trackEvent('batch_csv_uploaded');
      setUploadResponse(response as BatchUploadResponse);
      toast.success(`File processed: ${response.data.matched_count} matched, ${response.data.ambiguous_count} ambiguous, ${response.data.not_found_count} not found`);
      setStep(2); // Move to validation step
    } catch (error) {
      console.error("Failed to upload file:", error);
      toast.error("Failed to process file. Please check the format and try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleDownloadTemplate = async () => {
    if (!businessId) {
      toast.error("Business ID not found");
      return;
    }

    setIsDownloading(true);
    try {
      // Get presigned S3 URL from backend
      const response = await batchPaymentsAPI.downloadTemplate();

      if (response.status === "success" && response.data.download_url) {
        // Fetch the file from S3 URL as blob
        const fileResponse = await fetch(response.data.download_url);
        if (!fileResponse.ok) {
          throw new Error("Failed to fetch file from S3");
        }

        const blob = await fileResponse.blob();

        // Create blob URL and trigger download
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = response.data.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);

        // Show success message from server
        toast.success(response.message || "Template downloaded successfully!");
      } else {
        throw new Error("Download URL not received from server");
      }
    } catch (error) {
      console.error("Failed to download template:", error);
      toast.error("Failed to download template. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };
  
  return (
    <div className="space-y-4">
      <div 
        className="border-2 border-dashed rounded-lg p-6 text-center space-y-4"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        />
        
        {selectedFile ? (
          <div className="space-y-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-green-600"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div>
              <p className="font-medium text-lg">File selected</p>
              <p className="text-muted-foreground">{selectedFile.name}</p>
            </div>
            <Button 
              onClick={handleProcessFile} 
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Process Batch File"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-muted-foreground"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <div>
              <p className="font-medium text-lg">Drag and drop your file here</p>
              <p className="text-muted-foreground">
                Upload a CSV or Excel file with payment details
              </p>
            </div>
            <div className="flex gap-2 justify-center">
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
              >
                Browse Files
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleDownloadTemplate}
                disabled={isDownloading}
              >
                {isDownloading ? "Downloading..." : "Download Template"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadStep;
