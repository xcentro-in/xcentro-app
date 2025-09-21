
import { useState } from "react";
import { BatchPaymentFormProps, PaymentRow, BatchPaymentState } from "./types";
import UploadStep from "./UploadStep";
import ValidationStep from "./ValidationStep";
import BatchPaymentMethodAndReviewStep from "./BatchPaymentMethodAndReviewStep";
import { PaymentScheduleType } from "../shared/common/PaymentScheduleSelector";

const BatchPaymentForm = ({ onStepChange }: BatchPaymentFormProps) => {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<BatchPaymentState>({
    selectedRows: [],
    selectedPaymentMethod: undefined,
    paymentType: "now" as PaymentScheduleType,
    scheduledDate: undefined,
    frequency: "monthly"
  });

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
    if (state.selectedRows.length === paymentRows.length) {
      setState({ ...state, selectedRows: [] });
    } else {
      setState({ ...state, selectedRows: paymentRows.map(row => row.id) });
    }
  };

  const handleSelectRow = (id: string) => {
    if (state.selectedRows.includes(id)) {
      setState({ 
        ...state, 
        selectedRows: state.selectedRows.filter(rowId => rowId !== id) 
      });
    } else {
      setState({ 
        ...state, 
        selectedRows: [...state.selectedRows, id] 
      });
    }
  };

  const handleSelectPaymentMethod = (id: string) => {
    setState({ ...state, selectedPaymentMethod: id });
  };

  const handlePaymentTypeChange = (type: PaymentScheduleType) => {
    setState({ ...state, paymentType: type });
  };

  const handleScheduledDateChange = (date?: Date) => {
    setState({ ...state, scheduledDate: date });
  };

  const handleFrequencyChange = (frequency: string) => {
    setState({ ...state, frequency: frequency });
  };

  const handleSubmit = () => {
    // Handle payment submission
    console.log("Payment submitted");
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
          selectedRows={state.selectedRows}
          onSelectRow={handleSelectRow}
          onSelectAll={handleSelectAll}
          onBack={handleBack}
          onNext={handleNext}
          paymentType={state.paymentType}
          scheduledDate={state.scheduledDate}
          frequency={state.frequency}
          onPaymentTypeChange={handlePaymentTypeChange}
          onScheduledDateChange={handleScheduledDateChange}
          onFrequencyChange={handleFrequencyChange}
        />
      )}

      {step === 3 && (
        <BatchPaymentMethodAndReviewStep 
          selectedRows={state.selectedRows}
          paymentRows={paymentRows}
          onBack={handleBack}
          onSubmit={handleSubmit}
          paymentType={state.paymentType}
          scheduledDate={state.scheduledDate}
          frequency={state.frequency}
        />
      )}
    </div>
  );
};

export default BatchPaymentForm;
