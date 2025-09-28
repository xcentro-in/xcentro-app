import PaymentMethodAndReviewStep from "../../shared/PaymentMethodAndReviewStep";
import { Employee } from "./types";
import { PaymentScheduleType } from "../shared/common/PaymentScheduleSelector";

interface PayrollPaymentMethodAndReviewStepProps {
  selectedEmployees: Employee[];
  selectedPaymentMethod: string | undefined;
  paymentType: PaymentScheduleType;
  scheduledDate?: Date;
  frequency: string;
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
  onPaymentMethodChange,
  onBack,
  onSubmit,
}: PayrollPaymentMethodAndReviewStepProps) => {
  const totalSalary = selectedEmployees.reduce((sum, emp) => sum + emp.salaryAmount, 0);

  const formatScheduleText = () => {
    if (paymentType === "now") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return `T+1 (${tomorrow.toLocaleDateString()})`;
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
    id: employee.id,
    name: employee.name,
    amount: employee.salaryAmount
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
      additionalSummaryData={{
        itemLabel: "Employees",
        amountLabel: "Total Salary",
        listTitle: `Employees (${selectedEmployees.length})`
      }}
    />
  );
};

export default PayrollPaymentMethodAndReviewStep;