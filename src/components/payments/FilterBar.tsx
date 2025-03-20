
import { Calendar, Clock, CreditCard } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/payments/DateRangePicker";
import { DateRange } from "react-day-picker";

interface FilterBarProps {
  dateFilter: string;
  dateRange: DateRange | undefined;
  statusFilter: string;
  methodFilter: string;
  categoryFilter: string;
  itemsPerPage: number;
  showCustomDateRange: boolean;
  onDateFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onMethodFilterChange: (value: string) => void;
  onCategoryFilterChange: (value: string) => void;
  onItemsPerPageChange: (value: number) => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

// Options for filters
const dateFilterOptions = [
  { label: "Last 7 Days", value: "7days" },
  { label: "Last 30 Days", value: "30days" },
  { label: "Last Quarter", value: "quarter" },
  { label: "Custom Range", value: "custom" },
];

const statusFilterOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Failed", value: "failed" },
];

const methodFilterOptions = [
  { label: "All Methods", value: "all" },
  { label: "Credit Card", value: "credit" },
  { label: "Bank Transfer", value: "bank" },
];

const categoryFilterOptions = [
  { label: "All Categories", value: "all" },
  { label: "Vendor", value: "vendor" },
  { label: "Supplier", value: "supplier" },
  { label: "Biller", value: "biller" },
  { label: "Payroll", value: "payroll" },
];

const FilterBar = ({
  dateFilter,
  dateRange,
  statusFilter,
  methodFilter,
  categoryFilter,
  itemsPerPage,
  showCustomDateRange,
  onDateFilterChange,
  onStatusFilterChange,
  onMethodFilterChange,
  onCategoryFilterChange,
  onItemsPerPageChange,
  onDateRangeChange
}: FilterBarProps) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Date Filter */}
      <Select value={dateFilter} onValueChange={onDateFilterChange}>
        <SelectTrigger className="w-[140px] h-9">
          <Calendar className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
          <SelectValue placeholder="Dates" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Dates</SelectItem>
          {dateFilterOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Custom Date Range Picker - Only show when custom is selected */}
      {showCustomDateRange && (
        <div className="min-w-[300px]">
          <DateRangePicker 
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
          />
        </div>
      )}
      
      {/* Status Filter */}
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-[150px] h-9">
          <Clock className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
          <SelectValue placeholder="Statuses" />
        </SelectTrigger>
        <SelectContent>
          {statusFilterOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Payment Method Filter */}
      <Select value={methodFilter} onValueChange={onMethodFilterChange}>
        <SelectTrigger className="w-[150px] h-9">
          <CreditCard className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
          <SelectValue placeholder="Methods" />
        </SelectTrigger>
        <SelectContent>
          {methodFilterOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Category Filter */}
      <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
        <SelectTrigger className="w-[150px] h-9">
          <SelectValue placeholder="Categories" />
        </SelectTrigger>
        <SelectContent>
          {categoryFilterOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Items per page */}
      <div className="ml-auto flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Number of rows per page:</span>
        <Select 
          value={String(itemsPerPage)} 
          onValueChange={(value) => onItemsPerPageChange(Number(value))}
        >
          <SelectTrigger className="w-[80px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilterBar;
