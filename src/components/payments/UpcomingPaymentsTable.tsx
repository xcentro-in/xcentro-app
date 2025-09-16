import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Transaction } from "@/types/transaction";
import { PaymentFilters } from "./PaymentFilters";
import TransactionRow from "./TransactionRow";
import EmptyTransactionsState from "./EmptyTransactionsState";
import TablePagination from "./TablePagination";
import UpcomingPaymentsTableHeader from "./UpcomingPaymentsTableHeader";

interface UpcomingPaymentsTableProps {
  transactions: Transaction[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
}

const UpcomingPaymentsTable = ({
  transactions,
  searchValue,
  onSearchChange,
  itemsPerPage,
  onItemsPerPageChange
}: UpcomingPaymentsTableProps) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Apply search filter
  const searchFilteredTransactions = transactions.filter(transaction =>
    transaction.vendor.toLowerCase().includes(searchValue.toLowerCase()) ||
    transaction.transactionId.toLowerCase().includes(searchValue.toLowerCase()) ||
    transaction.type.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Sort transactions by date (natural sorting - soonest first)
  const sortedTransactions = [...searchFilteredTransactions].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    
    if (sortDirection === "asc") {
      return dateA.getTime() - dateB.getTime();
    } else {
      return dateB.getTime() - dateA.getTime();
    }
  });
  
  // Pagination
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle transaction row click
  const handleTransactionClick = (transactionId: number | string) => {
    navigate(`/payments/${transactionId}`);
  };

  // Handle date sort
  const handleDateSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
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
        <UpcomingPaymentsTableHeader 
          sortDirection={sortDirection}
          onDateSort={handleDateSort}
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
      {sortedTransactions.length > 0 && (
        <TablePagination 
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={sortedTransactions.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default UpcomingPaymentsTable;