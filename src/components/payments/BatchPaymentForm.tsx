
import { useState } from "react";
import { BatchPaymentFormProps, PaymentRow } from "./batch/types";
import UploadStep from "./batch/UploadStep";
import ValidationStep from "./batch/ValidationStep";
import PaymentMethodSelectionStep from "./batch/PaymentMethodSelectionStep";
import ReviewStep from "./batch/ReviewStep";
import { PaymentType } from "./PaymentDetailsStep";

const BatchPaymentForm = ({ onStepChange }: BatchPaymentFormProps) => {
  const [step, setStep] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>();
  
  // Payment type related state (moved from PaymentDetailsStep)
  const [paymentType, setPaymentType] = useState<PaymentType>("now");
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [frequency, setFrequency] = useState<string>("monthly");

  // Sample payment rows (in a real app, this would come from the uploaded file)
  const paymentRows: PaymentRow[] = [
    {
      id: "1",
      payee: "Office Supplies Co.",
      amount: 2499.99,
      description: "Monthly supplies",
      bankAccount: "XXXX1234",
      ifsc: "HDFC0001234",
    },
    {
      id: "2",
      payee: "Cloud Services",
      amount: 899.00,
      description: "Cloud hosting",
      bankAccount: "XXXX5678",
      ifsc: "ICIC0009876",
    },
  ];

  const handleNext = () => {
    const nextStep = step + 1;
    setStep(nextStep);
    onStepChange(nextStep);
  };

  const handleBack = () => {
    const prevStep = step - 1;
    setStep(prevStep);
    onStepChange(prevStep);
  };

  const handleSelectAll = () => {
    if (selectedRows.length === paymentRows.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paymentRows.map(row => row.id));
    }
  };

  const handleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  return (
    <div className="space-y-6">
      {step === 1 && (
        <UploadStep 
          onNext={handleNext}
        />
      )}

      {step === 2 && (
        <ValidationStep 
          paymentRows={paymentRows}
          selectedRows={selectedRows}
          onSelectRow={handleSelectRow}
          onSelectAll={handleSelectAll}
          onBack={handleBack}
          onNext={handleNext}
        />
      )}

      {step === 3 && (
        <PaymentMethodSelectionStep 
          selectedPaymentMethod={selectedPaymentMethod}
          onSelect={setSelectedPaymentMethod}
          paymentType={paymentType}
          scheduledDate={scheduledDate}
          frequency={frequency}
          onPaymentTypeChange={setPaymentType}
          onScheduledDateChange={setScheduledDate}
          onFrequencyChange={setFrequency}
          onBack={handleBack}
          onNext={handleNext}
        />
      )}

      {step === 4 && (
        <ReviewStep 
          selectedRows={selectedRows}
          selectedPaymentMethodId={selectedPaymentMethod}
          paymentRows={paymentRows}
          paymentType={paymentType}
          scheduledDate={scheduledDate}
          frequency={frequency}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default BatchPaymentForm;
