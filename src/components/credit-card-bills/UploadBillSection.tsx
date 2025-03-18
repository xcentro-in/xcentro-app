
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileUp, AlertTriangle, Info, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadBillSectionProps {
  onUploadSuccess: () => void;
}

export default function UploadBillSection({ onUploadSuccess }: UploadBillSectionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    // Check if it's a PDF
    if (file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      alert("Please upload a PDF file.");
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    // Simulate upload and processing
    setTimeout(() => {
      setIsUploading(false);
      setSelectedFile(null);
      onUploadSuccess();
    }, 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Credit Card Bill</CardTitle>
        <CardDescription>
          Upload your credit card statement to automatically extract payment details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div 
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground/50",
            selectedFile ? "bg-green-50 border-green-200" : ""
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <input
            id="file-upload"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
          />
          
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <FileUp className="h-6 w-6 text-muted-foreground" />
            </div>
            
            {selectedFile ? (
              <>
                <p className="text-green-600 font-medium">File selected: {selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">Click upload button below to process</p>
              </>
            ) : (
              <>
                <p className="font-medium">Drag & drop your credit card bill PDF here</p>
                <p className="text-sm text-muted-foreground">or click to browse files</p>
              </>
            )}
          </div>
        </div>
        
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>How to find your credit card statement</AlertTitle>
          <AlertDescription className="mt-2 text-sm">
            <ol className="list-decimal list-inside space-y-1">
              <li>Log in to your bank's online banking or mobile app</li>
              <li>Navigate to Credit Cards section</li>
              <li>Select "View Statement" or "Download Statement"</li>
              <li>Save the PDF and upload it here</li>
            </ol>
          </AlertDescription>
        </Alert>
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-amber-700">Don't have the bill PDF?</AlertTitle>
            <AlertDescription className="text-amber-700">
              <Button 
                variant="link" 
                className="p-0 h-auto text-amber-700 font-medium"
                onClick={() => {
                  // Navigate to manual payment
                  // This would typically be handled by a router or navigation function
                  console.log("Navigate to manual payment");
                }}
              >
                Use Quick Pay instead <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </AlertDescription>
          </Alert>
          
          <Button 
            className="min-w-[120px]"
            disabled={!selectedFile || isUploading} 
            onClick={handleUpload}
          >
            {isUploading ? "Processing..." : "Upload Bill"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
