
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export type PaymentType = "now" | "later" | "recurring";

interface PaymentDetailsStepProps {
  paymentType: PaymentType;
  scheduledDate?: Date;
  onPaymentTypeChange: (value: PaymentType) => void;
  onScheduledDateChange: (date?: Date) => void;
  onNext: () => void;
}

export const PaymentDetailsStep = ({
  paymentType,
  scheduledDate,
  onPaymentTypeChange,
  onScheduledDateChange,
  onNext,
}: PaymentDetailsStepProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Payment Type</Label>
        <Select value={paymentType} onValueChange={(value: PaymentType) => onPaymentTypeChange(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select payment type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="now">Pay Now</SelectItem>
            <SelectItem value="later">Pay Later</SelectItem>
            <SelectItem value="recurring">Recurring Payment</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
        <div className="space-y-2">
          <Label>Frequency</Label>
          <Select>
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
      )}

      <div className="space-y-2">
        <Label>Amount</Label>
        <Input type="number" placeholder="Enter amount" />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Input placeholder="What is this payment for?" />
      </div>

      <div className="space-y-2">
        <Label>Invoice Reference (Optional)</Label>
        <Input placeholder="Enter invoice reference" />
      </div>

      <Button onClick={onNext} className="w-full">Continue to Payee Selection</Button>
    </div>
  );
};
