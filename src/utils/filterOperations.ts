
import { ActiveFilter } from "@/components/payments/payee-management/filters/AppliedFilters";
import { PaymentFiltersState } from "@/types/paymentFilters";
import { 
  dateFilterOptions, 
  statusFilterOptions, 
  methodFilterOptions, 
  categoryFilterOptions 
} from "@/constants/filterOptions";

export const updateActiveFilters = (state: PaymentFiltersState): ActiveFilter[] => {
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
  
  return updatedFilters;
};

export const handleRemoveFilter = (
  filterToRemove: ActiveFilter, 
  activeFilters: ActiveFilter[]
): {
  updatedFilters: ActiveFilter[];
  defaultValue: string;
  filterType: string;
} => {
  const defaultValue = "all";
  const updatedFilters = activeFilters.filter(filter => 
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
  
  return {
    updatedFilters,
    defaultValue,
    filterType: filterToRemove.type
  };
};
