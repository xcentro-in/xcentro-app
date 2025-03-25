
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Payment Status Filter */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Payment Status</div>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-full h-10 rounded-lg">
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
        <div className="space-y-2">
          <div className="text-sm font-medium">Payment Method</div>
          <Select value={methodFilter} onValueChange={onMethodFilterChange}>
            <SelectTrigger className="w-full h-10 rounded-lg">
              <SelectValue placeholder="Methods" />
            </SelectTrigger>
            <SelectContent>
              {methodFilterOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Date Range Filter */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Date Range</div>
          <div className="flex gap-2">
            <Select value={dateFilter} onValueChange={onDateFilterChange}>
              <SelectTrigger className="w-full h-10 rounded-lg">
                <SelectValue placeholder="Dates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                {dateFilterOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {showCustomDateRange && (
              <DateRangePicker 
                dateRange={dateRange}
                onDateRangeChange={onDateRangeChange}
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Category Filter - Now in its own row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="text-sm font-medium">Category</div>
          <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
            <SelectTrigger className="w-full h-10 rounded-lg">
              <SelectValue placeholder="Categories" />
            </SelectTrigger>
            <SelectContent>
              {categoryFilterOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Empty div for spacing */}
        <div className="hidden md:block"></div>
        
        {/* Filter Action Buttons */}
        <div className="flex justify-end gap-4 items-end">
          <Button 
            variant="outline" 
            onClick={onResetFilters}
            className="h-10 px-6 rounded-lg"
          >
            Reset
          </Button>
          <Button 
            disabled={!filtersChanged} 
            onClick={onApplyFilters}
            className="h-10 px-6 rounded-lg bg-blue-500 hover:bg-blue-600"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
