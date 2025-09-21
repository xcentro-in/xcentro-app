
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { convertToIndianCurrencyWords } from "@/utils/numberToWords";
import { PaymentType } from "@/types/payments";

interface PaymentDetailsStepProps {
  paymentType: PaymentType;
  scheduledDate?: Date;
  amount: string;
  description: string;
  invoiceReference: string;
  frequency: string;
  onPaymentTypeChange: (value: PaymentType) => void;
  onScheduledDateChange: (date?: Date) => void;
  onAmountChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onInvoiceReferenceChange: (value: string) => void;
  onFrequencyChange: (value: string) => void;
  onNext: () => void;
}

export const PaymentDetailsStep = ({
  paymentType,
  scheduledDate,
  amount,
  description,
  invoiceReference,
  frequency,
  onPaymentTypeChange,
  onScheduledDateChange,
  onAmountChange,
  onDescriptionChange,
  onInvoiceReferenceChange,
  onFrequencyChange,
  onNext,
}: PaymentDetailsStepProps) => {
  return (
    <div className="space-y-6 max-w ml-0">
      {paymentType === "later" && (
        <div className="space-y-2">
          <Label>Schedule Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-auto min-w-[240px] justify-start text-left font-normal",
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
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      {paymentType === "recurring" && (
        <div className="space-y-2">
          <Label>Frequency & Start Date</Label>
          <div className="flex gap-4 flex-wrap">
            <div className="w-[180px]">
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
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-auto min-w-[180px] justify-start text-left font-normal",
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
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>Amount</Label>
        <div className="relative">
          <Input 
            type="number" 
            placeholder="Enter amount" 
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            className="max-w-[240px]"
          />
          {amount && !isNaN(Number(amount)) && Number(amount) > 0 && (
            <div className="mt-1 text-sm text-muted-foreground">
              {convertToIndianCurrencyWords(amount)}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Input 
          placeholder="What is this payment for?" 
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="space-y-2">
        <Label>Invoice Reference (Optional)</Label>
        <Input 
          placeholder="Enter invoice reference" 
          value={invoiceReference}
          onChange={(e) => onInvoiceReferenceChange(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="flex justify-end pt-4 w-full">
        <Button onClick={onNext} className="w-auto">Continue to Payee Selection</Button>
      </div>
    </div>
  );
};
