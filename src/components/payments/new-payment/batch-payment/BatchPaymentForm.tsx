
import { useState, useEffect } from "react";
import { BatchPaymentState, BatchUploadResponse, VoucherCreationResponse, MatchedPayment, PaymentRow } from "./types";
import UploadStep from "./UploadStep";
import ValidationStep from "./ValidationStep";
import BatchPaymentMethodAndReviewStep from "./BatchPaymentMethodAndReviewStep";

interface BatchPaymentFormComponentProps {
  onStepChange: (step: number) => void;
}

const BatchPaymentForm = ({ onStepChange }: BatchPaymentFormComponentProps) => {
  const [step, setStep] = useState(1);

  // Notify parent component when step changes (for progress bar)
  useEffect(() => {
    onStepChange(step);
  }, [step, onStepChange]);
  const [state, setState] = useState<BatchPaymentState>({
    selectedRows: [],
    selectedPaymentMethod: undefined
  });

  const [uploadResponse, setUploadResponse] = useState<BatchUploadResponse | null>(null);
  const [createdVouchers, setCreatedVouchers] = useState<VoucherCreationResponse | null>(null);
  const [selectedPayments, setSelectedPayments] = useState<MatchedPayment[]>([]);
  const [processedRowNumbers, setProcessedRowNumbers] = useState<Set<number>>(new Set()); // Track already-created rows

  const handleSelectRow = (rowNumber: string) => {
    setState(prev => ({
      ...prev,
      selectedRows: prev.selectedRows.includes(rowNumber)
        ? prev.selectedRows.filter(id => id !== rowNumber)
        : [...prev.selectedRows, rowNumber]
    }));
  };

  const handleSelectAll = () => {
    if (!uploadResponse) return;

    const allMatchedRowNumbers = uploadResponse.data.matched.map(p => p.row_number.toString());

    setState(prev => ({
      ...prev,
      selectedRows: prev.selectedRows.length === allMatchedRowNumbers.length
        ? []
        : allMatchedRowNumbers
    }));
  };

  const handleReupload = () => {
    setStep(1);
    setState(prev => ({ ...prev, selectedRows: [] }));
    setUploadResponse(null);
    setCreatedVouchers(null);
    setSelectedPayments([]);
    setProcessedRowNumbers(new Set()); // Clear processed rows on re-upload
  };

  const handleSelectPaymentMethod = (id: string) => {
    setState({ ...state, selectedPaymentMethod: id });
  };

  const handleVouchersCreated = (voucherResponse: VoucherCreationResponse, newPayments: MatchedPayment[]) => {
    // Merge new vouchers with existing ones
    if (createdVouchers) {
      // Append new vouchers to existing ones
      const mergedResponse: VoucherCreationResponse = {
        ...voucherResponse,
        data: {
          ...voucherResponse.data,
          vouchers: [...createdVouchers.data.vouchers, ...voucherResponse.data.vouchers],
          message: `Successfully created ${createdVouchers.data.vouchers.length + voucherResponse.data.vouchers.length} draft vouchers`
        }
      };
      setCreatedVouchers(mergedResponse);
    } else {
      // First time - just set it
      setCreatedVouchers(voucherResponse);
    }

    // Merge new payments with existing ones
    setSelectedPayments(prev => [...prev, ...newPayments]);

    // Track the row numbers that have been processed
    const newRowNumbers = newPayments.map(p => p.row_number);
    setProcessedRowNumbers(prev => new Set([...prev, ...newRowNumbers]));

    // Move to step 3
    setStep(3);
  };

  // Map created vouchers to PaymentRow format for step 3
  const mapVouchersToPaymentRows = (): PaymentRow[] => {
    if (!createdVouchers || !selectedPayments.length) return [];

    // Create a map of invoice_number -> matched payment
    const paymentMap = new Map(
      selectedPayments.map(p => [p.invoice_number, p])
    );

    // Map created vouchers to PaymentRow format
    return createdVouchers.data.vouchers.map(voucher => {
      const matchedPayment = paymentMap.get(voucher.invoice_number);

      if (!matchedPayment) {
        // Fallback if we can't find the matched payment
        return {
          id: voucher.voucher_id,
          payee: voucher.invoice_number,
          amount: 0,
          description: '',
          bankAccount: 'N/A',
          ifsc: 'N/A'
        };
      }

      return {
        id: voucher.voucher_id,
        payee: matchedPayment.matched_payee_name,
        amount: matchedPayment.amount / 100, // Convert from paise to rupees
        description: matchedPayment.description,
        bankAccount: matchedPayment.matched_account || 'N/A',
        ifsc: 'N/A' // IFSC not in matched payment response
      };
    });
  };

  const handleSubmit = () => {
    // Handle payment submission - navigate to payments page
    console.log("Payment submitted", { state, createdVouchers });
    // TODO: Navigate to /payments page after final submission
  };

  return (
    <div className="space-y-6">
      {step === 1 && (
        <UploadStep
          setStep={setStep}
          setUploadResponse={setUploadResponse}
        />
      )}

      {step === 2 && uploadResponse && (
        <ValidationStep
          uploadResponse={uploadResponse}
          selectedRows={state.selectedRows}
          processedRowNumbers={processedRowNumbers}
          onSelectRow={handleSelectRow}
          onSelectAll={handleSelectAll}
          onReupload={handleReupload}
          onNext={handleVouchersCreated}
        />
      )}

      {step === 3 && (
        <BatchPaymentMethodAndReviewStep
          paymentRows={mapVouchersToPaymentRows()}
          setStep={setStep}
          onSubmit={handleSubmit}
          selectedPaymentMethod={state.selectedPaymentMethod}
          onPaymentMethodChange={handleSelectPaymentMethod}
        />
      )}
    </div>
  );
};

export default BatchPaymentForm;
