
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// Import components
import TableHeader from "./TableHeader";
import TransactionRow from "./TransactionRow";
import EmptyTransactionsState from "./EmptyTransactionsState";
import TablePagination from "./TablePagination";
import { PaymentFilters } from "./PaymentFilters";

interface Transaction {
  id: number;
  vendor: string;
  amount: number;
  status: string;
  date: string;
  method: string;
  category: string;
}

interface TransactionsTableProps {
  transactions: Transaction[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  sortField: string | null;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
}

const TransactionsTable = ({
  transactions,
  searchValue,
  onSearchChange,
  sortField,
  sortDirection,
  onSort,
  itemsPerPage,
  onItemsPerPageChange
}: TransactionsTableProps) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  
  // Pagination
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle transaction row click
  const handleTransactionClick = (transactionId: number) => {
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
        <TableHeader 
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={onSort}
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
      {transactions.length > 0 && (
        <TablePagination 
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={transactions.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default TransactionsTable;
