
import { Calendar, Clock, CreditCard, ChevronUp, ChevronDown } from "lucide-react";
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  isOpen: boolean;
  onToggle: () => void;
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
  onResetFilters,
  isOpen,
  onToggle
}: FilterBarProps) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle} className="w-full">
      <div className="flex items-center justify-between py-3">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="text-purple-700 hover:text-purple-800 hover:bg-transparent p-0 flex items-center gap-2 font-medium">
            <span>Edit filters</span> 
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        
        {/* Removed the Apply Filters button that was here */}
      </div>
      
      <CollapsibleContent className="pt-4 pb-3 space-y-4 border-t mt-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Date Filter */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Date Range</label>
            <Select value={dateFilter} onValueChange={onDateFilterChange}>
              <SelectTrigger className="w-full">
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
          
          {/* Category Filter */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Category</label>
            <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Categories" />
              </SelectTrigger>
              <SelectContent>
                {categoryFilterOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Status Filter */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Status</label>
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Statuses" />
              </SelectTrigger>
              <SelectContent>
                {statusFilterOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Custom Date Range Picker - Only show when custom is selected */}
        {showCustomDateRange && (
          <div className="w-full">
            <DateRangePicker 
              dateRange={dateRange}
              onDateRangeChange={onDateRangeChange}
            />
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onResetFilters}>
            Reset Filters
          </Button>
          <Button 
            disabled={!filtersChanged} 
            onClick={onApplyFilters}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Apply Filters
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default FilterBar;
