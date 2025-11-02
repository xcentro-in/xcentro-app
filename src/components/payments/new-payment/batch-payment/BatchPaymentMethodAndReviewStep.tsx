import { useState } from "react";
import PaymentMethodAndReviewStep from "../../shared/PaymentMethodAndReviewStep";
import { PaymentRow } from "./types";
import { PaymentScheduleType } from "../shared/common/PaymentScheduleSelector";

interface BatchPaymentMethodAndReviewStepProps {
  paymentRows: PaymentRow[]; // Already filtered list from created vouchers
  setStep: (step: number) => void;
  onSubmit: () => void;
  paymentType: PaymentScheduleType;
  scheduledDate?: Date;
  frequency: string;
  selectedPaymentMethod?: string;
  onPaymentMethodChange?: (methodId: string) => void;
}

const BatchPaymentMethodAndReviewStep = ({
  paymentRows,
  setStep,
  onSubmit,
  paymentType,
  scheduledDate,
  frequency,
  selectedPaymentMethod: externalSelectedPaymentMethod,
  onPaymentMethodChange: externalOnPaymentMethodChange
}: BatchPaymentMethodAndReviewStepProps) => {
  const [internalSelectedPaymentMethod, setInternalSelectedPaymentMethod] = useState<string>("");

  // Use external state if provided, otherwise use internal
  const selectedPaymentMethod = externalSelectedPaymentMethod ?? internalSelectedPaymentMethod;
  const onPaymentMethodChange = externalOnPaymentMethodChange ?? setInternalSelectedPaymentMethod;

  // paymentRows is already filtered - contains only created vouchers
  const totalAmount = paymentRows.reduce((sum, row) => sum + row.amount, 0);

  const formatScheduleText = () => {
    if (paymentType === "now") return "Immediate";
    if (paymentType === "later" && scheduledDate) {
      return `Scheduled for ${scheduledDate.toLocaleDateString()}`;
    }
    if (paymentType === "recurring" && scheduledDate) {
      return `Recurring ${frequency} starting ${scheduledDate.toLocaleDateString()}`;
    }
    return "Not specified";
  };

  const paymentItems = paymentRows.map(row => ({
    id: row.id,
    name: row.payee,
    amount: row.amount,
    description: row.description
  }));

  return (
    <PaymentMethodAndReviewStep
      totalAmount={totalAmount}
      paymentItems={paymentItems}
      summaryType="list"
      scheduleText={formatScheduleText()}
      selectedPaymentMethod={selectedPaymentMethod}
      onPaymentMethodChange={onPaymentMethodChange}
      onBack={() => setStep(2)}
      onSubmit={onSubmit}
      additionalSummaryData={{
        itemLabel: "Number of Vouchers",
        listTitle: `Payment Vouchers (${paymentRows.length})`
      }}
    />
  );
};

export default BatchPaymentMethodAndReviewStep;