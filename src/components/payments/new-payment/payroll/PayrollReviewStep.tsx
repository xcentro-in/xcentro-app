
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Employee, PayrollReviewStepProps } from "./types";
import { TransactionSummary } from "../shared/common/TransactionSummary";
import { useMemo } from "react";
import { PaymentMethod } from "@/types/payment-method";
import { mockPaymentMethods } from "@/data/mockPaymentMethods";
import { PaymentScheduleType } from "../shared/common/PaymentScheduleSelector";
import { formatCurrency } from "@/utils/formatters";

const PayrollReviewStep = ({
  selectedEmployees,
  selectedPaymentMethod,
  paymentType,
  scheduledDate,
  frequency,
  rewardPackage,
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
  
  // Calculate reward package costs if applicable
  const rewardCost = useMemo(() => {
    if (!rewardPackage) return 0;
    return totalSalary * (rewardPackage.percentage / 100);
  }, [totalSalary, rewardPackage]);
  
  const totalAmount = useMemo(() => 
    totalSalary + platformFee + processingFee + rewardCost, 
    [totalSalary, platformFee, processingFee, rewardCost]
  );
  
  const rewardPoints = useMemo(() => {
    const basePoints = Math.floor(totalSalary / 10);
    return rewardPackage ? basePoints * rewardPackage.multiplier : basePoints;
  }, [totalSalary, rewardPackage]);

  const paymentMethod = useMemo(
    () => mockPaymentMethods.find(m => m.id === selectedPaymentMethod) as PaymentMethod | undefined,
    [selectedPaymentMethod]
  );

  // Transform employees data structure to match expected format
  const transformedEmployees = useMemo(() => 
    selectedEmployees.map(employee => ({
      id: employee.id,
      name: employee.name,
      email: employee.email,
      accountNumber: employee.accountNumber,
      bankName: employee.bankName,
      salaryAmount: employee.salaryAmount,
      contactNumber: employee.contactNumber
    })), 
    [selectedEmployees]
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
        updatedAt: new Date().toISOString(),
        isDefault: false,
        salaryAmount: totalSalary,
        salaryType: "fixed",
        payrollCycle: "monthly"
      }}
      paymentMethod={paymentMethod}
      platformFee={platformFee}
      gatewayFee={processingFee}
      rewardPackage={rewardPackage}
      totalAmount={totalAmount}
      rewardPoints={rewardPoints}
      frequency={frequency}
      employees={transformedEmployees}
      onBack={onBack}
      onSubmit={onSubmit}
    />
  );
};

export default PayrollReviewStep;
