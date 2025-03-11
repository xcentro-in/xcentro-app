import { useState } from "react";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

type PaymentType = "now" | "later" | "recurring";

interface SinglePaymentFormProps {
  onStepChange: (step: number) => void;
}

const SinglePaymentForm = ({ onStepChange }: SinglePaymentFormProps) => {
  const [step, setStep] = useState(1);
  const [paymentType, setPaymentType] = useState<PaymentType>("now");
  const [scheduledDate, setScheduledDate] = useState<Date>();
  
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
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Payment Type</Label>
            <Select value={paymentType} onValueChange={(value: PaymentType) => setPaymentType(value)}>
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
                    onSelect={setScheduledDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
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

          <Button onClick={handleNext} className="w-full">Continue to Payee Selection</Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select Payee</Label>
            <Select>
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
            <Button onClick={handleNext} className="flex-1">Continue to Payment Method</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choose payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">+ Add New Payment Method</SelectItem>
                <SelectItem value="card1">Corporate Visa •••• 4242</SelectItem>
                <SelectItem value="bank1">Business Checking •••• 8790</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleBack} className="flex-1">Back</Button>
            <Button onClick={handleNext} className="flex-1">Review Payment</Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <h3 className="font-semibold">Payment Summary</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Type</span>
                <span className="font-medium">{paymentType === "now" ? "Immediate Payment" : 
                  paymentType === "later" ? "Scheduled Payment" : "Recurring Payment"}</span>
              </div>
              {scheduledDate && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Scheduled Date</span>
                  <span className="font-medium">{format(scheduledDate, "PPP")}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">$2,500.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Platform Fee</span>
                <span className="font-medium">$25.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Gateway Fee</span>
                <span className="font-medium">$12.50</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-medium">
                  <span>Total Amount</span>
                  <span>$2,537.50</span>
                </div>
              </div>
              <div className="flex justify-between text-sm text-green-600 bg-green-50 p-2 rounded-md">
                <span>Reward Points to be Earned</span>
                <span>250 points</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleBack} className="flex-1">Back</Button>
            <Button className="flex-1">Confirm Payment</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SinglePaymentForm;
