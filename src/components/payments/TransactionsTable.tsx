
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Import new components
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <PaymentFilters 
          searchValue={searchValue}
          statusFilter=""
          methodFilter=""
          onSearchChange={onSearchChange}
          onStatusChange={() => {}}
          onMethodChange={() => {}}
        />
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Rows per page:</span>
          <Select 
            value={String(itemsPerPage)} 
            onValueChange={(value) => onItemsPerPageChange(Number(value))}
          >
            <SelectTrigger className="w-[80px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
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
