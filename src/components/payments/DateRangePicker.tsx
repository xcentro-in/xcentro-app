
import { Calendar } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

export const DateRangePicker = ({
  dateRange,
  onDateRangeChange
}: DateRangePickerProps) => {
  return (
    <div className="flex-1">
      <Button 
        variant="outline" 
        className="w-full h-10 rounded-lg flex items-center justify-start gap-2"
        asChild
      >
        <div>
          <Calendar className="h-4 w-4" />
          <span className="text-muted-foreground">Select date range</span>
          <DatePickerWithRange
            date={dateRange}
            setDate={onDateRangeChange}
            className="sr-only"
          />
        </div>
      </Button>
    </div>
  );
};
