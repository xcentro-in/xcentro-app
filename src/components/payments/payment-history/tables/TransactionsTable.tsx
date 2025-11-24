
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Transaction } from "@/types/transaction";

// Import components
import TableHeader from "./TableHeader";
import TransactionRow from "./TransactionRow";
import EmptyTransactionsState from "../../shared/ui/EmptyTransactionsState";
import TablePagination from "./TablePagination";
import { PaymentFilters } from "../../payee-management/filters/PaymentFilters";
import { useInlineFilters } from "@/hooks/useInlineFilters";

interface TransactionsTableProps {
  transactions: Transaction[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;

  // Optional server-side props for hybrid filtering
  pagination?: any;
  appliedFilters?: any;
  onPageChange?: (page: number) => void;
  onSortChange?: (column: 'date' | 'amount' | 'vendor' | 'status') => void;
  onDateRangeChange?: (range: 'last7days' | 'last30days' | 'last3months' | 'custom') => void;
  onStatusFilterChange?: (statuses: string[]) => void;
  onPaymentMethodFilterChange?: (methods: string[]) => void;
}

const TransactionsTable = ({
  transactions,
  searchValue,
  onSearchChange,
  itemsPerPage,
  onItemsPerPageChange,
  // Server-side filtering props (optional)
  pagination,
  appliedFilters,
  onPageChange,
  onSortChange,
  onDateRangeChange,
  onStatusFilterChange,
  onPaymentMethodFilterChange
}: TransactionsTableProps) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // Use inline filters hook for client-side filtering
  const {
    filteredTransactions: baseFilteredTransactions,
    categoryFilter,
    statusFilter,
    dateFilter,
    dateRange,
    setCategoryFilter,
    setStatusFilter,
    setDateFilter,
    setDateRange
  } = useInlineFilters(transactions);

  // Enhanced filter change handlers that trigger server-side API calls
  const handleStatusFilterChange = (statuses: string[]) => {
    setStatusFilter(statuses);
    // TODO: Trigger server-side API call for status filter
    if (onStatusFilterChange) {
      onStatusFilterChange(statuses);
    }
  };

  const handleDateRangeChange = (range: any) => {
    setDateRange(range);
    // TODO: Trigger server-side API call for date range filter
    if (onDateRangeChange) {
      // Convert DateRange to server format if needed
      console.log('Date range changed, will trigger API call:', range);
    }
  };

  const handleCategoryFilterChange = (categories: string[]) => {
    setCategoryFilter(categories);
    // TODO: Map category filter to payment method filter for server-side
    if (onPaymentMethodFilterChange) {
      onPaymentMethodFilterChange(categories);
    }
  };

  // Apply search filter on top of inline filters
  const searchFilteredTransactions = baseFilteredTransactions.filter(transaction =>
    transaction.vendor.toLowerCase().includes(searchValue.toLowerCase()) ||
    transaction.transactionId.toLowerCase().includes(searchValue.toLowerCase()) ||
    transaction.type.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(searchFilteredTransactions.length / itemsPerPage);
  const paginatedTransactions = searchFilteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle transaction row click
  const handleTransactionClick = (transactionId: number | string) => {
    navigate(`/payments/${transactionId}`);
  };

  return (
    <div className="space-y-4">
      {/* Search and Rows Per Page */}
      <PaymentFilters 
        searchValue={searchValue}
        itemsPerPage={itemsPerPage}
        onSearchChange={onSearchChange}
        onItemsPerPageChange={onItemsPerPageChange}
      />
      
      {/* Transactions Table */}
      <div className="rounded-md border overflow-hidden">
        {/* Table Header with server-side filter callbacks */}
        <TableHeader
          categoryFilter={categoryFilter}
          statusFilter={statusFilter}
          dateFilter={dateFilter}
          dateRange={dateRange}
          onCategoryFilterChange={handleCategoryFilterChange}
          onStatusFilterChange={handleStatusFilterChange}
          onDateFilterChange={setDateFilter}
          onDateRangeChange={handleDateRangeChange}
        />
        
        {/* Transaction Rows */}
        <div className="divide-y">
          {paginatedTransactions.length > 0 ? (
            paginatedTransactions.map((transaction) => (
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
      {/* Pagination */}
      {searchFilteredTransactions.length > 0 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={searchFilteredTransactions.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default TransactionsTable;
