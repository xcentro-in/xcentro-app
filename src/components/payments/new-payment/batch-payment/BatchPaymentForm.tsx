
import { useState } from "react";
import { BatchPaymentFormProps, PaymentRow, BatchPaymentState } from "./types";
import UploadStep from "./UploadStep";
import BatchPaymentMethodAndReviewStep from "./BatchPaymentMethodAndReviewStep";
import { PaymentScheduleType } from "../shared/common/PaymentScheduleSelector";

const BatchPaymentForm = () => {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<BatchPaymentState>({
    selectedRows: [],
    selectedPaymentMethod: undefined,
    paymentType: "now" as PaymentScheduleType,
    scheduledDate: undefined,
    frequency: "monthly"
  });

  const [paymentRows, setPaymentRows] = useState<PaymentRow[]>([]);





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
          setStep={setStep}
          setPaymentRows={setPaymentRows}
        />
      )}

      {step === 2 && (
        <BatchPaymentMethodAndReviewStep 
          selectedRows={state.selectedRows}
          paymentRows={paymentRows}
          setStep={setStep}
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
