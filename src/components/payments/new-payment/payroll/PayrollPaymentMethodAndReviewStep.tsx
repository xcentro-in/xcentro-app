import PaymentMethodAndReviewStep from "../../shared/PaymentMethodAndReviewStep";
import { Employee } from "./types";

interface PayrollPaymentMethodAndReviewStepProps {
  selectedEmployees: Employee[];
  voucherIds: string[];
  onBack: () => void;
  onSubmit: () => void;
}

const PayrollPaymentMethodAndReviewStep = ({
  selectedEmployees,
  voucherIds,
  onBack,
  onSubmit,
}: PayrollPaymentMethodAndReviewStepProps) => {
  const totalSalary = selectedEmployees.reduce((sum, emp) => sum + emp.salaryAmount, 0);

  const paymentItems = selectedEmployees.map(employee => ({
    id: employee.relation_id,
    name: employee.full_name,
    amount: employee.salaryAmount || 0
  }));

  return (
    <PaymentMethodAndReviewStep
      totalAmount={totalSalary}
      paymentItems={paymentItems}
      summaryType="list"
      onBack={onBack}
      onSubmit={onSubmit}
      voucherIds={voucherIds}
      paymentContext="payroll"
      additionalSummaryData={{
        itemLabel: "Employees",
        amountLabel: "Total Salary",
        listTitle: `Employees (${selectedEmployees.length})`
      }}
    />
  );
};

export default PayrollPaymentMethodAndReviewStep;