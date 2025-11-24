
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getMonthsOptions } from "@/utils/calendarUtils";

interface MonthSelectorProps {
  selectedMonth: string;
  onMonthSelect: (value: string) => void;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({ 
  selectedMonth, 
  onMonthSelect 
}) => {
  return (
    <div className="w-[180px]">
      <Select value={selectedMonth} onValueChange={onMonthSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Select Month" />
        </SelectTrigger>
        <SelectContent>
          {getMonthsOptions().map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MonthSelector;
