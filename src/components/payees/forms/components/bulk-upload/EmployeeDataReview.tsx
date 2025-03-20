
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Loader2, Check } from "lucide-react";

interface PayrollEmployee {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  accountNumber: string;
  salaryAmount: number;
  selected: boolean;
}

interface EmployeeDataReviewProps {
  fileName: string;
  employees: PayrollEmployee[];
  allSelected: boolean;
  isProcessing: boolean;
  onToggleSelectAll: () => void;
  onToggleSelectEmployee: (id: string) => void;
  onResetUpload: () => void;
  onAddToPayroll: () => void;
}

const EmployeeDataReview = ({
  fileName,
  employees,
  allSelected,
  isProcessing,
  onToggleSelectAll,
  onToggleSelectEmployee,
  onResetUpload,
  onAddToPayroll,
}: EmployeeDataReviewProps) => {
  const anySelected = employees.some(emp => emp.selected);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg">Review Parsed Employee Data</h3>
        <p className="text-sm text-muted-foreground">
          {fileName} - {employees.length} employees found
        </p>
      </div>
      
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={allSelected} 
                  onCheckedChange={onToggleSelectAll} 
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
                    onCheckedChange={() => onToggleSelectEmployee(employee.id)} 
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
            onClick={onResetUpload}
          >
            Upload Different File
          </Button>
          <Button
            disabled={!anySelected || isProcessing}
            onClick={onAddToPayroll}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Processing...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Choose Payment Method
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDataReview;
