
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download, Loader2, AlertCircle } from "lucide-react";

interface FileUploaderProps {
  file: File | null;
  setFile: (file: File | null) => void;
  isUploading: boolean;
  isProcessing: boolean;
  onProcessFile: () => void;
  onCancel: () => void;
}

const FileUploader = ({ 
  file, 
  setFile, 
  isUploading, 
  isProcessing, 
  onProcessFile, 
  onCancel 
}: FileUploaderProps) => {
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const downloadTemplate = () => {
    // In a real app, this would download a CSV template
    alert("CSV template would download here");
  };
  
  return (
    <div className="space-y-6">
      <div 
        className="border-2 border-dashed rounded-md p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
            <FileText className="h-7 w-7 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium text-lg">Upload Payroll CSV File</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Drag and drop your CSV file here, or click to browse
            </p>
          </div>
          
          <input
            type="file"
            id="file-upload"
            accept=".csv"
            className="hidden"
            onChange={handleFileUpload}
          />
          
          <Button 
            variant="outline" 
            className="h-11"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <FileText className="h-4 w-4 mr-2" />
            Browse Files
          </Button>
        </div>
      </div>
      
      {file && (
        <div className="flex items-center justify-between bg-background p-3 border rounded-md">
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium text-sm">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
          </div>
          <Button 
            size="sm" 
            disabled={isUploading || isProcessing}
            onClick={() => setFile(null)}
            variant="ghost"
          >
            Remove
          </Button>
        </div>
      )}
      
      <div className="bg-blue-50 border border-blue-100 rounded-md p-4 text-blue-700">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h4 className="font-medium">CSV Template Format</h4>
            <p className="text-sm">
              Your CSV file should contain these columns: Employee Name, Email Address, Contact Number, Bank Account Number, IFSC Code, Salary Amount
            </p>
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-white mt-2"
              onClick={downloadTemplate}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-6 gap-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          disabled={!file || isUploading || isProcessing}
          onClick={onProcessFile}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Uploading...
            </>
          ) : isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Processing...
            </>
          ) : (
            <>Process File</>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FileUploader;
