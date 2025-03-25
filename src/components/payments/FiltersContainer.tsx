
import { Filter } from "lucide-react";
import { CardHeader } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { ActiveFilter } from "@/components/payments/AppliedFilters";
import FilterBar from "@/components/payments/FilterBar";
import AppliedFilters from "@/components/payments/AppliedFilters";
import { Separator } from "@/components/ui/separator";

interface FiltersContainerProps {
  dateFilter: string;
  dateRange: DateRange | undefined;
  statusFilter: string;
  methodFilter: string;
  categoryFilter: string;
  showCustomDateRange: boolean;
  filtersChanged: boolean;
  activeFilters: ActiveFilter[];
  appliedDateRange: DateRange | undefined;
  onDateFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onMethodFilterChange: (value: string) => void;
  onCategoryFilterChange: (value: string) => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  onRemoveFilter: (filter: ActiveFilter) => void;
}

const FiltersContainer = ({
  dateFilter,
  dateRange,
  statusFilter,
  methodFilter,
  categoryFilter,
  showCustomDateRange,
  filtersChanged,
  activeFilters,
  appliedDateRange,
  onDateFilterChange,
  onStatusFilterChange,
  onMethodFilterChange,
  onCategoryFilterChange,
  onDateRangeChange,
  onApplyFilters,
  onResetFilters,
  onRemoveFilter
}: FiltersContainerProps) => {
  return (
    <div className="border-b pb-4">
      <CardHeader className="pb-2 space-y-4">
        <div className="flex items-center space-x-2 text-lg font-semibold text-foreground mb-1">
          <Filter className="h-5 w-5" />
          <span>Filters</span>
        </div>
        
        {/* Horizontal Filter Bar */}
        <FilterBar 
          dateFilter={dateFilter}
          dateRange={dateRange}
          statusFilter={statusFilter}
          methodFilter={methodFilter}
          categoryFilter={categoryFilter}
          showCustomDateRange={showCustomDateRange}
          filtersChanged={filtersChanged}
          onDateFilterChange={onDateFilterChange}
          onStatusFilterChange={onStatusFilterChange}
          onMethodFilterChange={onMethodFilterChange}
          onCategoryFilterChange={onCategoryFilterChange}
          onDateRangeChange={onDateRangeChange}
          onApplyFilters={onApplyFilters}
          onResetFilters={onResetFilters}
        />
        
        {/* Applied Filters Section */}
        <AppliedFilters 
          activeFilters={activeFilters}
          dateRange={appliedDateRange}
          onRemoveFilter={onRemoveFilter}
          onResetFilters={onResetFilters}
        />
      </CardHeader>
    </div>
  );
};

export default FiltersContainer;
