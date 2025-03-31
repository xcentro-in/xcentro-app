
import React from "react";
import { format } from "date-fns";
import { Calendar, Clock, Repeat } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type PaymentScheduleType = "now" | "later" | "recurring";

interface PaymentScheduleSelectorProps {
  paymentType: PaymentScheduleType;
  scheduledDate?: Date;
  frequency: string;
  onPaymentTypeChange: (value: PaymentScheduleType) => void;
  onScheduledDateChange: (date?: Date) => void;
  onFrequencyChange: (value: string) => void;
}

const PaymentScheduleSelector = ({
  paymentType,
  scheduledDate,
  frequency,
  onPaymentTypeChange,
  onScheduledDateChange,
  onFrequencyChange,
}: PaymentScheduleSelectorProps) => {
  return (
    <div className="space-y-4 mt-6 border-t pt-6">
      <h3 className="font-medium">When to schedule this payment</h3>
      
      <RadioGroup 
        value={paymentType} 
        onValueChange={(value: PaymentScheduleType) => onPaymentTypeChange(value)}
        className="space-y-3"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="now" id="pay-now" />
          <Label htmlFor="pay-now" className="cursor-pointer flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Pay Now
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="later" id="pay-later" />
          <Label htmlFor="pay-later" className="cursor-pointer flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            Pay Later
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="recurring" id="pay-recurring" />
          <Label htmlFor="pay-recurring" className="cursor-pointer flex items-center gap-2">
            <Repeat className="h-4 w-4 text-muted-foreground" />
            Recurring Payment
          </Label>
        </div>
      </RadioGroup>

      {paymentType === "later" && (
        <div className="ml-6 mt-2 space-y-2">
          <Label className="text-sm">Select payment date</Label>
          <div>
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
                  {scheduledDate ? format(scheduledDate, "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={scheduledDate}
                  onSelect={onScheduledDateChange}
                  initialFocus
                  disabled={date => date < new Date()}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

      {paymentType === "recurring" && (
        <div className="ml-6 mt-2 space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Payment frequency</Label>
            <Select value={frequency} onValueChange={onFrequencyChange}>
              <SelectTrigger className="w-[240px]">
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
            <Label className="text-sm">Start date</Label>
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
                  {scheduledDate ? format(scheduledDate, "PPP") : <span>Select start date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={scheduledDate}
                  onSelect={onScheduledDateChange}
                  initialFocus
                  disabled={date => date < new Date()}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentScheduleSelector;
