
import { ArrowUp, ArrowDown } from "lucide-react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnFilter } from "@/components/payments/ColumnFilter";
import { DateRange } from "react-day-picker";

interface TransactionTableHeaderProps {
  sortColumn: string;
  sortDirection: "asc" | "desc";
  onSort: (column: string) => void;
  categoryFilter: string[];
  statusFilter: string[];
  dateFilter: string[];
  dateRange?: DateRange;
  methodFilter?: string[];
  onCategoryFilterChange: (values: string[]) => void;
  onStatusFilterChange: (values: string[]) => void;
  onDateFilterChange: (values: string[]) => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onMethodFilterChange?: (values: string[]) => void;
}

export const TransactionTableHeader = ({
  sortColumn,
  sortDirection,
  onSort,
  categoryFilter,
  statusFilter,
  dateFilter,
  dateRange,
  methodFilter,
  onCategoryFilterChange,
  onStatusFilterChange,
  onDateFilterChange,
  onDateRangeChange,
  onMethodFilterChange
}: TransactionTableHeaderProps) => {
  const renderSortIcon = (column: string) => {
    if (sortColumn === column) {
      return sortDirection === "asc" ? 
        <ArrowUp className="inline h-3 w-3" /> : 
        <ArrowDown className="inline h-3 w-3" />;
    }
    return null;
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead 
          className="cursor-pointer"
          onClick={() => onSort("invoice")}
        >
          Invoice/Reference
          {sortColumn === "invoice" && (
            <span className="ml-1">{renderSortIcon("invoice")}</span>
          )}
        </TableHead>
        <TableHead 
          className="cursor-pointer text-right"
          onClick={() => onSort("amount")}
        >
          Amount
          {sortColumn === "amount" && (
            <span className="ml-1">{renderSortIcon("amount")}</span>
          )}
        </TableHead>
        <TableHead>
          <div className="flex items-center justify-between">
            <span>Payment Date</span>
            <ColumnFilter
              type="date"
              selectedValues={dateFilter}
              dateRange={dateRange}
              onSelectionChange={onDateFilterChange}
              onDateRangeChange={onDateRangeChange}
            />
          </div>
        </TableHead>
        <TableHead>
          <div className="flex items-center justify-between">
            <span>Payment Status</span>
            <ColumnFilter
              type="status"
              selectedValues={statusFilter}
              onSelectionChange={onStatusFilterChange}
            />
          </div>
        </TableHead>
        <TableHead>
          <div className="flex items-center justify-between">
            <span>Payment Method</span>
            {methodFilter && onMethodFilterChange && (
              <ColumnFilter
                type="method"
                selectedValues={methodFilter}
                onSelectionChange={onMethodFilterChange}
              />
            )}
          </div>
        </TableHead>
        <TableHead>Description</TableHead>
      </TableRow>
    </TableHeader>
  );
};
