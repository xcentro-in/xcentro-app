
import { Info, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
    <div className="flex flex-wrap items-center gap-2 mt-2 mb-1">
      <div className="flex items-center mr-1">
        <span className="text-sm font-medium mr-2">Applied Filters:</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-xs">
                These filters are currently applied to your transactions.
                Click the X on any filter to remove it.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {/* Display applied filters as badges */}
        {activeFilters
          .filter(filter => filter.value !== "all") // Only show non-default filters
          .map((filter, index) => (
            <Badge 
              key={`${filter.type}-${index}`}
              variant="outline" 
              className="pl-2 pr-1 py-1 h-7 bg-muted/30"
            >
              <span className="text-xs">{filter.label}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 ml-1"
                onClick={() => onRemoveFilter(filter)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {filter.label} filter</span>
              </Button>
            </Badge>
          ))
        }
        
        {/* Show date range if custom dates are selected */}
        {dateRange?.from && (
          <Badge 
            variant="outline" 
            className="pl-2 pr-1 py-1 h-7 bg-muted/30"
          >
            <span className="text-xs">{getDateRangeText()}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 ml-1"
              onClick={() => onRemoveFilter({ type: "date", value: "custom", label: "" })}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove date range filter</span>
            </Button>
          </Badge>
        )}
        
        {/* Only show reset button if there are applied filters */}
        {(activeFilters.some(filter => filter.value !== "all") || dateRange?.from) && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-xs"
            onClick={onResetFilters}
          >
            Reset All
          </Button>
        )}
      </div>
    </div>
  );
};

export default AppliedFilters;
