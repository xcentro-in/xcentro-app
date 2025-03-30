
import { useState } from "react";
import { CardHeader } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { ActiveFilter } from "@/components/payments/AppliedFilters";
import FilterBar from "@/components/payments/FilterBar";
import AppliedFilters from "@/components/payments/AppliedFilters";

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  
  const hasActiveFilters = activeFilters.some(filter => filter.value !== "all") || appliedDateRange?.from;
  
  return (
    <CardHeader className="pb-2 space-y-4">
      {/* Applied Filters Section - Show at top */}
      {hasActiveFilters && (
        <AppliedFilters 
          activeFilters={activeFilters}
          dateRange={appliedDateRange}
          onRemoveFilter={onRemoveFilter}
          onResetFilters={onResetFilters}
        />
      )}
      
      {/* Collapsible Filter Bar */}
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
        isOpen={isFilterOpen}
        onToggle={toggleFilters}
      />
    </CardHeader>
  );
};

export default FiltersContainer;
