import { useState } from "react";
import PaymentMethodAndReviewStep from "../../shared/PaymentMethodAndReviewStep";
import { PaymentRow } from "./types";

interface BatchPaymentMethodAndReviewStepProps {
  paymentRows: PaymentRow[]; // Already filtered list from created vouchers
  setStep: (step: number) => void;
  onSubmit: () => void;
  selectedPaymentMethod?: string;
  onPaymentMethodChange?: (methodId: string) => void;
}

const BatchPaymentMethodAndReviewStep = ({
  paymentRows,
  setStep,
  onSubmit,
  selectedPaymentMethod: externalSelectedPaymentMethod,
  onPaymentMethodChange: externalOnPaymentMethodChange
}: BatchPaymentMethodAndReviewStepProps) => {
  const [internalSelectedPaymentMethod, setInternalSelectedPaymentMethod] = useState<string>("");

  // Use external state if provided, otherwise use internal
  const selectedPaymentMethod = externalSelectedPaymentMethod ?? internalSelectedPaymentMethod;
  const onPaymentMethodChange = externalOnPaymentMethodChange ?? setInternalSelectedPaymentMethod;

  // paymentRows is already filtered - contains only created vouchers
  const totalAmount = paymentRows.reduce((sum, row) => sum + row.amount, 0);

  const paymentItems = paymentRows.map(row => ({
    id: row.id,
    name: row.payee,
    amount: row.amount,
    description: row.description
  }));

  // Extract voucher IDs from payment rows
  const voucherIds = paymentRows.map(row => row.id);

  return (
    <PaymentMethodAndReviewStep
      totalAmount={totalAmount}
      paymentItems={paymentItems}
      summaryType="list"
      selectedPaymentMethod={selectedPaymentMethod}
      onPaymentMethodChange={onPaymentMethodChange}
      onBack={() => setStep(2)}
      onSubmit={onSubmit}
      voucherIds={voucherIds}
      paymentContext="batch_payment"
      additionalSummaryData={{
        itemLabel: "Number of Vouchers",
        listTitle: `Payment Vouchers (${paymentRows.length})`
      }}
    />
  );
};

export default BatchPaymentMethodAndReviewStep;