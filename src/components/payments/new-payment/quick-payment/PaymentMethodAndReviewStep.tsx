import { useState } from "react";
import PaymentMethodAndReviewStep from "../../shared/PaymentMethodAndReviewStep";
import { Payee } from "@/types/payee";
import { PaymentType } from "@/types/payments";
import { formatCompactDate } from "@/utils/dateFormatting";

interface QuickPaymentMethodAndReviewStepProps {
  paymentType: PaymentType;
  scheduledDate?: Date;
  amount: number;
  description: string;
  invoiceReference: string;
  frequency: string;
  payee: Payee;
  voucherId?: string;
  onBack: () => void;
  onSubmit: () => void;
}

const QuickPaymentMethodAndReviewStep = ({
  paymentType,
  scheduledDate,
  amount,
  description,
  invoiceReference,
  frequency,
  payee,
  voucherId,
  onBack,
  onSubmit
}: QuickPaymentMethodAndReviewStepProps) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");

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
      scheduleText={formatScheduleText()}
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