import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { convertToIndianCurrencyWords } from "@/utils/numberToWords";
import { OutlinedInput } from "@/components/ui/outlined-input";
import PayeeAutocompleteInput from "../PayeeAutocompleteInput";
import PaymentScheduleSelector from "../common/PaymentScheduleSelector";
import { PaymentType } from "@/types/payments";

interface CombinedDetailsStepProps {
  paymentType: PaymentType;
  scheduledDate?: Date;
  amount: string;
  description: string;
  invoiceReference: string;
  frequency: string;
  selectedPayee?: string;
  favoritePayees: string[];
  onPaymentTypeChange: (value: PaymentType) => void;
  onScheduledDateChange: (date?: Date) => void;
  onAmountChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onInvoiceReferenceChange: (value: string) => void;
  onFrequencyChange: (value: string) => void;
  onPayeeSelect: (payeeId: string) => void;
  onNext: () => void;
}

const CombinedDetailsStep = ({
  paymentType,
  scheduledDate,
  amount,
  description,
  invoiceReference,
  frequency,
  selectedPayee,
  favoritePayees,
  onPaymentTypeChange,
  onScheduledDateChange,
  onAmountChange,
  onDescriptionChange,
  onInvoiceReferenceChange,
  onFrequencyChange,
  onPayeeSelect,
  onNext,
}: CombinedDetailsStepProps) => {
  const isFormValid = amount && selectedPayee && 
    (paymentType === "now" || 
     (paymentType === "later" && scheduledDate) ||
     (paymentType === "recurring" && scheduledDate && frequency));

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

            <OutlinedInput
              label="Invoice Reference (Optional)"
              placeholder="Enter invoice reference"
              value={invoiceReference}
              onChange={(e) => onInvoiceReferenceChange(e.target.value)}
            />
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

      {/* Payment Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>When to Schedule Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentScheduleSelector
            paymentType={paymentType}
            scheduledDate={scheduledDate}
            frequency={frequency}
            onPaymentTypeChange={onPaymentTypeChange}
            onScheduledDateChange={onScheduledDateChange}
            onFrequencyChange={onFrequencyChange}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end pt-6">
        <Button 
          onClick={onNext} 
          disabled={!isFormValid}
          className="w-auto"
        >
          Select Payment Method
        </Button>
      </div>
    </div>
  );
};

export default CombinedDetailsStep;