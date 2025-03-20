
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Employee {
  name: string;
  email: string;
  accountNumber: string;
  bankName: string;
  salaryAmount: number;
}

interface EmployeesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: Employee[];
}

export const EmployeesDialog = ({
  open,
  onOpenChange,
  employees,
}: EmployeesDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Employee Payment Details</DialogTitle>
        </DialogHeader>
        
        <div className="border rounded-md overflow-x-auto mt-4">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-2 font-medium text-sm">Name</th>
                <th className="text-left p-2 font-medium text-sm">Email</th>
                <th className="text-left p-2 font-medium text-sm">Bank Account</th>
                <th className="text-left p-2 font-medium text-sm">Bank Name</th>
                <th className="text-right p-2 font-medium text-sm">Salary Amount</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-muted/20"}>
                  <td className="p-2 text-sm">{employee.name}</td>
                  <td className="p-2 text-sm">{employee.email}</td>
                  <td className="p-2 text-sm">
                    {employee.accountNumber.slice(0, -4).replace(/./g, '•') + employee.accountNumber.slice(-4)}
                  </td>
                  <td className="p-2 text-sm">{employee.bankName}</td>
                  <td className="p-2 text-sm text-right">₹{employee.salaryAmount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-muted-foreground">
            Total Employees: {employees.length}
          </p>
          <p className="text-sm font-medium">
            Total Amount: ₹{employees.reduce((sum, emp) => sum + emp.salaryAmount, 0).toLocaleString()}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
