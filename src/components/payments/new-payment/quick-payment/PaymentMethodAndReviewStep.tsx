import { useState } from "react";
import PaymentMethodAndReviewStep from "../../shared/PaymentMethodAndReviewStep";
import { Payee } from "@/types/payee";

interface QuickPaymentMethodAndReviewStepProps {
  amount: number;
  description: string;
  invoiceReference: string;
  payee: Payee;
  voucherId?: string;
  onBack: () => void;
  onSubmit: () => void;
}

const QuickPaymentMethodAndReviewStep = ({
  amount,
  description,
  invoiceReference,
  payee,
  voucherId,
  onBack,
  onSubmit
}: QuickPaymentMethodAndReviewStepProps) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");

  const paymentItems = [{
    id: payee.id,
    name: payee.name,
    amount: amount,
    description: description
  }];

  return (
    <PaymentMethodAndReviewStep
      totalAmount={amount}
      paymentItems={paymentItems}
      summaryType="simple"
      selectedPaymentMethod={selectedPaymentMethod}
      onPaymentMethodChange={setSelectedPaymentMethod}
      onBack={onBack}
      onSubmit={onSubmit}
      additionalSummaryData={{ invoiceReference }}
      voucherId={voucherId}
      paymentContext="vendor_payment"
    />
  );
};

export default QuickPaymentMethodAndReviewStep;