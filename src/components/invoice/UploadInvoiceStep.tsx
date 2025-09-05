
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, FilePlus } from "lucide-react";
import { OCRProgress, InvoiceDetails } from "@/types/invoice";
import { toast } from "sonner";

interface UploadInvoiceStepProps {
  onUploadComplete: (file: File, details: InvoiceDetails) => void;
  ocrProgress: OCRProgress;
  setOcrProgress: React.Dispatch<React.SetStateAction<OCRProgress>>;
}

const UploadInvoiceStep = ({ 
  onUploadComplete, 
  ocrProgress, 
  setOcrProgress 
}: UploadInvoiceStepProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Check if file is PDF or image
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        setSelectedFile(file);
      } else {
        toast.error("Please upload a PDF or image file");
      }
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    // Set OCR progress to processing
    setOcrProgress({ status: 'processing', message: 'Extracting invoice details...', progress: 10 });
    
    // Simulate OCR processing with progress updates
    setTimeout(() => setOcrProgress(prev => ({ ...prev, progress: 30 })), 1000);
    setTimeout(() => setOcrProgress(prev => ({ ...prev, progress: 60 })), 2000);
    setTimeout(() => setOcrProgress(prev => ({ ...prev, progress: 90 })), 3000);
    
    // Simulate a completed OCR process after 4 seconds
    setTimeout(() => {
      setOcrProgress({ status: 'complete', message: 'Invoice details extracted successfully', progress: 100 });
      
      // Mock data that would normally come from OCR
      const mockExtractedDetails: InvoiceDetails = {
        invoiceNumber: "INV-2023-10512",
        vendorName: "TechSupplies Inc.",
        invoiceDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        totalAmount: 4850.75,
        gstDetails: {
          cgst: 437.18,
          sgst: 437.18,
          total: 874.36
        },
        paymentInstructions: {
          bankAccount: "XXXXXXXX7890",
          ifscCode: "HDFC0001234",
          accountHolderName: "TechSupplies Inc."
        },
        items: [
          {
            description: "Office Supplies",
            quantity: 10,
            rate: 250,
            unitPrice: 250,
            amount: 2500,
            tax: 450
          },
          {
            description: "Software License",
            quantity: 1,
            rate: 1500,
            unitPrice: 1500,
            amount: 1500,
            tax: 270
          }
        ]
      };
      
      // Complete the upload process
      onUploadComplete(selectedFile, mockExtractedDetails);
      
    }, 4000);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        setSelectedFile(file);
      } else {
        toast.error("Please upload a PDF or image file");
      }
    }
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Upload Invoice</h2>
        <p className="text-muted-foreground">
          Upload your invoice to automatically extract payment details
        </p>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,image/*"
        className="hidden"
      />
      
      <div 
        className={`border-2 border-dashed rounded-lg p-12 text-center ${
          ocrProgress.status === 'processing' ? 'bg-muted/50' : ''
        }`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {ocrProgress.status === 'processing' ? (
          <div className="space-y-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <div>
              <p className="font-medium text-lg">{ocrProgress.message}</p>
              <div className="w-64 mx-auto mt-4 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300 ease-in-out" 
                  style={{ width: `${ocrProgress.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ) : selectedFile ? (
          <div className="space-y-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
              <FileText className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-lg">File selected</p>
              <p className="text-muted-foreground">{selectedFile.name}</p>
            </div>
            <Button onClick={handleUpload} className="mt-4">
              Process Invoice
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-lg">Drag and drop your invoice here</p>
              <p className="text-muted-foreground">
                Supports PDF and image files
              </p>
            </div>
            <div className="flex justify-center mt-6">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <FilePlus className="h-4 w-4" />
                Browse Files
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadInvoiceStep;
