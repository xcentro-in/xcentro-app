
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface UploadBillTabProps {
  onUpload: (extractedData: any) => void;
  onUseQuickPay: () => void;
}

export default function UploadBillTab({ onUpload, onUseQuickPay }: UploadBillTabProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleUpload = () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    // Simulate OCR processing
    setTimeout(() => {
      setIsUploading(false);
      // Sample extracted data
      const extractedData = {
        cardIssuer: "HDFC Bank",
        lastFourDigits: "1234",
        dueDate: "2024-04-15",
        totalDue: "50000",
        minimumDue: "5000",
      };
      
      onUpload(extractedData);
    }, 2000);
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-sm text-muted-foreground mb-4">
          Upload your credit card statement to automatically extract payment details
        </div>
        
        <div className="border-2 border-dashed rounded-lg p-6 text-center">
          <input
            id="file-upload"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileSelect}
          />
          
          <div className="flex flex-col items-center space-y-2">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            
            {selectedFile ? (
              <>
                <p className="text-green-600 font-medium">File selected: {selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">Click upload button below to process</p>
              </>
            ) : (
              <>
                <p className="font-medium">Drag & drop your credit card bill PDF here</p>
                <p className="text-sm text-muted-foreground">
                  or <Button variant="link" className="p-0 h-auto" onClick={() => document.getElementById("file-upload")?.click()}>browse files</Button>
                </p>
              </>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-6">
          <Button 
            variant="outline" 
            onClick={onUseQuickPay}
          >
            Use Quick Pay Instead
          </Button>
          
          <Button 
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? "Processing..." : "Upload & Extract Data"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
