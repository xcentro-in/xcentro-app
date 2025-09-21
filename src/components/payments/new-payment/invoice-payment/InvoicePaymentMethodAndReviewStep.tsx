import PaymentMethodAndReviewStep from "../../shared/PaymentMethodAndReviewStep";
import { Invoice } from "@/data/mockInvoices";
import { PaymentScheduleType } from "../shared/common/PaymentScheduleSelector";

interface InvoicePaymentMethodAndReviewStepProps {
  selectedInvoices: Invoice[];
  selectedPaymentMethod?: string;
  paymentType: PaymentScheduleType;
  scheduledDate?: Date;
  frequency: string;
  onPaymentMethodChange: (methodId: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

const InvoicePaymentMethodAndReviewStep = ({
  selectedInvoices,
  selectedPaymentMethod,
  paymentType,
  scheduledDate,
  frequency,
  onPaymentMethodChange,
  onBack,
  onSubmit,
}: InvoicePaymentMethodAndReviewStepProps) => {
  const totalAmount = selectedInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);

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

  const paymentItems = selectedInvoices.map(invoice => ({
    id: invoice.id,
    name: invoice.vendorName,
    amount: invoice.amount,
    description: `Invoice #${invoice.invoiceNumber} • Due: ${invoice.dueDate}`
  }));

  return (
    <PaymentMethodAndReviewStep
      totalAmount={totalAmount}
      paymentItems={paymentItems}
      summaryType="list"
      scheduleText={formatScheduleText()}
      selectedPaymentMethod={selectedPaymentMethod}
      onPaymentMethodChange={onPaymentMethodChange}
      onBack={onBack}
      onSubmit={onSubmit}
      additionalSummaryData={{
        itemLabel: "Number of Invoices",
        amountLabel: "Invoice Amount",
        listTitle: `Selected Invoices (${selectedInvoices.length})`
      }}
    />
  );
};

export default InvoicePaymentMethodAndReviewStep;