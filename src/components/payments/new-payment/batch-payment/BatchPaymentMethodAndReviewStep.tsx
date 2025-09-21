import { useMemo, useState } from "react";
import PaymentMethodAndReviewStep from "../../shared/PaymentMethodAndReviewStep";
import { PaymentRow } from "./types";
import { PaymentScheduleType } from "../shared/common/PaymentScheduleSelector";

interface BatchPaymentMethodAndReviewStepProps {
  selectedRows: string[];
  paymentRows: PaymentRow[];
  onBack: () => void;
  onSubmit: () => void;
  paymentType: PaymentScheduleType;
  scheduledDate?: Date;
  frequency: string;
}

const BatchPaymentMethodAndReviewStep = ({
  selectedRows,
  paymentRows,
  onBack,
  onSubmit,
  paymentType,
  scheduledDate,
  frequency
}: BatchPaymentMethodAndReviewStepProps) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");

  const selectedPaymentRows = useMemo(
    () => paymentRows.filter(row => selectedRows.includes(row.id)),
    [paymentRows, selectedRows]
  );

  const totalAmount = useMemo(
    () => selectedPaymentRows.reduce((sum, row) => sum + row.amount, 0),
    [selectedPaymentRows]
  );

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

  const paymentItems = selectedPaymentRows.map(row => ({
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
      onPaymentMethodChange={setSelectedPaymentMethod}
      onBack={onBack}
      onSubmit={onSubmit}
      additionalSummaryData={{
        itemLabel: "Number of Transactions",
        listTitle: `Payment Transactions (${selectedPaymentRows.length})`
      }}
    />
  );
};

export default BatchPaymentMethodAndReviewStep;