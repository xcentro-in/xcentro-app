
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Upload, 
  FileText, 
  Download, 
  Loader2,
  AlertCircle,
  Check
} from "lucide-react";

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
  
  const downloadTemplate = () => {
    // In a real app, this would download a CSV template
    alert("CSV template would download here");
  };
  
  const anySelected = employees.some(emp => emp.selected);
  
  return (
    <div className="space-y-6">
      {currentStep === 'upload' ? (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div 
                className="border-2 border-dashed rounded-md p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="h-7 w-7 text-primary" />
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
            </div>
            
            <div className="flex justify-end mt-6 gap-4">
              <Button variant="outline" onClick={() => onSubmit()}>
                Cancel
              </Button>
              <Button
                disabled={!file || isUploading || isProcessing}
                onClick={processFile}
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
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-lg">Review Parsed Employee Data</h3>
                <p className="text-sm text-muted-foreground">
                  {file?.name} - {employees.length} employees found
                </p>
              </div>
              
              <div className="border rounded-md overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox 
                          checked={allSelected} 
                          onCheckedChange={toggleSelectAll} 
                          aria-label="Select all"
                        />
                      </TableHead>
                      <TableHead>Employee Name</TableHead>
                      <TableHead>Email Address</TableHead>
                      <TableHead>Contact Number</TableHead>
                      <TableHead>Account Number</TableHead>
                      <TableHead className="text-right">Salary Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <Checkbox 
                            checked={employee.selected} 
                            onCheckedChange={() => toggleSelectEmployee(employee.id)} 
                            aria-label={`Select ${employee.name}`}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>{employee.contactNumber}</TableCell>
                        <TableCell>{employee.accountNumber}</TableCell>
                        <TableCell className="text-right">₹{employee.salaryAmount.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {employees.filter(e => e.selected).length} of {employees.length} employees selected
                </p>
                <div className="space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCurrentStep('upload');
                      setFile(null);
                    }}
                  >
                    Upload Different File
                  </Button>
                  <Button
                    disabled={!anySelected || isProcessing}
                    onClick={handleAddToPayroll}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Add Selected to Payroll
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BulkUploadPayrollForm;
