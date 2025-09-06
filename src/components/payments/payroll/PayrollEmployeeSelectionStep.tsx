import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ExistingEmployeesPayment from "./ExistingEmployeesPayment";
import PaymentScheduleSelector, { PaymentScheduleType } from "../common/PaymentScheduleSelector";
import { Employee } from "./types";

interface PayrollEmployeeSelectionStepProps {
  employees: Employee[];
  selectedEmployees: Employee[];
  paymentType: PaymentScheduleType;
  scheduledDate?: Date;
  frequency: string;
  onEmployeesSelect: (employees: Employee[]) => void;
  onPaymentTypeChange: (value: PaymentScheduleType) => void;
  onScheduledDateChange: (date?: Date) => void;
  onFrequencyChange: (value: string) => void;
  onNext: () => void;
}

const PayrollEmployeeSelectionStep = ({
  employees,
  selectedEmployees,
  paymentType,
  scheduledDate,
  frequency,
  onEmployeesSelect,
  onPaymentTypeChange,
  onScheduledDateChange,
  onFrequencyChange,
  onNext,
}: PayrollEmployeeSelectionStepProps) => {
  const [localSelectedEmployees, setLocalSelectedEmployees] = useState<Employee[]>(selectedEmployees);

  const handleEmployeeSelectionSubmit = (employees: Employee[]) => {
    setLocalSelectedEmployees(employees);
    onEmployeesSelect(employees);
  };

  // Auto-trigger when local selection changes
  const handleEmployeeToggle = (employees: Employee[]) => {
    setLocalSelectedEmployees(employees);
    onEmployeesSelect(employees);
  };

  const handleNext = () => {
    if (localSelectedEmployees.length > 0) {
      onNext();
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
        <Card>
          <CardHeader>
            <CardTitle>When to schedule this payment?</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentScheduleSelector
              paymentType={paymentType}
              scheduledDate={scheduledDate}
              frequency={frequency}
              onPaymentTypeChange={onPaymentTypeChange}
              onScheduledDateChange={onScheduledDateChange}
              onFrequencyChange={onFrequencyChange}
            />
          </CardContent>
        </Card>
      )}

      {localSelectedEmployees.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={handleNext}>
            Continue to Payment Method
          </Button>
        </div>
      )}
    </div>
  );
};

export default PayrollEmployeeSelectionStep;