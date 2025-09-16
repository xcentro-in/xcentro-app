import SortIndicator from "./SortIndicator";
import { ColumnFilter } from "./ColumnFilter";
import { DateRange } from "react-day-picker";

interface TableHeaderProps {
  sortField: string | null;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
  categoryFilter: string[];
  statusFilter: string[];
  dateFilter: string[];
  dateRange?: DateRange;
  onCategoryFilterChange: (values: string[]) => void;
  onStatusFilterChange: (values: string[]) => void;
  onDateFilterChange: (values: string[]) => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

const TableHeader = ({ 
  sortField, 
  sortDirection, 
  onSort, 
  categoryFilter,
  statusFilter,
  dateFilter,
  dateRange,
  onCategoryFilterChange,
  onStatusFilterChange,
  onDateFilterChange,
  onDateRangeChange
}: TableHeaderProps) => {
  return (
    <div className="grid grid-cols-[1.5fr_1fr_0.8fr_0.8fr_0.8fr] gap-4 p-4 bg-muted/50 text-sm font-medium">
      <div 
        className="flex items-center gap-1 cursor-pointer"
        onClick={() => onSort("vendor")}
      >
        Payee Name
        <SortIndicator field="vendor" sortField={sortField} sortDirection={sortDirection} />
      </div>
      <div className="flex items-center gap-1">
        <div 
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => onSort("date")}
        >
          Date & Time
          <SortIndicator field="date" sortField={sortField} sortDirection={sortDirection} />
        </div>
        <ColumnFilter
          type="date"
          selectedValues={dateFilter}
          dateRange={dateRange}
          onSelectionChange={onDateFilterChange}
          onDateRangeChange={onDateRangeChange}
        />
      </div>
      <div 
        className="flex items-center gap-1 cursor-pointer justify-end"
        onClick={() => onSort("amount")}
      >
        Amount
        <SortIndicator field="amount" sortField={sortField} sortDirection={sortDirection} />
      </div>
      <div className="flex items-center justify-center gap-1">
        Category
        <ColumnFilter
          type="category"
          selectedValues={categoryFilter}
          onSelectionChange={onCategoryFilterChange}
        />
      </div>
      <div className="flex items-center justify-center gap-1">
        Status
        <ColumnFilter
          type="status"
          selectedValues={statusFilter}
          onSelectionChange={onStatusFilterChange}
        />
      </div>
    </div>
  );
};

export default TableHeader;
