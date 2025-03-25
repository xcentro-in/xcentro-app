
import { Calendar, Clock, CreditCard } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/payments/DateRangePicker";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { 
  dateFilterOptions, 
  statusFilterOptions, 
  methodFilterOptions, 
  categoryFilterOptions 
} from "@/constants/filterOptions";

interface FilterBarProps {
  dateFilter: string;
  dateRange: DateRange | undefined;
  statusFilter: string;
  methodFilter: string;
  categoryFilter: string;
  showCustomDateRange: boolean;
  filtersChanged: boolean;
  onDateFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onMethodFilterChange: (value: string) => void;
  onCategoryFilterChange: (value: string) => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

const FilterBar = ({
  dateFilter,
  dateRange,
  statusFilter,
  methodFilter,
  categoryFilter,
  showCustomDateRange,
  filtersChanged,
  onDateFilterChange,
  onStatusFilterChange,
  onMethodFilterChange,
  onCategoryFilterChange,
  onDateRangeChange,
  onApplyFilters,
  onResetFilters
}: FilterBarProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Date Filter */}
        <div className="space-y-1">
          <Select value={dateFilter} onValueChange={onDateFilterChange}>
            <SelectTrigger className="w-full h-9">
              <Calendar className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Dates" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              {dateFilterOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Status Filter */}
        <div className="space-y-1">
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-full h-9">
              <Clock className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Statuses" />
            </SelectTrigger>
            <SelectContent>
              {statusFilterOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Payment Method Filter */}
        <div className="space-y-1">
          <Select value={methodFilter} onValueChange={onMethodFilterChange}>
            <SelectTrigger className="w-full h-9">
              <CreditCard className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Methods" />
            </SelectTrigger>
            <SelectContent>
              {methodFilterOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Category Filter */}
        <div className="space-y-1">
          <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
            <SelectTrigger className="w-full h-9">
              <SelectValue placeholder="Categories" />
            </SelectTrigger>
            <SelectContent>
              {categoryFilterOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Custom Date Range Picker - Only show when custom is selected */}
      {showCustomDateRange && (
        <div className="w-full md:w-auto">
          <DateRangePicker 
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
          />
        </div>
      )}
      
      {/* Filter Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onResetFilters}>
          Reset Filters
        </Button>
        <Button 
          disabled={!filtersChanged} 
          onClick={onApplyFilters}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;
