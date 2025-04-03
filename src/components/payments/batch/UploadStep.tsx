
import { Import, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useRef } from "react";
import { toast } from "sonner";

interface UploadStepProps {
  onNext: () => void;
}

const UploadStep = ({ onNext }: UploadStepProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleProcessFile = () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      onNext();
    }, 1500);
  };
  
  const handleImport = () => {
    // Simulate import from Zoho Books
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      onNext();
      toast.success("Successfully imported bills from Zoho Books");
    }, 2000);
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
      <Tabs defaultValue="import" className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-6">
          <TabsTrigger value="import">Import</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
        </TabsList>
        
        <TabsContent value="import" className="space-y-4">
          <div className="flex flex-col items-center justify-center border rounded-lg p-6 text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Import className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Import From Accounting Software</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Connect to your accounting software to import bills
              </p>
            </div>
            <Button onClick={handleImport} disabled={isProcessing}>
              {isProcessing ? "Importing..." : "Import from Zoho Books"}
            </Button>
            <div className="flex items-start gap-2 text-sm text-muted-foreground mt-2 max-w-md">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p className="text-left">
                Only bills with status "Awaiting Payment" will be listed. Make sure your bills are properly categorized in Zoho Books before importing.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="upload" className="space-y-4">
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
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  Browse Files
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UploadStep;
