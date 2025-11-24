
import { useState, useEffect } from "react";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { ActiveFilter } from "@/components/payments/payee-management/filters/AppliedFilters";
import { PaymentFiltersState } from "@/types/paymentFilters";
import { getDateRangeFromFilter } from "@/utils/dateFilterUtils";
import { updateActiveFilters, handleRemoveFilter } from "@/utils/filterOperations";
import { 
  dateFilterOptions, 
  statusFilterOptions, 
  methodFilterOptions, 
  categoryFilterOptions 
} from "@/constants/filterOptions";

export { 
  dateFilterOptions, 
  statusFilterOptions, 
  methodFilterOptions, 
  categoryFilterOptions 
};

export const usePaymentFilters = () => {
  const [state, setState] = useState<PaymentFiltersState>({
    dateFilter: "7days",
    dateRange: {
      from: subDays(new Date(), 7),
      to: new Date()
    },
    statusFilter: "all",
    methodFilter: "all",
    categoryFilter: "all",
    showCustomDateRange: false,
    filtersChanged: false,
    appliedDateFilter: "7days",
    appliedStatusFilter: "all",
    appliedMethodFilter: "all",
    appliedCategoryFilter: "all",
    appliedDateRange: {
      from: subDays(new Date(), 7),
      to: new Date()
    },
    activeFilters: [
      { type: "date", value: "7days", label: "Last 7 Days" },
      { type: "status", value: "all", label: "All Statuses" },
      { type: "method", value: "all", label: "All Methods" },
      { type: "category", value: "all", label: "All Categories" }
    ]
  });

  // Initialize default date range based on the dateFilter
  useEffect(() => {
    updateDateRangeFromFilter(state.dateFilter);
  }, []);

  // Check if filters have changed from applied state
  useEffect(() => {
    if (state.dateFilter !== state.appliedDateFilter || 
        state.statusFilter !== state.appliedStatusFilter || 
        state.methodFilter !== state.appliedMethodFilter || 
        state.categoryFilter !== state.appliedCategoryFilter ||
        JSON.stringify(state.dateRange) !== JSON.stringify(state.appliedDateRange)) {
      setState(prev => ({ ...prev, filtersChanged: true }));
    } else {
      setState(prev => ({ ...prev, filtersChanged: false }));
    }
  }, [state.dateFilter, state.statusFilter, state.methodFilter, state.categoryFilter, state.dateRange, 
      state.appliedDateFilter, state.appliedStatusFilter, state.appliedMethodFilter, state.appliedCategoryFilter, state.appliedDateRange]);

  const updateDateRangeFromFilter = (filter: string) => {
    const { dateRange, showCustomDateRange } = getDateRangeFromFilter(filter, state.dateRange);
    setState(prev => ({
      ...prev,
      dateRange,
      showCustomDateRange
    }));
  };

  // Apply filters
  const applyFilters = () => {
    // Update the applied filter states
    setState(prev => {
      const updatedFilters = updateActiveFilters(prev);
      
      return {
        ...prev,
        appliedDateFilter: prev.dateFilter,
        appliedStatusFilter: prev.statusFilter,
        appliedMethodFilter: prev.methodFilter,
        appliedCategoryFilter: prev.categoryFilter,
        appliedDateRange: prev.dateRange,
        filtersChanged: false,
        activeFilters: updatedFilters
      };
    });
  };

  // Handle filter changes
  const handleDateFilterChange = (value: string) => {
    setState(prev => ({ ...prev, dateFilter: value }));
    updateDateRangeFromFilter(value);
  };

  const handleStatusFilterChange = (value: string) => {
    setState(prev => ({ ...prev, statusFilter: value }));
  };

  const handleMethodFilterChange = (value: string) => {
    setState(prev => ({ ...prev, methodFilter: value }));
  };

  const handleCategoryFilterChange = (value: string) => {
    setState(prev => ({ ...prev, categoryFilter: value }));
  };
  
  // Handle removing a filter
  const removeFilter = (filterToRemove: ActiveFilter) => {
    const { updatedFilters, defaultValue, filterType } = handleRemoveFilter(filterToRemove, state.activeFilters);
    
    setState(prev => {
      const newState = { ...prev, activeFilters: updatedFilters };
      
      // Reset the corresponding filter state
      switch (filterType) {
        case "date":
          newState.dateFilter = defaultValue;
          newState.appliedDateFilter = defaultValue;
          newState.dateRange = undefined;
          newState.appliedDateRange = undefined;
          newState.showCustomDateRange = false;
          break;
        case "status":
          newState.statusFilter = defaultValue;
          newState.appliedStatusFilter = defaultValue;
          break;
        case "method":
          newState.methodFilter = defaultValue;
          newState.appliedMethodFilter = defaultValue;
          break;
        case "category":
          newState.categoryFilter = defaultValue;
          newState.appliedCategoryFilter = defaultValue;
          break;
      }
      
      return newState;
    });
  };
  
  // Reset to default filters
  const resetToDefaultFilters = () => {
    const defaultDateFilter = "7days";
    const defaultDateRange = {
      from: subDays(new Date(), 7),
      to: new Date()
    };
    
    setState({
      dateFilter: defaultDateFilter,
      appliedDateFilter: defaultDateFilter,
      dateRange: defaultDateRange,
      statusFilter: "all",
      appliedStatusFilter: "all",
      methodFilter: "all",
      appliedMethodFilter: "all",
      categoryFilter: "all",
      appliedCategoryFilter: "all",
      showCustomDateRange: false,
      filtersChanged: false,
      appliedDateRange: defaultDateRange,
      activeFilters: [
        { type: "date", value: defaultDateFilter, label: "Last 7 Days" },
        { type: "status", value: "all", label: "All Statuses" },
        { type: "method", value: "all", label: "All Methods" },
        { type: "category", value: "all", label: "All Categories" }
      ]
    });
  };
  
  // Handle date range change
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setState(prev => ({ ...prev, dateRange: range }));
  };

  return {
    ...state,
    applyFilters,
    handleDateFilterChange,
    handleStatusFilterChange,
    handleMethodFilterChange,
    handleCategoryFilterChange,
    removeFilter,
    resetToDefaultFilters,
    handleDateRangeChange
  };
};
