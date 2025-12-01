import { Button } from "@/components/ui/button";
import { convertToIndianCurrencyWords } from "@/utils/numberToWords";
import { OutlinedInput } from "@/components/ui/outlined-input";
import PayeeAutocompleteInput from "../../payee-management/payee/PayeeAutocompleteInput";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CombinedDetailsStepProps {
  amount: string;
  description: string;
  invoiceReference: string;
  selectedPayee?: string;
  favoritePayees: string[];
  isCreatingVoucher?: boolean;
  isUpdating?: boolean;
  onAmountChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onInvoiceReferenceChange: (value: string) => void;
  onPayeeSelect: (payeeId: string) => void;
  onNext: () => void;
}

const CombinedDetailsStep = ({
  amount,
  description,
  invoiceReference,
  selectedPayee,
  favoritePayees,
  isCreatingVoucher = false,
  isUpdating = false,
  onAmountChange,
  onDescriptionChange,
  onInvoiceReferenceChange,
  onPayeeSelect,
  onNext,
}: CombinedDetailsStepProps) => {
  const isFormValid = amount && selectedPayee && invoiceReference;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Payment Details</h2>
        <p className="text-muted-foreground">
          Enter payment information and select who you're paying
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Details Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Payment Information</h3>
          
          <div className="space-y-6">
            <div>
              <OutlinedInput
                label="Amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => onAmountChange(e.target.value)}
              />
              {amount && !isNaN(Number(amount)) && Number(amount) > 0 && (
                <div className="mt-2 text-sm text-muted-foreground">
                  {convertToIndianCurrencyWords(amount)}
                </div>
              )}
            </div>

            <OutlinedInput
              label="Description"
              placeholder="What is this payment for?"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
            />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Invoice Reference</label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p>Helps your vendor identify this payment in their bank statement description.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <OutlinedInput
                label=""
                placeholder="Enter invoice reference"
                value={invoiceReference}
                onChange={(e) => onInvoiceReferenceChange(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Payee Selection Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Who are you paying?</h3>
          
          <PayeeAutocompleteInput
            selectedPayee={selectedPayee}
            onPayeeSelect={onPayeeSelect}
            favoritePayees={favoritePayees}
          />
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button
          onClick={onNext}
          disabled={!isFormValid || isCreatingVoucher || isUpdating}
          className="w-auto"
        >
          {isCreatingVoucher
            ? "Creating Voucher..."
            : isUpdating
            ? "Updating Voucher..."
            : "Select Payment Method"}
        </Button>
      </div>
    </div>
  );
};

export default CombinedDetailsStep;