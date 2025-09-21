
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

export interface ActiveFilter {
  type: string;
  value: string;
  label: string;
}

interface AppliedFiltersProps {
  activeFilters: ActiveFilter[];
  dateRange?: DateRange;
  onRemoveFilter: (filter: ActiveFilter) => void;
  onResetFilters: () => void;
}

const AppliedFilters = ({
  activeFilters,
  dateRange,
  onRemoveFilter,
  onResetFilters
}: AppliedFiltersProps) => {
  // Format date range for display
  const getDateRangeText = () => {
    if (!dateRange?.from) return null;
    
    if (dateRange.from && !dateRange.to) {
      return format(dateRange.from, "MMM d, yyyy");
    }
    
    return `${format(dateRange.from, "MMM d, yyyy")} - ${format(
      dateRange.to || dateRange.from,
      "MMM d, yyyy"
    )}`;
  };

  // Don't render component if no filters applied
  if (
    activeFilters.length === 0 ||
    (activeFilters.length === 4 && 
     activeFilters.every(filter => filter.value === "all"))
  ) {
    return null;
  }
  
  return (
    <div className="mb-4">
      <div className="text-sm font-medium text-gray-500 mb-2">Current filters:</div>
      <div className="flex flex-wrap items-center gap-2">
        {/* Display applied filters as badges */}
        {activeFilters
          .filter(filter => filter.value !== "all") // Only show non-default filters
          .map((filter, index) => (
            <Badge 
              key={`${filter.type}-${index}`}
              variant="outline" 
              className="rounded-full py-1 px-3 bg-purple-100 text-purple-800 border-none"
              onClick={() => onRemoveFilter(filter)}
            >
              {filter.label}
            </Badge>
          ))
        }
        
        {/* Show date range if custom dates are selected */}
        {dateRange?.from && (
          <Badge 
            variant="outline" 
            className="rounded-full py-1 px-3 bg-purple-100 text-purple-800 border-none"
            onClick={() => onRemoveFilter({ type: "date", value: "custom", label: "" })}
          >
            {getDateRangeText()}
          </Badge>
        )}
        
        {/* Only show reset button if there are applied filters */}
        {(activeFilters.some(filter => filter.value !== "all") || dateRange?.from) && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-purple-700 hover:text-purple-800 hover:bg-transparent p-0 h-auto font-normal"
            onClick={onResetFilters}
          >
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
};

export default AppliedFilters;
