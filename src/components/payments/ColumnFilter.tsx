import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

interface ColumnFilterProps {
  type: "category" | "status" | "date" | "method";
  selectedValues: string[];
  dateRange?: DateRange;
  onSelectionChange: (values: string[]) => void;
  onDateRangeChange?: (range: DateRange | undefined) => void;
}

const filterOptions = {
  category: [
    { value: "vendor", label: "Vendor" },
    { value: "supplier", label: "Supplier" },
    { value: "biller", label: "Biller" },
    { value: "payroll", label: "Payroll" }
  ],
  status: [
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
    { value: "upcoming", label: "Upcoming" },
    { value: "failed", label: "Failed" }
  ],
  date: [
    { value: "7days", label: "Last 7 Days" },
    { value: "30days", label: "Last 30 Days" },
    { value: "quarter", label: "Last Quarter" },
    { value: "custom", label: "Custom Range" }
  ],
  method: [
    { value: "upi", label: "UPI" },
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "credit_card", label: "Credit Card" },
    { value: "debit_card", label: "Debit Card" }
  ]
};

export const ColumnFilter = ({ 
  type, 
  selectedValues, 
  dateRange,
  onSelectionChange,
  onDateRangeChange 
}: ColumnFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(type === "date" && selectedValues.includes("custom"));

  const options = filterOptions[type];
  const hasActiveFilters = type === "date" 
    ? !selectedValues.includes("7days") || selectedValues.length !== 1
    : selectedValues.length !== options.length;

  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (type === "date") {
      if (value === "custom") {
        if (checked) {
          setShowDatePicker(true);
          onSelectionChange(["custom"]);
        } else {
          setShowDatePicker(false);
          onSelectionChange(["7days"]);
        }
      } else {
        // Radio-like behavior for date filters
        if (checked) {
          setShowDatePicker(false);
          onSelectionChange([value]);
        } else {
          // Prevent none state
          onSelectionChange(["7days"]);
        }
      }
      return;
    }

    const newSelection = checked
      ? [...selectedValues, value]
      : selectedValues.filter(v => v !== value);
    
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    if (type === "date") {
      onSelectionChange(["7days"]);
      setShowDatePicker(false);
    } else {
      onSelectionChange(options.map(opt => opt.value));
    }
  };

  const handleClearAll = () => {
    if (type === "date") {
      onSelectionChange(["7days"]);
      setShowDatePicker(false);
    } else {
      onSelectionChange([]);
    }
  };

  const expanded = type === "date" && showDatePicker && selectedValues.includes("custom");

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-6 w-6 p-0 hover:bg-muted ${hasActiveFilters ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <Filter className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`${expanded ? "w-[720px]" : "w-56"} p-0 z-50`} align="start">
        <div className={`flex ${expanded ? "" : ""}`}>
          {/* Left column: options */}
          <div className={`${expanded ? "w-56 border-r" : "w-full"} p-3`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium">Filter {type}</h4>
              {type !== "date" && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={handleSelectAll}
                  >
                    All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={handleClearAll}
                  >
                    None
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.value}
                    checked={selectedValues.includes(option.value)}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange(option.value, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={option.value}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Right column: date range picker */}
          {expanded && (
            <div className="flex-1 p-3">
              <div className="text-xs text-muted-foreground mb-2">Select date range:</div>
              <CalendarComponent
                mode="range"
                selected={dateRange}
                onSelect={onDateRangeChange}
                numberOfMonths={2}
                className="rounded-md border p-3 pointer-events-auto"
              />
              {dateRange?.from && (
                <div className="text-xs text-muted-foreground mt-2">
                  {format(dateRange.from, "PPP")} {dateRange.to && `- ${format(dateRange.to, "PPP")}`}
                </div>
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};