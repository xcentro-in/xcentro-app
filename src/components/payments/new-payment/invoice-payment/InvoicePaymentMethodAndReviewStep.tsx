import PaymentMethodAndReviewStep from "../../shared/PaymentMethodAndReviewStep";
import { Invoice } from "@/data/mockInvoices";

interface InvoicePaymentMethodAndReviewStepProps {
  selectedInvoices: Invoice[];
  selectedPaymentMethod?: string;
  onPaymentMethodChange: (methodId: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

const InvoicePaymentMethodAndReviewStep = ({
  selectedInvoices,
  selectedPaymentMethod,
  onPaymentMethodChange,
  onBack,
  onSubmit,
}: InvoicePaymentMethodAndReviewStepProps) => {
  const totalAmount = selectedInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);

  const paymentItems = selectedInvoices.map(invoice => ({
    id: invoice.id,
    name: invoice.vendorName,
    amount: invoice.amount,
    description: `Invoice #${invoice.invoiceNumber} • Due: ${invoice.dueDate}`
  }));

  // Extract voucher IDs from selected invoices
  const voucherIds = selectedInvoices.map(invoice => invoice.id);

  return (
    <PaymentMethodAndReviewStep
      totalAmount={totalAmount}
      paymentItems={paymentItems}
      summaryType="list"
      selectedPaymentMethod={selectedPaymentMethod}
      onPaymentMethodChange={onPaymentMethodChange}
      onBack={onBack}
      onSubmit={onSubmit}
      voucherIds={voucherIds}
      paymentContext="vendor_payment"
      additionalSummaryData={{
        itemLabel: "Number of Invoices",
        amountLabel: "Invoice Amount",
        listTitle: `Selected Invoices (${selectedInvoices.length})`
      }}
    />
  );
};

export default InvoicePaymentMethodAndReviewStep;