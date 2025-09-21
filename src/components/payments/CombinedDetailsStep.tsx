import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { convertToIndianCurrencyWords } from "@/utils/numberToWords";
import { OutlinedInput } from "@/components/ui/outlined-input";
import PayeeAutocompleteInput from "./PayeeAutocompleteInput";

export type PaymentType = "now" | "later" | "recurring";

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

            {/* Payment Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>When to schedule this payment?</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentType} onValueChange={onPaymentTypeChange}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="now" id="now" />
                    <Label htmlFor="now">Pay Now</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="later" id="later" />
                    <Label htmlFor="later">Schedule Payment</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="recurring" id="recurring" />
                    <Label htmlFor="recurring">Recurring Payment</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {paymentType === "later" && (
              <div className="space-y-2">
                <Label>Schedule Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !scheduledDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {scheduledDate ? format(scheduledDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={scheduledDate}
                      onSelect={onScheduledDateChange}
                      initialFocus
                      className="p-3"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {paymentType === "recurring" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select value={frequency} onValueChange={onFrequencyChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !scheduledDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {scheduledDate ? format(scheduledDate, "PPP") : <span>Start date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={scheduledDate}
                        onSelect={onScheduledDateChange}
                        initialFocus
                        className="p-3"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
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
          disabled={!isFormValid}
          className="w-auto"
        >
          Continue to Rewards
        </Button>
      </div>
    </div>
  );
};

export default CombinedDetailsStep;