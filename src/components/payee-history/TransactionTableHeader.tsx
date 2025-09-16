
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
  methodFilter: string[];
  dateFilter: string[];
  dateRange?: DateRange;
  onCategoryChange: (values: string[]) => void;
  onStatusChange: (values: string[]) => void;
  onMethodChange: (values: string[]) => void;
  onDateChange: (values: string[]) => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

export const TransactionTableHeader = ({
  sortColumn,
  sortDirection,
  onSort,
  categoryFilter,
  statusFilter,
  methodFilter,
  dateFilter,
  dateRange,
  onCategoryChange,
  onStatusChange,
  onMethodChange,
  onDateChange,
  onDateRangeChange
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
        <TableHead 
          className="cursor-pointer"
          onClick={() => onSort("date")}
        >
          <div className="flex items-center justify-between">
            <span>Payment Date</span>
            <div className="flex items-center gap-1">
              {sortColumn === "date" && renderSortIcon("date")}
              <ColumnFilter
                type="date"
                selectedValues={dateFilter}
                dateRange={dateRange}
                onSelectionChange={onDateChange}
                onDateRangeChange={onDateRangeChange}
              />
            </div>
          </div>
        </TableHead>
        <TableHead>
          <div className="flex items-center justify-between">
            <span>Payment Status</span>
            <ColumnFilter
              type="status"
              selectedValues={statusFilter}
              onSelectionChange={onStatusChange}
            />
          </div>
        </TableHead>
        <TableHead>
          <div className="flex items-center justify-between">
            <span>Payment Method</span>
            <ColumnFilter
              type="method"
              selectedValues={methodFilter}
              onSelectionChange={onMethodChange}
            />
          </div>
        </TableHead>
        <TableHead>Description</TableHead>
      </TableRow>
    </TableHeader>
  );
};
