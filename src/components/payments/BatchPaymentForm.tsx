
import { useState } from "react";
import { BatchPaymentFormProps, PaymentRow, BatchPaymentState } from "./batch/types";
import UploadStep from "./batch/UploadStep";
import ValidationStep from "./batch/ValidationStep";
import PaymentMethodSelectionStep from "./batch/PaymentMethodSelectionStep";
import RewardTopUpStep, { RewardPackage } from "./common/RewardTopUpStep";
import ReviewStep from "./batch/ReviewStep";
import { PaymentScheduleType } from "./common/PaymentScheduleSelector";

const BatchPaymentForm = ({ onStepChange }: BatchPaymentFormProps) => {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<BatchPaymentState>({
    selectedRows: [],
    selectedPaymentMethod: undefined,
    paymentType: "now" as PaymentScheduleType,
    scheduledDate: undefined,
    frequency: "monthly"
  });
  const [selectedRewardPackage, setSelectedRewardPackage] = useState<RewardPackage | null>(null);

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

  const handleRewardPackageSelected = (pkg: RewardPackage | null) => {
    setSelectedRewardPackage(pkg);
    handleNext();
  };

  const getTotalAmount = () => {
    const selectedPaymentRows = paymentRows.filter(row => state.selectedRows.includes(row.id));
    return selectedPaymentRows.reduce((sum, row) => sum + row.amount, 0);
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
        />
      )}

      {step === 3 && (
        <PaymentMethodSelectionStep 
          selectedPaymentMethod={state.selectedPaymentMethod}
          onSelect={handleSelectPaymentMethod}
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

      {step === 4 && (
        <RewardTopUpStep 
          amount={getTotalAmount()}
          onBack={handleBack}
          onNext={handleRewardPackageSelected}
        />
      )}

      {step === 5 && (
        <ReviewStep 
          selectedRows={state.selectedRows}
          selectedPaymentMethodId={state.selectedPaymentMethod}
          paymentRows={paymentRows}
          onBack={handleBack}
          paymentType={state.paymentType}
          scheduledDate={state.scheduledDate}
          frequency={state.frequency}
          rewardPackage={selectedRewardPackage}
        />
      )}
    </div>
  );
};

export default BatchPaymentForm;
