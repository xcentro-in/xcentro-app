
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/payments/DateRangePicker";
import { DateRange } from "react-day-picker";

interface RedemptionFiltersProps {
  searchTerm: string;
  filterType: string;
  dateRange: DateRange | undefined;
  onSearchTermChange: (value: string) => void;
  onFilterTypeChange: (value: string) => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

export const RedemptionFilters = ({
  searchTerm,
  filterType,
  dateRange,
  onSearchTermChange,
  onFilterTypeChange,
  onDateRangeChange
}: RedemptionFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by partner or reference ID..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <Select value={filterType} onValueChange={onFilterTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Flight">Flight</SelectItem>
            <SelectItem value="Hotel">Hotel</SelectItem>
            <SelectItem value="Gift Card">Gift Card</SelectItem>
            <SelectItem value="Transfer">Transfer</SelectItem>
          </SelectContent>
        </Select>
        
        <DateRangePicker
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
          className="w-auto"
        />
      </div>
    </div>
  );
};
