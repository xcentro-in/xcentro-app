
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PaymentDetailsStep, PaymentType } from "./PaymentDetailsStep";
import { PaymentSummary } from "./PaymentSummary";
import PaymentMethodSelector from "./PaymentMethodSelector";

interface SinglePaymentFormProps {
  onStepChange: (step: number) => void;
}

const SinglePaymentForm = ({ onStepChange }: SinglePaymentFormProps) => {
  const [step, setStep] = useState(1);
  const [paymentType, setPaymentType] = useState<PaymentType>("now");
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [selectedPayee, setSelectedPayee] = useState<string>();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>();
  
  const handleNext = () => {
    const nextStep = step + 1;
    setStep(nextStep);
    onStepChange(nextStep);
  };

  const handleBack = () => {
    const prevStep = step - 1;
    setStep(prevStep);
    onStepChange(prevStep);
  };

  return (
    <div className="space-y-6">
      {step === 1 && (
        <PaymentDetailsStep
          paymentType={paymentType}
          scheduledDate={scheduledDate}
          onPaymentTypeChange={setPaymentType}
          onScheduledDateChange={setScheduledDate}
          onNext={handleNext}
        />
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select Payee</Label>
            <Select value={selectedPayee} onValueChange={setSelectedPayee}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a payee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">+ Add New Payee</SelectItem>
                <SelectItem value="payee1">Office Supplies Co.</SelectItem>
                <SelectItem value="payee2">Cloud Services</SelectItem>
                <SelectItem value="payee3">Marketing Agency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleBack} className="flex-1">Back</Button>
            <Button onClick={handleNext} className="flex-1" disabled={!selectedPayee}>Continue to Payment Method</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h3 className="font-medium mb-2">Select Payment Method</h3>
          
          <PaymentMethodSelector 
            onSelect={setSelectedPaymentMethod}
            selectedMethodId={selectedPaymentMethod}
          />

          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={handleBack} className="flex-1">Back</Button>
            <Button 
              onClick={handleNext} 
              className="flex-1"
              disabled={!selectedPaymentMethod}
            >
              Review Payment
            </Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <PaymentSummary
          paymentType={paymentType}
          scheduledDate={scheduledDate}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default SinglePaymentForm;
