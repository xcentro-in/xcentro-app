import PaymentMethodAndReviewStep from "../../shared/PaymentMethodAndReviewStep";
import { Employee } from "./types";
import { PaymentScheduleType } from "../shared/common/PaymentScheduleSelector";
import { formatCompactDate } from "@/utils/dateFormatting";

interface PayrollPaymentMethodAndReviewStepProps {
  selectedEmployees: Employee[];
  selectedPaymentMethod: string | undefined;
  paymentType: PaymentScheduleType;
  scheduledDate?: Date;
  frequency: string;
  voucherIds: string[];
  onPaymentMethodChange: (methodId: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

const PayrollPaymentMethodAndReviewStep = ({
  selectedEmployees,
  selectedPaymentMethod,
  paymentType,
  scheduledDate,
  frequency,
  voucherIds,
  onPaymentMethodChange,
  onBack,
  onSubmit,
}: PayrollPaymentMethodAndReviewStepProps) => {
  const totalSalary = selectedEmployees.reduce((sum, emp) => sum + emp.salaryAmount, 0);

  const formatScheduleText = () => {
    if (paymentType === "now") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return formatCompactDate(tomorrow.toISOString());
    }
    if (paymentType === "later" && scheduledDate) {
      return `Scheduled for ${scheduledDate.toLocaleDateString()}`;
    }
    if (paymentType === "recurring" && scheduledDate) {
      return `Recurring ${frequency} starting ${scheduledDate.toLocaleDateString()}`;
    }
    return "Not specified";
  };

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
      scheduleText={formatScheduleText()}
      selectedPaymentMethod={selectedPaymentMethod}
      onPaymentMethodChange={onPaymentMethodChange}
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