
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
}

const TransactionsTable = ({
  transactions,
  searchValue,
  onSearchChange,
  itemsPerPage,
  onItemsPerPageChange
}: TransactionsTableProps) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // Use inline filters hook
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
        {/* Table Header */}
        {/* Table Header */}
        <TableHeader
          categoryFilter={categoryFilter}
          statusFilter={statusFilter}
          dateFilter={dateFilter}
          dateRange={dateRange}
          onCategoryFilterChange={setCategoryFilter}
          onStatusFilterChange={setStatusFilter}
          onDateFilterChange={setDateFilter}
          onDateRangeChange={setDateRange}
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
