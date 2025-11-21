import { useState, useEffect, useRef } from "react";
import CombinedDetailsStep from "./CombinedDetailsStep";
import PaymentMethodAndReviewStep from "./PaymentMethodAndReviewStep";
import { toast } from "@/hooks/use-toast";
import { PaymentType } from "@/types/payments";
import { voucherAPI } from "@/services/api";
import { GetVoucherDraftResponse, UpdateVoucherRequest } from "@/types/voucher";
import { useAuth } from "@/contexts/AuthContext";
import { useVendors } from "@/hooks/useVendors";
import { Payee } from "@/types/payee";

interface SinglePaymentFormProps {
  onStepChange: (step: number) => void;
}

interface FormState {
  amount: string;
  description: string;
  invoiceReference: string;
  selectedPayee?: string;
  paymentType: PaymentType;
  scheduledDate?: Date;
  frequency: string;
}

const SinglePaymentForm = ({ onStepChange }: SinglePaymentFormProps) => {
  const { user } = useAuth();
  const { vendors } = useVendors(user?.businessId);
  const [step, setStep] = useState(1);
  const [paymentType, setPaymentType] = useState<PaymentType>("now");
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [invoiceReference, setInvoiceReference] = useState<string>("");
  const [frequency, setFrequency] = useState<string>("monthly");
  const [selectedPayee, setSelectedPayee] = useState<string>();
  const [favoritePayees, setFavoritePayees] = useState<string[]>(["1", "3"]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>();
  const [voucherId, setVoucherId] = useState<string>();
  const [isCreatingVoucher, setIsCreatingVoucher] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Store initial form state when voucher is created
  const initialFormState = useRef<FormState | null>(null);

  // Reset voucher session when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup: reset voucher state when leaving the quick payment flow
      setVoucherId(undefined);
      initialFormState.current = null;
    };
  }, []);

  // Helper to get current form state
  const getCurrentFormState = (): FormState => ({
    amount,
    description,
    invoiceReference,
    selectedPayee,
    paymentType,
    scheduledDate,
    frequency
  });

  // Helper to detect changes and return only changed fields
  const getChangedFields = (): UpdateVoucherRequest | null => {
    if (!initialFormState.current) return null;

    const initial = initialFormState.current;
    const current = getCurrentFormState();
    const changes: UpdateVoucherRequest = {};

    // Check each field for changes
    if (current.selectedPayee !== initial.selectedPayee) {
      changes.relation_id = current.selectedPayee;
    }
    if (current.invoiceReference !== initial.invoiceReference) {
      changes.invoice_number = current.invoiceReference || undefined;
    }

    // If amount or description changed, update all related fields including financial_details
    const amountChanged = current.amount !== initial.amount;
    const descriptionChanged = current.description !== initial.description;

    if (amountChanged || descriptionChanged) {
      const amountInPaise = parseFloat(current.amount) * 100;

      if (amountChanged) {
        changes.gross_amount = amountInPaise;
        changes.net_amount = amountInPaise;
      }

      if (descriptionChanged) {
        changes.description = current.description || undefined;
      }

      // Update financial_details if amount or description changed
      changes.financial_details = {
        line_items: [{
          description: current.description || "Quick Payment",
          quantity: 1,
          rate: amountInPaise,
          amount: amountInPaise,
          gst_rate: 0,
          gst_amount: 0
        }],
        discount: {
          type: 'percentage',
          value: 0,
          amount: 0
        },
        round_off: {
          applied: false,
          amount: 0
        },
        gst_type: 'cgst_sgst'
      };
    }

    if (current.paymentType !== initial.paymentType) {
      changes.payment_type = current.paymentType;
    }
    if (current.scheduledDate?.toISOString() !== initial.scheduledDate?.toISOString()) {
      changes.scheduled_date = current.scheduledDate?.toISOString();
    }
    if (current.frequency !== initial.frequency && current.paymentType === "recurring") {
      changes.frequency = current.frequency;
    }

    // Return null if no changes
    return Object.keys(changes).length > 0 ? changes : null;
  };

  const handleNext = async () => {
    // If moving from step 1 to step 2, handle voucher creation/update
    if (step === 1 && selectedPayee && amount) {
      // Decision tree: Create, Update, or Skip API call
      if (!voucherId) {
        // No voucher exists - CREATE new draft
        setIsCreatingVoucher(true);

        try {
          // Prepare financial details with single line item for quick payment
          const amountInPaise = parseFloat(amount) * 100;
          const financialDetails = {
            line_items: [{
              description: description || "Quick Payment",
              quantity: 1,
              rate: amountInPaise,
              amount: amountInPaise,
              gst_rate: 0,  // No GST assumption - user can edit later if needed
              gst_amount: 0
            }],
            discount: {
              type: 'percentage',
              value: 0,
              amount: 0
            },
            round_off: {
              applied: false,
              amount: 0
            },
            gst_type: 'cgst_sgst'
          };

          const response: GetVoucherDraftResponse = await voucherAPI.createDraft
          (
            user?.businessId,
            {
            relation_id: selectedPayee,
            invoice_number: invoiceReference || undefined,
            invoice_date: new Date().toISOString().split('T')[0], // Today's date (YYYY-MM-DD)
            gross_amount: amountInPaise,
            net_amount: amountInPaise,
            cgst_amount: 0,
            sgst_amount: 0,
            igst_amount: 0,
            gst_amount: 0,
            discount_amount: 0,
            description: description || undefined,
            payment_type: paymentType,
            scheduled_date: scheduledDate?.toISOString(),
            frequency: paymentType === "recurring" ? frequency : undefined,
            financial_details: financialDetails,
          });

          // Store voucher_id and initial form state
          setVoucherId(response.data.voucher_id);
          initialFormState.current = getCurrentFormState();

          // Move to next step
          const nextStep = step + 1;
          setStep(nextStep);
          onStepChange(nextStep);

          toast({
            title: "Voucher Created",
            description: `Voucher ${response.data.voucher_number} created successfully.`,
          });
        } catch (error) {
          console.error("Failed to create voucher draft:", error);
          toast({
            title: "Error",
            description: "Failed to create payment voucher. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsCreatingVoucher(false);
        }
      } else {
        // Voucher exists - check for changes
        const changedFields = getChangedFields();

        if (changedFields) {
          // Changes detected - UPDATE voucher
          setIsUpdating(true);

          try {
            const response: GetVoucherDraftResponse = await voucherAPI.update(
              voucherId,
              changedFields
            );

            // Update initial form state to current state
            initialFormState.current = getCurrentFormState();

            // Move to next step
            const nextStep = step + 1;
            setStep(nextStep);
            onStepChange(nextStep);

            toast({
              title: "Voucher Updated",
              description: `Voucher ${response.data.voucher_number} updated successfully.`,
            });
          } catch (error) {
            console.error("Failed to update voucher:", error);
            toast({
              title: "Error",
              description: "Failed to update payment voucher. Please try again.",
              variant: "destructive",
            });
          } finally {
            setIsUpdating(false);
          }
        } else {
          // No changes - SKIP API call and just navigate
          const nextStep = step + 1;
          setStep(nextStep);
          onStepChange(nextStep);
        }
      }
    } else {
      // For other step transitions, just move forward
      const nextStep = step + 1;
      setStep(nextStep);
      onStepChange(nextStep);
    }
  };

  const handleBack = () => {
    const prevStep = step - 1;
    setStep(prevStep);
    onStepChange(prevStep);
  };
  
  const toggleFavorite = (payeeId: string) => {
    setFavoritePayees(prev => 
      prev.includes(payeeId) 
        ? prev.filter(id => id !== payeeId) 
        : [...prev, payeeId]
    );
  };

  const handlePaymentMethodSelected = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    handleNext();
  };

  const handleSubmit = async () => {
    toast({
      title: "Payment Initiated",
      description: "Your payment has been successfully processed.",
    });

    // Flag will be updated automatically when Payments page renders and detects transactions exist
  };

  // Map vendor to Payee type for compatibility with PaymentMethodAndReviewStep
  const payeeDetails: Payee | undefined = selectedPayee
    ? (() => {
        const vendor = vendors.find(v => v.relation_id === selectedPayee);
        if (!vendor) return undefined;

        // Create a minimal BankPayee object with vendor data
        return {
          id: vendor.relation_id,
          name: vendor.display_name,
          type: "bank" as const,
          email: vendor.contact_email,
          contactNumber: vendor.contact_phone,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isDefault: false,
          accountNumber: "", // Not available from vendor API
          bankName: "", // Not available from vendor API
          ifscCode: "", // Not available from vendor API
          defaultPaymentMode: "bank" as const,
          tags: [],
        } as Payee;
      })()
    : undefined;

  return (
    <div className="space-y-6">
      {step === 1 && (
        <CombinedDetailsStep
          paymentType={paymentType}
          scheduledDate={scheduledDate}
          amount={amount}
          description={description}
          invoiceReference={invoiceReference}
          frequency={frequency}
          selectedPayee={selectedPayee}
          favoritePayees={favoritePayees}
          onPaymentTypeChange={setPaymentType}
          onScheduledDateChange={setScheduledDate}
          onAmountChange={setAmount}
          onDescriptionChange={setDescription}
          onInvoiceReferenceChange={setInvoiceReference}
          onFrequencyChange={setFrequency}
          onPayeeSelect={setSelectedPayee}
          onNext={handleNext}
          isCreatingVoucher={isCreatingVoucher}
          isUpdating={isUpdating}
        />
      )}

      {step === 2 && payeeDetails && (
        <PaymentMethodAndReviewStep
          paymentType={paymentType}
          scheduledDate={scheduledDate}
          amount={parseFloat(amount) || 0}
          description={description}
          invoiceReference={invoiceReference}
          frequency={frequency}
          payee={payeeDetails}
          voucherId={voucherId}
          onBack={handleBack}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default SinglePaymentForm;
