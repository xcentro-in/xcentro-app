
import { mockPaymentMethods } from "@/data/mockPaymentMethods";
import { TransactionSummary } from "../common/TransactionSummary";
import { PaymentScheduleType } from "../common/PaymentScheduleSelector";

interface PayrollReviewStepProps {
  entryMethod: "manual" | "bulk" | "existing";
  selectedEmployees: any[];
  selectedPaymentMethod: string | undefined;
  paymentType: PaymentScheduleType;
  scheduledDate?: Date;
  frequency: string;
  onBack: () => void;
}

const PayrollReviewStep = ({
  entryMethod,
  selectedEmployees,
  selectedPaymentMethod,
  paymentType,
  scheduledDate,
  frequency,
  onBack,
}: PayrollReviewStepProps) => {
  const paymentMethod = mockPaymentMethods.find(m => m.id === selectedPaymentMethod);
  
  const employeesToProcess = entryMethod === "existing" 
    ? selectedEmployees 
    : entryMethod === "bulk" 
      ? selectedEmployees 
      : [];

  return (
    <TransactionSummary
      paymentType={paymentType}
      scheduledDate={scheduledDate}
      frequency={frequency}
      amount={entryMethod === "manual" 
        ? 15000 
        : employeesToProcess.reduce((sum, emp) => sum + emp.salaryAmount, 0)} 
      description="Payroll payment"
      invoiceReference="PR-2023-001"
      payee={{
        id: "payroll-1",
        name: entryMethod === "manual" 
          ? "John Doe" 
          : `Multiple Employees (${employeesToProcess.length})`,
        email: entryMethod === "manual" ? "john.doe@example.com" : "",
        contactNumber: entryMethod === "manual" ? "9876543210" : "",
        type: "payroll",
        bankName: "HDFC Bank",
        accountNumber: entryMethod === "manual" ? "1234567890" : "Multiple Accounts",
        ifscCode: "HDFC0001234",
        salaryAmount: entryMethod === "manual" ? 15000 : 0,
        salaryType: "fixed",
        payrollCycle: "monthly",
        createdAt: new Date().toISOString(),
        isDefault: false
      }}
      paymentMethod={paymentMethod}
      platformFee={150}
      gatewayFee={50}
      totalAmount={entryMethod === "manual" 
        ? 15200 
        : employeesToProcess.reduce((sum, emp) => sum + emp.salaryAmount, 0) + 200}
      rewardPoints={entryMethod === "manual" 
        ? 152 
        : Math.floor((employeesToProcess.reduce((sum, emp) => sum + emp.salaryAmount, 0) + 200) / 100)}
      employees={entryMethod === "manual" ? undefined : employeesToProcess}
      onBack={onBack}
    />
  );
};

export default PayrollReviewStep;
