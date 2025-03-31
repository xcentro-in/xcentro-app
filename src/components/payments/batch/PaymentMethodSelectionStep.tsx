
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import PaymentMethodSelector from "../PaymentMethodSelector";
import { PaymentType } from "../PaymentDetailsStep";

interface PaymentMethodSelectionStepProps {
  selectedPaymentMethod?: string;
  onSelect: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
  paymentType: PaymentType;
  scheduledDate?: Date;
  frequency: string;
  onPaymentTypeChange: (value: PaymentType) => void;
  onScheduledDateChange: (date?: Date) => void;
  onFrequencyChange: (value: string) => void;
}

const PaymentMethodSelectionStep = ({ 
  selectedPaymentMethod, 
  onSelect,
  onBack,
  onNext,
  paymentType,
  scheduledDate,
  frequency,
  onPaymentTypeChange,
  onScheduledDateChange,
  onFrequencyChange
}: PaymentMethodSelectionStepProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium mb-2">Select Payment Method</h3>
      
      <PaymentMethodSelector 
        onSelect={onSelect}
        selectedMethodId={selectedPaymentMethod}
      />

      <div className="mt-6 border-t pt-6">
        <div className="space-y-3">
          <Label className="text-base">Payment Type</Label>
          <RadioGroup 
            value={paymentType} 
            onValueChange={(value: PaymentType) => onPaymentTypeChange(value)}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="now" id="pay-now" />
              <Label htmlFor="pay-now" className="cursor-pointer">Pay Now</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="later" id="pay-later" />
              <Label htmlFor="pay-later" className="cursor-pointer">Pay Later</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="recurring" id="pay-recurring" />
              <Label htmlFor="pay-recurring" className="cursor-pointer">Recurring Payment</Label>
            </div>
          </RadioGroup>
        </div>

        {paymentType === "later" && (
          <div className="space-y-2 mt-4">
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
          <div className="space-y-2 mt-4">
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
      </div>

      <div className="flex justify-between gap-3 mt-6">
        <Button variant="outline" onClick={onBack} className="w-auto">Back</Button>
        <Button 
          onClick={onNext} 
          className="w-auto"
          disabled={!selectedPaymentMethod}
        >
          Review Payment
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethodSelectionStep;
