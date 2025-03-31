
import { useMemo } from "react";
import { TransactionSummary } from "../common/TransactionSummary";
import { PaymentRow } from "./types";
import { PaymentMethod } from "@/types/payment-method";
import { mockPaymentMethods } from "@/data/mockPaymentMethods";

interface ReviewStepProps {
  selectedRows: string[];
  selectedPaymentMethodId?: string;
  paymentRows: PaymentRow[];
  onBack: () => void;
}

const ReviewStep = ({ 
  selectedRows, 
  selectedPaymentMethodId,
  paymentRows,
  onBack 
}: ReviewStepProps) => {
  // Calculate amounts
  const totalSelectedAmount = useMemo(() => {
    return paymentRows
      .filter(row => selectedRows.includes(row.id))
      .reduce((sum, row) => sum + row.amount, 0);
  }, [selectedRows, paymentRows]);
  
  const platformFee = useMemo(() => totalSelectedAmount * 0.01, [totalSelectedAmount]);
  const gatewayFee = useMemo(() => totalSelectedAmount * 0.005, [totalSelectedAmount]);
  const totalPayable = useMemo(
    () => totalSelectedAmount + platformFee + gatewayFee, 
    [totalSelectedAmount, platformFee, gatewayFee]
  );
  const rewardPoints = useMemo(() => Math.floor(totalSelectedAmount / 10), [totalSelectedAmount]);

  const selectedPaymentDetails = useMemo(() => {
    return paymentRows.filter(row => selectedRows.includes(row.id));
  }, [selectedRows, paymentRows]);

  const paymentMethod = useMemo(
    () => mockPaymentMethods.find(m => m.id === selectedPaymentMethodId) as PaymentMethod | undefined,
    [selectedPaymentMethodId]
  );

  return (
    <TransactionSummary
      paymentType="now"
      amount={totalSelectedAmount}
      description="Batch Payment"
      invoiceReference={`BP-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`}
      payee={{
        id: "batch-payment",
        name: `Multiple Payees (${selectedRows.length})`,
        email: "",
        contactNumber: "",
        type: "payroll",
        bankName: "Multiple Banks",
        accountNumber: "Multiple Accounts",
        ifscCode: "",
        createdAt: new Date().toISOString(),
        isDefault: false,
        salaryAmount: totalSelectedAmount,
        salaryType: "fixed",
        payrollCycle: "monthly"
      }}
      paymentMethod={paymentMethod}
      platformFee={platformFee}
      gatewayFee={gatewayFee}
      totalAmount={totalPayable}
      rewardPoints={rewardPoints}
      employees={selectedPaymentDetails.map(row => ({
        name: row.payee,
        email: "",
        accountNumber: row.bankAccount,
        bankName: `Bank (IFSC: ${row.ifsc})`,
        salaryAmount: row.amount
      }))}
      onBack={onBack}
    />
  );
};

export default ReviewStep;
