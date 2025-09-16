
import { ArrowUp, ArrowDown } from "lucide-react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TransactionTableHeaderProps {
  sortColumn: string;
  sortDirection: "asc" | "desc";
  onSort: (column: string) => void;
}

export const TransactionTableHeader = ({
  sortColumn,
  sortDirection,
  onSort
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
          Payment Date
          {sortColumn === "date" && (
            <span className="ml-1">{renderSortIcon("date")}</span>
          )}
        </TableHead>
        <TableHead>Payment Status</TableHead>
        <TableHead>Payment Method</TableHead>
        <TableHead>Description</TableHead>
      </TableRow>
    </TableHeader>
  );
};
