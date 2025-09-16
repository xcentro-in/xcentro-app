
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Transaction } from "@/types/transaction";
import { useInlineFilters } from "@/hooks/useInlineFilters";

// Import new components
import { TableSearchBar } from "./TableSearchBar";
import { TransactionTableHeader } from "./TransactionTableHeader";
import { TransactionTableRow } from "./TransactionTableRow";
import { EmptyTransactionsState } from "./EmptyTransactionsState";

interface TransactionsTableProps {
  transactions: Transaction[];
}

export const TransactionsTable = ({ 
  transactions
}: TransactionsTableProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Use inline filters hook
  const {
    filteredTransactions: initialFiltered,
    categoryFilter,
    statusFilter,
    methodFilter,
    dateFilter,
    dateRange,
    setCategoryFilter,
    setStatusFilter,
    setMethodFilter,
    setDateFilter,
    setDateRange
  } = useInlineFilters(transactions);
  
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
    navigate(`/payments/${transactionId}`);
  };
  
  // Reset filters
  const resetFilters = () => {
    setCategoryFilter(["vendor", "supplier", "biller", "payroll"]);
    setStatusFilter(["completed", "pending", "upcoming", "failed"]);
    setDateFilter(["7days"]);
    setDateRange(undefined);
  };
  
  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    // Start with already filtered transactions from hook
    let filtered = [...initialFiltered];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        t => t.description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
             t.invoice?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             t.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
      );
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
  }, [initialFiltered, searchTerm, sortColumn, sortDirection]);

  // Check if there are any active filters
  const hasActiveFilters = !dateFilter.includes("7days") || 
                           dateFilter.length !== 1 ||
                           statusFilter.length !== 4 ||
                           categoryFilter.length !== 4;

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
              categoryFilter={categoryFilter}
              statusFilter={statusFilter}
              methodFilter={methodFilter}
              dateFilter={dateFilter}
              dateRange={dateRange}
              onCategoryChange={setCategoryFilter}
              onStatusChange={setStatusFilter}
              onMethodChange={setMethodFilter}
              onDateChange={setDateFilter}
              onDateRangeChange={setDateRange}
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
                    onResetFilters={resetFilters}
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
