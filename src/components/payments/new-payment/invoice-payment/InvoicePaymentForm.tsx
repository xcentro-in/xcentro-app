import { useState } from "react";
import { PaymentScheduleType } from "../shared/common/PaymentScheduleSelector";
import InvoiceSelectionStep from "./InvoiceSelectionStep";
import InvoicePaymentMethodAndReviewStep from "./InvoicePaymentMethodAndReviewStep";
import { Invoice, mockInvoices } from "@/data/mockInvoices";
import { toast } from "sonner";

interface InvoicePaymentFormProps {
  onStepChange: (step: number) => void;
}

const InvoicePaymentForm = ({ onStepChange }: InvoicePaymentFormProps) => {
  const [currentStep, setCurrentStep] = useState<'invoices' | 'payment-review'>('invoices');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | undefined>(undefined);
  const [selectedInvoices, setSelectedInvoices] = useState<Invoice[]>([]);
  
  // Payment schedule states
  const [paymentType, setPaymentType] = useState<PaymentScheduleType>("now");
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [frequency, setFrequency] = useState<string>("monthly");
  
  const handleInvoicesSelect = (invoices: Invoice[]) => {
    setSelectedInvoices(invoices);
  };
  
  const handleNext = () => {
    setCurrentStep('payment-review');
    onStepChange(1);
  };
  
  const handleBack = () => {
    setCurrentStep('invoices');
    onStepChange(0);
  };

  const handlePaymentMethodSelected = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  const handleSubmit = () => {
    toast.success("Invoice payment initiated successfully!");
    console.log("Invoice payment submitted", {
      invoices: selectedInvoices,
      paymentMethod: selectedPaymentMethod,
      paymentType,
      scheduledDate,
      frequency
    });
  };

  if (currentStep === 'invoices') {
    return (
      <InvoiceSelectionStep
        invoices={mockInvoices}
        selectedInvoices={selectedInvoices}
        paymentType={paymentType}
        scheduledDate={scheduledDate}
        frequency={frequency}
        onInvoicesSelect={handleInvoicesSelect}
        onPaymentTypeChange={setPaymentType}
        onScheduledDateChange={setScheduledDate}
        onFrequencyChange={setFrequency}
        onNext={handleNext}
      />
    );
  }
  
  if (currentStep === 'payment-review') {
    return (
      <InvoicePaymentMethodAndReviewStep
        selectedInvoices={selectedInvoices}
        selectedPaymentMethod={selectedPaymentMethod}
        paymentType={paymentType}
        scheduledDate={scheduledDate}
        frequency={frequency}
        onPaymentMethodChange={handlePaymentMethodSelected}
        onBack={handleBack}
        onSubmit={handleSubmit}
      />
    );
  }
  
  return null;
};

export default InvoicePaymentForm;