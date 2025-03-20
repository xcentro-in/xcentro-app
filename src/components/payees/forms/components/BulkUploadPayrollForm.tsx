
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import FileUploader from "./bulk-upload/FileUploader";
import EmployeeDataReview from "./bulk-upload/EmployeeDataReview";

interface PayrollEmployee {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  accountNumber: string;
  salaryAmount: number;
  selected: boolean;
}

interface BulkUploadPayrollFormProps {
  onSubmit: () => void;
}

const BulkUploadPayrollForm = ({ onSubmit }: BulkUploadPayrollFormProps) => {
  const [currentStep, setCurrentStep] = useState<'upload' | 'review'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [employees, setEmployees] = useState<PayrollEmployee[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  
  const processFile = () => {
    setIsUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      setIsUploading(false);
      setIsProcessing(true);
      
      // Simulate processing delay
      setTimeout(() => {
        // Mock data that would come from OCR/parsing
        const mockEmployees: PayrollEmployee[] = [
          {
            id: '1',
            name: 'John Smith',
            email: 'john.smith@example.com',
            contactNumber: '9876543210',
            accountNumber: '1234567890',
            salaryAmount: 50000,
            selected: false
          },
          {
            id: '2',
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
            contactNumber: '8765432109',
            accountNumber: '0987654321',
            salaryAmount: 60000,
            selected: false
          },
          {
            id: '3',
            name: 'Robert Johnson',
            email: 'robert.j@example.com',
            contactNumber: '7654321098',
            accountNumber: '2345678901',
            salaryAmount: 55000,
            selected: false
          }
        ];
        
        setEmployees(mockEmployees);
        setIsProcessing(false);
        setCurrentStep('review');
      }, 2000);
    }, 1000);
  };
  
  const toggleSelectAll = () => {
    const newSelected = !allSelected;
    setAllSelected(newSelected);
    setEmployees(employees.map(emp => ({...emp, selected: newSelected})));
  };
  
  const toggleSelectEmployee = (id: string) => {
    const updatedEmployees = employees.map(emp => 
      emp.id === id ? {...emp, selected: !emp.selected} : emp
    );
    setEmployees(updatedEmployees);
    setAllSelected(updatedEmployees.every(emp => emp.selected));
  };
  
  const handleAddToPayroll = () => {
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      onSubmit();
    }, 1500);
  };
  
  const resetUpload = () => {
    setCurrentStep('upload');
    setFile(null);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          {currentStep === 'upload' ? (
            <FileUploader
              file={file}
              setFile={setFile}
              isUploading={isUploading}
              isProcessing={isProcessing}
              onProcessFile={processFile}
              onCancel={onSubmit}
            />
          ) : (
            <EmployeeDataReview
              fileName={file?.name || ''}
              employees={employees}
              allSelected={allSelected}
              isProcessing={isProcessing}
              onToggleSelectAll={toggleSelectAll}
              onToggleSelectEmployee={toggleSelectEmployee}
              onResetUpload={resetUpload}
              onAddToPayroll={handleAddToPayroll}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkUploadPayrollForm;
