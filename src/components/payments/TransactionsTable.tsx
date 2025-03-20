
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUp, ArrowDown, CreditCard, BanknoteIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Pagination, PaginationContent, PaginationItem, 
  PaginationLink, PaginationNext, PaginationPrevious 
} from "@/components/ui/pagination";

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
  
  const SortIndicator = ({ field }: { field: string }) => (
    <>
      {sortField === field ? (
        sortDirection === "asc" ? 
        <ArrowUp className="h-3.5 w-3.5 ml-1 text-black" /> : 
        <ArrowDown className="h-3.5 w-3.5 ml-1 text-black" />
      ) : (
        <div className="flex flex-col ml-1 text-black">
          <ArrowUp className="h-2 w-2" />
          <ArrowDown className="h-2 w-2" />
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Transactions Table */}
      <div className="rounded-md border overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[1.5fr_1fr_0.8fr_0.8fr_0.8fr] gap-4 p-4 bg-muted/50 text-sm font-medium">
          <div 
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => onSort("vendor")}
          >
            Payee Name
            <SortIndicator field="vendor" />
          </div>
          <div 
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => onSort("date")}
          >
            Date & Time
            <SortIndicator field="date" />
          </div>
          <div 
            className="flex items-center gap-1 cursor-pointer justify-end"
            onClick={() => onSort("amount")}
          >
            Amount
            <SortIndicator field="amount" />
          </div>
          <div className="text-center">Category</div>
          <div className="text-center">Status</div>
        </div>
        
        {/* Transaction Rows */}
        <div className="divide-y">
          {paginatedTransactions.length > 0 ? (
            paginatedTransactions.map((transaction) => (
              <div 
                key={transaction.id}
                className="grid grid-cols-[1.5fr_1fr_0.8fr_0.8fr_0.8fr] gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => handleTransactionClick(transaction.id)}
              >
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full",
                    transaction.method === "credit" ? "bg-primary/10" : "bg-purple-500/10"
                  )}>
                    {transaction.method === "credit" ? (
                      <CreditCard className="h-4 w-4 text-primary" />
                    ) : (
                      <BanknoteIcon className="h-4 w-4 text-purple-500" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{transaction.vendor}</div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {transaction.method === "credit" ? "Credit Card" : "Bank Transfer"}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  <div className="text-sm">{transaction.date}</div>
                </div>
                
                <div className="flex items-center justify-end font-medium">
                  ${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                
                <div className="flex items-center justify-center">
                  <Badge variant="outline" className="capitalize">
                    {transaction.category}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-center">
                  {transaction.status === "completed" && (
                    <Badge className="bg-green-500/10 border-green-500/20 text-green-600 text-xs capitalize">
                      Completed
                    </Badge>
                  )}
                  {transaction.status === "pending" && (
                    <Badge className="bg-amber-500/10 border-amber-500/20 text-amber-600 text-xs capitalize">
                      Processing
                    </Badge>
                  )}
                  {transaction.status === "upcoming" && (
                    <Badge className="bg-blue-500/10 border-blue-500/20 text-blue-600 text-xs capitalize">
                      Scheduled
                    </Badge>
                  )}
                  {transaction.status === "failed" && (
                    <Badge className="bg-red-500/10 border-red-500/20 text-red-600 text-xs capitalize">
                      Failed
                    </Badge>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No transactions found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Pagination */}
      {transactions.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, transactions.length)} of {transactions.length} transactions
          </div>
          
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={cn(currentPage === 1 && "opacity-50 pointer-events-none")}
                />
              </PaginationItem>
              
              {/* Generate page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                let pageNum = index + 1;
                
                // Adjust pagination display for many pages
                if (totalPages > 5) {
                  if (currentPage > 3 && currentPage <= totalPages - 2) {
                    pageNum = currentPage - 2 + index;
                  } else if (currentPage > totalPages - 2) {
                    pageNum = totalPages - 4 + index;
                  }
                }
                
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink 
                      isActive={currentPage === pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={cn(currentPage === totalPages && "opacity-50 pointer-events-none")}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
};

export default TransactionsTable;
