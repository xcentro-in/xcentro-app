
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Transaction, TransactionStatus, PaymentMethod } from "@/types/transaction";
import { DateRange } from "react-day-picker";

// Import new components
import { TableSearchBar } from "./TableSearchBar";
import { TransactionTableHeader } from "./TransactionTableHeader";
import { TransactionTableRow } from "./TransactionTableRow";
import { EmptyTransactionsState } from "./EmptyTransactionsState";

interface TransactionsTableProps {
  transactions: Transaction[];
  appliedFilters: {
    status: TransactionStatus | "all";
    method: PaymentMethod | "all";
    dateRange: DateRange | undefined;
  };
  onResetFilters: () => void;
}

export const TransactionsTable = ({ 
  transactions, 
  appliedFilters,
  onResetFilters
}: TransactionsTableProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
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
  };

  // Handle row click to navigate to transaction details
  const handleRowClick = (transactionId: string) => {
    // Navigate to the transaction details page
    navigate(`/transactions/${transactionId}`);
  };
  
  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        t => t.description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
             t.invoice?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             t.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter from applied filters
    if (appliedFilters.status !== "all") {
      filtered = filtered.filter(t => t.status === appliedFilters.status);
    }
    
    // Apply payment method filter from applied filters
    if (appliedFilters.method !== "all") {
      filtered = filtered.filter(t => t.method === appliedFilters.method);
    }
    
    // Apply date range filter from applied filters
    if (appliedFilters.dateRange?.from) {
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.date);
        if (appliedFilters.dateRange?.from && transactionDate < appliedFilters.dateRange.from) return false;
        if (appliedFilters.dateRange?.to && transactionDate > appliedFilters.dateRange.to) return false;
        return true;
      });
    }
    
    // Sort filtered results
    filtered.sort((a, b) => {
      let valueA, valueB;
      
      if (sortColumn === "date") {
        valueA = new Date(a.date).getTime();
        valueB = new Date(b.date).getTime();
      } else if (sortColumn === "amount") {
        valueA = a.amount;
        valueB = b.amount;
      } else if (sortColumn === "invoice") {
        valueA = a.invoice || "";
        valueB = b.invoice || "";
      } else {
        valueA = a[sortColumn as keyof Transaction] || "";
        valueB = b[sortColumn as keyof Transaction] || "";
      }
      
      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
    
    return filtered;
  }, [transactions, searchTerm, appliedFilters, sortColumn, sortDirection]);

  // Check if there are any active filters
  const hasActiveFilters = appliedFilters.status !== "all" || 
                           appliedFilters.method !== "all" || 
                           !!appliedFilters.dateRange?.from;

  return (
    <Card>
      <CardContent className="p-4">
        <TableSearchBar 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />
        
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TransactionTableHeader 
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TransactionTableRow 
                    key={transaction.id}
                    transaction={transaction} 
                    onRowClick={handleRowClick}
                  />
                ))
              ) : (
                <TableRow>
                  <EmptyTransactionsState 
                    searchTerm={searchTerm}
                    hasActiveFilters={hasActiveFilters}
                    onResetFilters={onResetFilters}
                  />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
