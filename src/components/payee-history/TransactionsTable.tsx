
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
    filteredTransactions: inlineFiltered,
    categoryFilter,
    statusFilter,
    dateFilter,
    dateRange,
    methodFilter,
    setCategoryFilter,
    setStatusFilter,
    setDateFilter,
    setDateRange,
    setMethodFilter
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
    navigate(`/payments/${transactionId}`);
  };
  
  // Apply search filter and sorting to inline filtered results
  const finalTransactions = useMemo(() => {
    let filtered = [...inlineFiltered];
    
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
  }, [inlineFiltered, searchTerm, sortColumn, sortDirection]);

  // Check if there are any active filters
  const hasActiveFilters = categoryFilter.length !== 4 || 
                           statusFilter.length !== 4 || 
                           !dateFilter.includes("7days") ||
                           dateFilter.length !== 1 ||
                           (methodFilter && methodFilter.length !== 4);

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
              dateFilter={dateFilter}
              dateRange={dateRange}
              methodFilter={methodFilter}
              onCategoryFilterChange={setCategoryFilter}
              onStatusFilterChange={setStatusFilter}
              onDateFilterChange={setDateFilter}
              onDateRangeChange={setDateRange}
              onMethodFilterChange={setMethodFilter}
            />
            <TableBody>
              {finalTransactions.length > 0 ? (
                finalTransactions.map((transaction) => (
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
                    onResetFilters={() => {
                      setCategoryFilter(["vendor", "supplier", "biller", "payroll"]);
                      setStatusFilter(["completed", "pending", "upcoming", "failed"]);
                      setDateFilter(["7days"]);
                      setDateRange(undefined);
                      if (setMethodFilter) setMethodFilter(["upi", "bank_transfer", "credit_card", "debit_card"]);
                    }}
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
