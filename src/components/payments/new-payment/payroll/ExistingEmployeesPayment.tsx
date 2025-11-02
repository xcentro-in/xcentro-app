
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Employee } from "./types";

interface ExistingEmployeesPaymentProps {
  employees: Employee[];
  onSubmit: (selectedEmployees: Employee[]) => void;
  onSelectionChange?: (selectedEmployees: Employee[]) => void;
}

const ExistingEmployeesPayment = ({ employees, onSubmit, onSelectionChange }: ExistingEmployeesPaymentProps) => {
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [salaryAmounts, setSalaryAmounts] = useState<Record<string, number>>({});

  const filteredEmployees = employees.filter(emp =>
    emp.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.ifsc_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSalaryChange = (relationId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setSalaryAmounts(prev => ({ ...prev, [relationId]: numValue }));
  };

  const handleToggleSelectAll = () => {
    let newSelection: string[];
    if (selectAll) {
      newSelection = [];
      setSelectAll(false);
    } else {
      newSelection = filteredEmployees.map(emp => emp.relation_id);
      setSelectAll(true);
    }
    setSelectedEmployees(newSelection);

    // Auto-trigger parent callback when selection changes
    const employeesToPay = employees
      .filter(emp => newSelection.includes(emp.relation_id))
      .map(emp => ({ ...emp, salaryAmount: salaryAmounts[emp.relation_id] || 0 }));
    onSelectionChange?.(employeesToPay);
  };

  const handleToggleEmployee = (relationId: string) => {
    let newSelection: string[];
    if (selectedEmployees.includes(relationId)) {
      newSelection = selectedEmployees.filter(empId => empId !== relationId);
      setSelectAll(false);
    } else {
      newSelection = [...selectedEmployees, relationId];
      if (selectedEmployees.length + 1 === filteredEmployees.length) {
        setSelectAll(true);
      }
    }
    setSelectedEmployees(newSelection);

    // Auto-trigger parent callback when selection changes
    const employeesToPay = employees
      .filter(emp => newSelection.includes(emp.relation_id))
      .map(emp => ({ ...emp, salaryAmount: salaryAmounts[emp.relation_id] || 0 }));
    onSelectionChange?.(employeesToPay);
  };

  const handleSubmit = () => {
    const employeesToPay = employees
      .filter(emp => selectedEmployees.includes(emp.relation_id))
      .map(emp => ({ ...emp, salaryAmount: salaryAmounts[emp.relation_id] || 0 }));
    onSubmit(employeesToPay);
  };

  // Calculate total salary amount of selected employees
  const totalSelectedSalary = selectedEmployees.reduce((total, relationId) => {
    return total + (salaryAmounts[relationId] || 0);
  }, 0);

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
              <TableHead className="text-left">Salary Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <TableRow key={employee.relation_id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedEmployees.includes(employee.relation_id)}
                      onCheckedChange={() => handleToggleEmployee(employee.relation_id)}
                      aria-label={`Select ${employee.full_name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{employee.full_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {employee.account_number_last4 ? `••••${employee.account_number_last4}` : 'No account'} • {employee.ifsc_code}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.phone}</TableCell>
                  <TableCell className="text-left">
                    <Input
                      type="number"
                      placeholder="Enter salary"
                      value={salaryAmounts[employee.relation_id] || ''}
                      onChange={(e) => handleSalaryChange(employee.relation_id, e.target.value)}
                      className="w-32"
                      min="0"
                      step="1"
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                  No employees found matching your search criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedEmployees.length > 0 && (
        <div className="p-4 bg-muted/20 rounded-md">
          <p className="text-right">
            <span className="text-sm text-muted-foreground mr-2">Total amount selected:</span>
            <span className="font-bold">₹{totalSelectedSalary.toLocaleString()}</span>
          </p>
        </div>
      )}

      <div className="text-sm text-muted-foreground mt-4">
        {selectedEmployees.length > 0 ? (
          <>Selected {selectedEmployees.length} out of {filteredEmployees.length} employees</>
        ) : (
          <>Select employees to proceed</>
        )}
      </div>
    </div>
  );
};

export default ExistingEmployeesPayment;
