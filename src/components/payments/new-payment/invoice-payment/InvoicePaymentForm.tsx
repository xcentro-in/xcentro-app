import { useState } from "react";
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
      paymentMethod: selectedPaymentMethod
    });
  };

  if (currentStep === 'invoices') {
    return (
      <InvoiceSelectionStep
        selectedInvoices={selectedInvoices}
        onInvoicesSelect={handleInvoicesSelect}
        onNext={handleNext}
      />
    );
  }

  if (currentStep === 'payment-review') {
    return (
      <InvoicePaymentMethodAndReviewStep
        selectedInvoices={selectedInvoices}
        selectedPaymentMethod={selectedPaymentMethod}
        onPaymentMethodChange={handlePaymentMethodSelected}
        onBack={handleBack}
        onSubmit={handleSubmit}
      />
    );
  }

  return null;
};

export default InvoicePaymentForm;