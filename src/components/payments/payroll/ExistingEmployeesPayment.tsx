
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Employee {
  id: string;
  name: string;
  email: string;
  accountNumber: string;
  bankName: string;
  salaryAmount: number;
  contactNumber: string;
}

interface ExistingEmployeesPaymentProps {
  employees: Employee[];
  onSubmit: (selectedEmployees: Employee[]) => void;
}

const ExistingEmployeesPayment = ({ employees, onSubmit }: ExistingEmployeesPaymentProps) => {
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectAll, setSelectAll] = useState(false);

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.bankName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleSelectAll = () => {
    if (selectAll) {
      setSelectedEmployees([]);
      setSelectAll(false);
    } else {
      setSelectedEmployees(filteredEmployees.map(emp => emp.id));
      setSelectAll(true);
    }
  };

  const handleToggleEmployee = (id: string) => {
    if (selectedEmployees.includes(id)) {
      setSelectedEmployees(selectedEmployees.filter(empId => empId !== id));
      setSelectAll(false);
    } else {
      setSelectedEmployees([...selectedEmployees, id]);
      if (selectedEmployees.length + 1 === filteredEmployees.length) {
        setSelectAll(true);
      }
    }
  };

  const handleSubmit = () => {
    const employeesToPay = employees.filter(emp => selectedEmployees.includes(emp.id));
    onSubmit(employeesToPay);
  };

  // Calculate total salary amount of selected employees
  const totalSelectedSalary = employees
    .filter(emp => selectedEmployees.includes(emp.id))
    .reduce((total, emp) => total + emp.salaryAmount, 0);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <Label htmlFor="search">Search Employees</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by name, email, or bank..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectAll && filteredEmployees.length > 0}
                  onCheckedChange={handleToggleSelectAll}
                  aria-label="Select all employees"
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Contact Number</TableHead>
              <TableHead>Bank Account</TableHead>
              <TableHead>Bank Name</TableHead>
              <TableHead className="text-right">Salary Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedEmployees.includes(employee.id)}
                      onCheckedChange={() => handleToggleEmployee(employee.id)}
                      aria-label={`Select ${employee.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.contactNumber}</TableCell>
                  <TableCell>
                    {employee.accountNumber.slice(0, -4).replace(/./g, '•') + employee.accountNumber.slice(-4)}
                  </TableCell>
                  <TableCell>{employee.bankName}</TableCell>
                  <TableCell className="text-right">₹{employee.salaryAmount.toLocaleString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                  No employees found matching your search criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          {selectedEmployees.length > 0 ? (
            <>Selected {selectedEmployees.length} out of {filteredEmployees.length} employees</>
          ) : (
            <>Select employees to proceed</>
          )}
        </div>
        <div className="flex items-center gap-4">
          {selectedEmployees.length > 0 && (
            <div className="text-sm font-medium">
              Total: <span className="text-primary">₹{totalSelectedSalary.toLocaleString()}</span>
            </div>
          )}
          <Button 
            onClick={handleSubmit} 
            disabled={selectedEmployees.length === 0}
            className="w-auto"
          >
            Continue to Payment Method
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExistingEmployeesPayment;
