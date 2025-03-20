
import { Info, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

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
  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      <div className="flex items-center gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>If a filter is removed, the default value 'All' will be applied</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <span className="text-sm text-muted-foreground">Applied filters:</span>
      </div>
      
      {activeFilters.map((filter, index) => (
        <Badge 
          key={`${filter.type}-${index}`} 
          variant="outline" 
          className="flex items-center gap-1 pl-2"
        >
          {filter.type === "date" && dateRange?.from && dateRange?.to && filter.value === "custom" 
            ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}` 
            : filter.label}
          <button 
            className="ml-1 rounded-full hover:bg-muted"
            onClick={() => onRemoveFilter(filter)}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      
      {activeFilters.length > 0 && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 text-xs"
          onClick={onResetFilters}
        >
          Reset to defaults
        </Button>
      )}
    </div>
  );
};

export default AppliedFilters;
