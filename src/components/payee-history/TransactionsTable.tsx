
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableRow
} from "@/components/ui/table";
import { Transaction } from "@/types/transaction";

// Import components
import { TableSearchBar } from "./TableSearchBar";
import { TransactionTableHeader } from "./TransactionTableHeader";
import { TransactionTableRow } from "./TransactionTableRow";
import { EmptyTransactionsState } from "./EmptyTransactionsState";
import TablePagination from "./TablePagination";

interface TransactionsTableProps {
  transactions: Transaction[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  appliedFilters?: {
    status: string;
    paymentMethod: string;
    totalResults: number;
  };
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  itemsPerPage?: number;
  onItemsPerPageChange?: (value: number) => void;
  onPageChange?: (page: number) => void;
  onSortChange?: (column: 'date' | 'amount' | 'vendor' | 'status') => void;
  onDateRangeChange?: (range: 'last7days' | 'last30days' | 'last3months' | 'custom') => void;
  onStatusFilterChange?: (statuses: string[]) => void;
  onPaymentMethodFilterChange?: (methods: string[]) => void;
}

const TransactionsTable = ({
  transactions,
  pagination,
  appliedFilters,
  searchValue = "",
  onSearchChange,
  itemsPerPage = 10,
  onItemsPerPageChange,
  onPageChange,
  onSortChange,
}: TransactionsTableProps) => {
  const navigate = useNavigate();
  const [sortColumn, setSortColumn] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }

    // Trigger server-side sort if callback provided
    if (onSortChange && column !== 'invoice') {
      onSortChange(column as 'date' | 'amount' | 'vendor' | 'status');
    }
  };

  // Handle row click to navigate to transaction details
  const handleRowClick = (transactionId: string) => {
    navigate(`/payments/${transactionId}`);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <TableSearchBar
          searchTerm={searchValue}
          onSearchChange={onSearchChange || (() => {})}
        />

        {/* Items per page selector */}
        {onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-muted-foreground">rows</span>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TransactionTableHeader
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <TransactionTableRow
                  key={transaction.id}
                  transaction={transaction}
                  onRowClick={handleRowClick}
                />
              ))
            ) : (
              <TableRow>
                <EmptyTransactionsState
                  searchTerm={searchValue}
                  hasActiveFilters={false}
                  onResetFilters={() => {}}
                />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.total > 0 && onPageChange && (
        <TablePagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default TransactionsTable;
