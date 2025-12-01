import { format, addHours, isBefore, setHours, setMinutes } from "date-fns";
import { Zap, Clock, Calendar } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PaymentType } from "@/types/payments";

interface PaymentScheduleSelectorProps {
  paymentType: PaymentType;
  scheduledDate?: Date;
  frequency: string;
  onPaymentTypeChange: (value: PaymentType) => void;
  onScheduledDateChange: (date?: Date) => void;
  onFrequencyChange: (value: string) => void;
}

const PaymentScheduleSelector = ({
  paymentType,
  onPaymentTypeChange,
}: PaymentScheduleSelectorProps) => {
  // Calculate settlement times
  const calculateTodayTime = () => {
    const now = new Date();
    const fourHoursLater = addHours(now, 4);
    const elevenThirtyPM = setMinutes(setHours(new Date(), 23), 30);

    // If 4 hours from now is before 11:30 PM, use it; otherwise cap at 11:30 PM
    const settlementTime = isBefore(fourHoursLater, elevenThirtyPM)
      ? fourHoursLater
      : elevenThirtyPM;

    return format(settlementTime, "MMM dd, h:mm a");
  };

  const calculateTomorrowTime = () => {
    const twentyFourHoursLater = addHours(new Date(), 24);
    return format(twentyFourHoursLater, "MMM dd, h:mm a");
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground">Choose when funds reach your payee</p>
      </div>

      <RadioGroup
        value={paymentType}
        onValueChange={(value: PaymentType) => onPaymentTypeChange(value)}
        className="space-y-3"
      >
        {/* Tomorrow */}
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="tomorrow" id="pay-tomorrow" />
          <Label htmlFor="pay-tomorrow" className="cursor-pointer flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <span className="font-medium">Tomorrow</span>
              <p className="text-xs text-muted-foreground">{calculateTomorrowTime()}</p>
            </div>
          </Label>
        </div>

        {/* Today */}
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="today" id="pay-today" />
          <Label htmlFor="pay-today" className="cursor-pointer flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <span className="font-medium">Today</span>
              <p className="text-xs text-muted-foreground">{calculateTodayTime()}</p>
            </div>
          </Label>
        </div>

        {/* Instantly */}
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="instantly" id="pay-instantly" />
          <Label htmlFor="pay-instantly" className="cursor-pointer flex items-center gap-2">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <div>
              <span className="font-medium">Instantly</span>
              <p className="text-xs text-muted-foreground">Within few minutes</p>
            </div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default PaymentScheduleSelector;
