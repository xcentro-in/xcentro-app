
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Employee } from "./types";
import { TransactionSummary } from "../common/TransactionSummary";
import { useMemo } from "react";
import { PaymentMethod } from "@/types/payment-method";
import { mockPaymentMethods } from "@/data/mockPaymentMethods";
import { PaymentScheduleType } from "../common/PaymentScheduleSelector";
import { formatCurrency } from "@/utils/formatters";

interface PayrollReviewStepProps {
  selectedEmployees: Employee[];
  selectedPaymentMethod?: string;
  paymentType: "now" | "later" | "recurring";
  scheduledDate?: Date;
  frequency: string;
  onBack: () => void;
  onSubmit: () => void;
}

const PayrollReviewStep = ({
  selectedEmployees,
  selectedPaymentMethod,
  paymentType,
  scheduledDate,
  frequency,
  onBack,
  onSubmit
}: PayrollReviewStepProps) => {
  // Calculate totals
  const totalSalary = useMemo(() => 
    selectedEmployees.reduce(
      (sum, employee) => sum + employee.salaryAmount,
      0
    ), [selectedEmployees]
  );
  
  const platformFee = useMemo(() => totalSalary * 0.015, [totalSalary]);
  const processingFee = useMemo(() => totalSalary * 0.005, [totalSalary]);
  const totalAmount = useMemo(() => 
    totalSalary + platformFee + processingFee, 
    [totalSalary, platformFee, processingFee]
  );
  const rewardPoints = useMemo(() => Math.floor(totalSalary / 10), [totalSalary]);

  const paymentMethod = useMemo(
    () => mockPaymentMethods.find(m => m.id === selectedPaymentMethod) as PaymentMethod | undefined,
    [selectedPaymentMethod]
  );

  return (
    <TransactionSummary
      paymentType={paymentType as PaymentScheduleType}
      scheduledDate={scheduledDate}
      amount={totalSalary}
      description="Payroll Payment"
      invoiceReference={`PR-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`}
      payee={{
        id: "payroll-payment",
        name: `Employees (${selectedEmployees.length})`,
        email: "",
        contactNumber: "",
        type: "payroll",
        bankName: "Multiple Banks",
        accountNumber: "Multiple Accounts",
        ifscCode: "",
        createdAt: new Date().toISOString(),
        isDefault: false,
        salaryAmount: totalSalary,
        salaryType: "fixed",
        payrollCycle: "monthly"
      }}
      paymentMethod={paymentMethod}
      platformFee={platformFee}
      gatewayFee={processingFee}
      totalAmount={totalAmount}
      rewardPoints={rewardPoints}
      employees={selectedEmployees.map(employee => ({
        name: employee.name,
        email: employee.email,
        accountNumber: employee.accountNumber,
        bankName: employee.bankName || "Bank",
        salaryAmount: employee.salaryAmount
      }))}
      onBack={onBack}
    />
  );
};

export default PayrollReviewStep;
