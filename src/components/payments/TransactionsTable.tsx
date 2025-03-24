
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// Import new components
import TableHeader from "./TableHeader";
import TransactionRow from "./TransactionRow";
import EmptyTransactionsState from "./EmptyTransactionsState";
import TablePagination from "./TablePagination";

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
  sortField: string | null;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
  itemsPerPage: number;
}

const TransactionsTable = ({
  transactions,
  sortField,
  sortDirection,
  onSort,
  itemsPerPage
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
    <>
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
    </>
  );
};

export default TransactionsTable;
