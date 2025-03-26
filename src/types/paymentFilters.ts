
import { DateRange } from "react-day-picker";
import { ActiveFilter } from "@/components/payments/AppliedFilters";

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
