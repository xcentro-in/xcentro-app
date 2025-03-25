
import { useState, useEffect } from "react";
import { subDays, startOfQuarter, endOfDay } from "date-fns";
import { DateRange } from "react-day-picker";
import { ActiveFilter } from "@/components/payments/AppliedFilters";

// Options for filters
export const dateFilterOptions = [
  { label: "Last 7 Days", value: "7days" },
  { label: "Last 30 Days", value: "30days" },
  { label: "Last Quarter", value: "quarter" },
  { label: "Custom Range", value: "custom" },
];

export const statusFilterOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Failed", value: "failed" },
];

export const methodFilterOptions = [
  { label: "All Methods", value: "all" },
  { label: "Credit Card", value: "credit" },
  { label: "Bank Transfer", value: "bank" },
];

export const categoryFilterOptions = [
  { label: "All Categories", value: "all" },
  { label: "Vendor", value: "vendor" },
  { label: "Supplier", value: "supplier" },
  { label: "Biller", value: "biller" },
  { label: "Payroll", value: "payroll" },
];

export interface PaymentFiltersState {
  dateFilter: string;
  dateRange: DateRange | undefined;
  statusFilter: string;
  methodFilter: string;
  categoryFilter: string;
  showCustomDateRange: boolean;
  filtersChanged: boolean;
  appliedDateFilter: string;
  appliedStatusFilter: string;
  appliedMethodFilter: string;
  appliedCategoryFilter: string;
  appliedDateRange: DateRange | undefined;
  activeFilters: ActiveFilter[];
}

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
    const today = new Date();
    let from: Date | undefined;
    let to: Date | undefined = today;
    let showDatePicker = false;

    switch (filter) {
      case "7days":
        from = subDays(today, 7);
        break;
      case "30days":
        from = subDays(today, 30);
        break;
      case "quarter":
        from = startOfQuarter(today);
        break;
      case "custom":
        showDatePicker = true;
        if (!state.dateRange?.from) {
          from = subDays(today, 7);
        } else {
          from = state.dateRange.from;
          to = state.dateRange.to || today;
        }
        break;
      case "all":
        from = undefined;
        to = undefined;
        break;
      default:
        from = subDays(today, 7);
    }

    setState(prev => ({
      ...prev,
      dateRange: { from, to },
      showCustomDateRange: showDatePicker
    }));
  };

  // Apply filters
  const applyFilters = () => {
    // Update the applied filter states
    setState(prev => ({
      ...prev,
      appliedDateFilter: prev.dateFilter,
      appliedStatusFilter: prev.statusFilter,
      appliedMethodFilter: prev.methodFilter,
      appliedCategoryFilter: prev.categoryFilter,
      appliedDateRange: prev.dateRange,
      filtersChanged: false
    }));
    
    // Update active filters
    const updatedFilters = [...state.activeFilters];
    
    // Update date filter
    const dateFilterOption = dateFilterOptions.find(option => option.value === state.dateFilter);
    if (dateFilterOption) {
      const existingDateIndex = updatedFilters.findIndex(filter => filter.type === "date");
      if (existingDateIndex >= 0) {
        updatedFilters[existingDateIndex] = { type: "date", value: state.dateFilter, label: dateFilterOption.label };
      } else {
        updatedFilters.push({ type: "date", value: state.dateFilter, label: dateFilterOption.label });
      }
    }
    
    // Update status filter
    const statusFilterOption = statusFilterOptions.find(option => option.value === state.statusFilter);
    if (statusFilterOption) {
      const existingStatusIndex = updatedFilters.findIndex(filter => filter.type === "status");
      if (existingStatusIndex >= 0) {
        updatedFilters[existingStatusIndex] = { type: "status", value: state.statusFilter, label: statusFilterOption.label };
      } else {
        updatedFilters.push({ type: "status", value: state.statusFilter, label: statusFilterOption.label });
      }
    }
    
    // Update method filter
    const methodFilterOption = methodFilterOptions.find(option => option.value === state.methodFilter);
    if (methodFilterOption) {
      const existingMethodIndex = updatedFilters.findIndex(filter => filter.type === "method");
      if (existingMethodIndex >= 0) {
        updatedFilters[existingMethodIndex] = { type: "method", value: state.methodFilter, label: methodFilterOption.label };
      } else {
        updatedFilters.push({ type: "method", value: state.methodFilter, label: methodFilterOption.label });
      }
    }
    
    // Update category filter
    const categoryFilterOption = categoryFilterOptions.find(option => option.value === state.categoryFilter);
    if (categoryFilterOption) {
      const existingCategoryIndex = updatedFilters.findIndex(filter => filter.type === "category");
      if (existingCategoryIndex >= 0) {
        updatedFilters[existingCategoryIndex] = { type: "category", value: state.categoryFilter, label: categoryFilterOption.label };
      } else {
        updatedFilters.push({ type: "category", value: state.categoryFilter, label: categoryFilterOption.label });
      }
    }
    
    setState(prev => ({
      ...prev,
      activeFilters: updatedFilters
    }));
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
    const defaultValue = "all";
    const updatedFilters = state.activeFilters.filter(filter => 
      !(filter.type === filterToRemove.type && filter.value === filterToRemove.value)
    );
    
    // Add default filter if not present
    if (!updatedFilters.some(filter => filter.type === filterToRemove.type)) {
      let defaultLabel = "All";
      
      switch (filterToRemove.type) {
        case "date":
          defaultLabel = "All Dates";
          break;
        case "status":
          defaultLabel = "All Statuses";
          break;
        case "method":
          defaultLabel = "All Methods";
          break;
        case "category":
          defaultLabel = "All Categories";
          break;
      }
      
      updatedFilters.push({
        type: filterToRemove.type,
        value: defaultValue,
        label: defaultLabel
      });
    }
    
    setState(prev => ({
      ...prev,
      activeFilters: updatedFilters
    }));
    
    // Reset the corresponding filter state
    switch (filterToRemove.type) {
      case "date":
        setState(prev => ({
          ...prev,
          dateFilter: defaultValue,
          appliedDateFilter: defaultValue,
          dateRange: undefined,
          appliedDateRange: undefined,
          showCustomDateRange: false,
        }));
        break;
      case "status":
        setState(prev => ({
          ...prev,
          statusFilter: defaultValue,
          appliedStatusFilter: defaultValue
        }));
        break;
      case "method":
        setState(prev => ({
          ...prev,
          methodFilter: defaultValue,
          appliedMethodFilter: defaultValue
        }));
        break;
      case "category":
        setState(prev => ({
          ...prev,
          categoryFilter: defaultValue,
          appliedCategoryFilter: defaultValue
        }));
        break;
      default:
        break;
    }
  };
  
  // Reset to default filters
  const resetToDefaultFilters = () => {
    const defaultDateFilter = "7days";
    
    setState({
      dateFilter: defaultDateFilter,
      appliedDateFilter: defaultDateFilter,
      dateRange: {
        from: subDays(new Date(), 7),
        to: new Date()
      },
      statusFilter: "all",
      appliedStatusFilter: "all",
      methodFilter: "all",
      appliedMethodFilter: "all",
      categoryFilter: "all",
      appliedCategoryFilter: "all",
      showCustomDateRange: false,
      filtersChanged: false,
      appliedDateRange: {
        from: subDays(new Date(), 7),
        to: new Date()
      },
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
