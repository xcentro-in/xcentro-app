
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InvoiceDetails } from "@/types/invoice";
import PaymentMethodSelector from "@/components/payments/PaymentMethodSelector";
import PaymentScheduleSelector, { PaymentScheduleType } from "@/components/payments/common/PaymentScheduleSelector";

interface PaymentMethodStepProps {
  invoiceDetails: InvoiceDetails;
  onSelect: (methodId: string) => void;
  onBack: () => void;
  paymentType?: PaymentScheduleType;
  scheduledDate?: Date;
  frequency?: string;
  onPaymentTypeChange?: (value: PaymentScheduleType) => void;
  onScheduledDateChange?: (date?: Date) => void;
  onFrequencyChange?: (value: string) => void;
}

const PaymentMethodStep = ({ 
  invoiceDetails, 
  onSelect, 
  onBack,
  paymentType = "now",
  scheduledDate,
  frequency = "monthly",
  onPaymentTypeChange,
  onScheduledDateChange,
  onFrequencyChange 
}: PaymentMethodStepProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [localPaymentType, setLocalPaymentType] = useState<PaymentScheduleType>(paymentType);
  const [localScheduledDate, setLocalScheduledDate] = useState<Date | undefined>(scheduledDate);
  const [localFrequency, setLocalFrequency] = useState<string>(frequency);
  
  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
  };

  const handlePaymentTypeChange = (type: PaymentScheduleType) => {
    setLocalPaymentType(type);
    if (onPaymentTypeChange) onPaymentTypeChange(type);
  };

  const handleDateChange = (date?: Date) => {
    setLocalScheduledDate(date);
    if (onScheduledDateChange) onScheduledDateChange(date);
  };

  const handleFrequencyChange = (freq: string) => {
    setLocalFrequency(freq);
    if (onFrequencyChange) onFrequencyChange(freq);
  };
  
  const isButtonDisabled = !selectedMethod || 
    (localPaymentType === "later" && !localScheduledDate) || 
    (localPaymentType === "recurring" && (!localScheduledDate || !localFrequency));
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Select Payment Method</h2>
        <p className="text-muted-foreground">
          Choose how you want to pay {invoiceDetails.vendorName}
        </p>
      </div>
      
      <PaymentMethodSelector 
        onSelect={handleMethodSelect}
        selectedMethodId={selectedMethod || undefined}
      />
      
      <PaymentScheduleSelector
        paymentType={localPaymentType}
        scheduledDate={localScheduledDate}
        frequency={localFrequency}
        onPaymentTypeChange={handlePaymentTypeChange}
        onScheduledDateChange={handleDateChange}
        onFrequencyChange={handleFrequencyChange}
      />
      
      <div className="flex justify-between mt-6">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="w-auto"
        >
          Back
        </Button>
        <Button 
          onClick={() => selectedMethod && onSelect(selectedMethod)}
          disabled={isButtonDisabled}
          className="w-auto"
        >
          Proceed to Pay
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethodStep;
