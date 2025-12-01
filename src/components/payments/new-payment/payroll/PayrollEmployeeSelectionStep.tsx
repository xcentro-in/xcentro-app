import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ExistingEmployeesPayment from "./ExistingEmployeesPayment";
import { Employee } from "./types";
import { useAuth } from "@/contexts/AuthContext";
import { voucherAPI } from "@/services/api";
import { toast } from "sonner";

interface PayrollEmployeeSelectionStepProps {
  employees: Employee[];
  selectedEmployees: Employee[];
  onEmployeesSelect: (employees: Employee[]) => void;
  onVouchersCreated: (voucherIds: string[]) => void;
  onNext: () => void;
}

const PayrollEmployeeSelectionStep = ({
  employees,
  selectedEmployees,
  onEmployeesSelect,
  onVouchersCreated,
  onNext,
}: PayrollEmployeeSelectionStepProps) => {
  const { user } = useAuth();
  const [localSelectedEmployees, setLocalSelectedEmployees] = useState<Employee[]>(selectedEmployees);
  const [isCreatingVouchers, setIsCreatingVouchers] = useState(false);

  const handleEmployeeSelectionSubmit = (employees: Employee[]) => {
    setLocalSelectedEmployees(employees);
    onEmployeesSelect(employees);
  };

  // Auto-trigger when local selection changes
  const handleEmployeeToggle = (employees: Employee[]) => {
    setLocalSelectedEmployees(employees);
    onEmployeesSelect(employees);
  };

  const handleNext = async () => {
    if (localSelectedEmployees.length === 0) {
      toast.error("Please select at least one employee");
      return;
    }

    // Validate all selected employees have salary amounts
    const missingAmounts = localSelectedEmployees.filter(emp => !emp.salaryAmount || emp.salaryAmount <= 0);
    if (missingAmounts.length > 0) {
      toast.error("Please enter salary amount for all selected employees");
      return;
    }

    if (!user?.businessId) {
      toast.error("User information not available");
      return;
    }

    setIsCreatingVouchers(true);

    try {
      // Map employees to voucher creation format
      const vouchers = localSelectedEmployees.map(employee => ({
        relation_id: employee.relation_id,
        invoice_number: `PAYROLL-${Date.now()}-${employee.relation_id.slice(0, 8)}`,
        gross_amount: Math.round((employee.salaryAmount || 0) * 100), // Convert to paise
        net_amount: Math.round((employee.salaryAmount || 0) * 100),
        gst_amount: 0,
        tds_amount: 0,
        description: `Salary payment for ${employee.full_name}`,
        expense_category: "payroll",
      }));

      // Call bulk voucher creation API
      const response = await voucherAPI.createMultiple(user.businessId, vouchers);

      if (response.status === "success" && response.data.vouchers) {
        // Extract voucher IDs from response
        const voucherIds = response.data.vouchers.map((v: any) => v.voucher_id);

        toast.success(`Successfully created ${voucherIds.length} voucher(s) for payroll`);

        // Pass voucher IDs to parent
        onVouchersCreated(voucherIds);

        // Move to next step
        onNext();
      } else {
        throw new Error(response.data?.message || "Failed to create vouchers");
      }
    } catch (error) {
      console.error("Error creating vouchers:", error);
      toast.error("Failed to create vouchers", {
        description: error instanceof Error ? error.message : "Please try again"
      });
    } finally {
      setIsCreatingVouchers(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Select Employees for Payroll</h3>
        <ExistingEmployeesPayment 
          employees={employees} 
          onSubmit={handleEmployeeSelectionSubmit}
          onSelectionChange={handleEmployeeToggle}
        />
      </div>

      {localSelectedEmployees.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={handleNext} disabled={isCreatingVouchers}>
            {isCreatingVouchers ? "Creating Vouchers..." : "Continue to Payment Method"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PayrollEmployeeSelectionStep;