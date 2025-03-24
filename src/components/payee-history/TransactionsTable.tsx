
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Search, ArrowUp, ArrowDown } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Transaction, TransactionStatus, PaymentMethod } from "@/types/transaction";
import { DateRange } from "react-day-picker";
import { TransactionStatusBadge } from "@/components/transactions/TransactionStatusBadge";
import { TransactionMethodBadge } from "@/components/payee-history/TransactionMethodBadge";

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

  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-4 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by invoice, reference or description..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("invoice")}
                >
                  Invoice/Reference
                  {sortColumn === "invoice" && (
                    <span className="ml-1">{sortDirection === "asc" ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />}</span>
                  )}
                </TableHead>
                <TableHead 
                  className="cursor-pointer text-right"
                  onClick={() => handleSort("amount")}
                >
                  Amount
                  {sortColumn === "amount" && (
                    <span className="ml-1">{sortDirection === "asc" ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />}</span>
                  )}
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  Payment Date
                  {sortColumn === "date" && (
                    <span className="ml-1">{sortDirection === "asc" ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />}</span>
                  )}
                </TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TableRow 
                    key={transaction.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(transaction.transactionId)}
                  >
                    <TableCell className="font-medium">
                      {transaction.invoice || transaction.transactionId}
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{transaction.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {format(new Date(transaction.date), 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell>
                      <TransactionStatusBadge status={transaction.status} />
                    </TableCell>
                    <TableCell>
                      <TransactionMethodBadge method={transaction.method} />
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {transaction.description || "N/A"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-muted-foreground">No transactions found matching your criteria.</p>
                    {(searchTerm || appliedFilters.status !== "all" || appliedFilters.method !== "all" || appliedFilters.dateRange?.from) && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={onResetFilters}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
