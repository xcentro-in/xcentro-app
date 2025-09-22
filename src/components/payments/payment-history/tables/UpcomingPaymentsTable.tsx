import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PaymentFilters } from "../../payee-management/filters/PaymentFilters";
import TransactionRow from "./TransactionRow";
import EmptyTransactionsState from "../../shared/ui/EmptyTransactionsState";
import TablePagination from "./TablePagination";
import UpcomingPaymentsTableHeader from "./UpcomingPaymentsTableHeader";
import { useUpcomingPayments } from "@/hooks/useUpcomingPayments";

interface UpcomingPaymentsTableProps {
  // No props needed - component is now self-contained
}

const UpcomingPaymentsTable = ({}: UpcomingPaymentsTableProps) => {
  const navigate = useNavigate();

  // Self-managed state for search, pagination, and sorting
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [sortBy, setSortBy] = useState<"date" | "amount" | "vendor">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Fetch data using the hook with current parameters
  const { payments, pagination, isLoading, error, refetch } = useUpcomingPayments({
    page: currentPage,
    limit: itemsPerPage,
    search: searchValue,
    sortBy,
    sortOrder: sortDirection
  });

  // Handle transaction row click
  const handleTransactionClick = (transactionId: number | string) => {
    navigate(`/payments/${transactionId}`);
  };

  // Handle date sort (toggle direction)
  const handleDateSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  // Handle search change with debouncing effect
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="text-muted-foreground mb-4">{error}</div>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Rows Per Page */}
      <PaymentFilters
        searchValue={searchValue}
        itemsPerPage={itemsPerPage}
        onSearchChange={handleSearchChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {/* Transactions Table */}
      <div className="rounded-md border overflow-hidden">
        {/* Table Header */}
        <UpcomingPaymentsTableHeader
          sortDirection={sortDirection}
          onDateSort={handleDateSort}
        />

        {/* Transaction Rows */}
        <div className="divide-y">
          {payments.length > 0 ? (
            payments.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                onClick={handleTransactionClick}
              />
            ))
          ) : (
            <EmptyTransactionsState />
          )}
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.total > 0 && (
        <TablePagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default UpcomingPaymentsTable;