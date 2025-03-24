
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, startOfQuarter, endOfQuarter } from "date-fns";
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Calendar, 
  CreditCard, 
  BanknoteIcon, 
  Filter, 
  Search,
  Printer
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { mockPayees } from "@/data/mockPayees";
import { getPayeeTransactions, getPayeeTotalPayments, getPayeeLastTransactionDate } from "@/data/mockPayeeTransactions";
import { Payee, BankPayee, BillerPayee, PayrollPayee } from "@/types/payee";
import { Transaction, TransactionStatus, PaymentMethod } from "@/types/transaction";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";

const PayeeHistory = () => {
  const { payeeId } = useParams<{ payeeId: string }>();
  const navigate = useNavigate();
  
  const [payee, setPayee] = useState<Payee | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "all">("all");
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | "all">("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [dateRangeType, setDateRangeType] = useState<"custom" | "thisQuarter">("custom");
  const [sortColumn, setSortColumn] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filtersChanged, setFiltersChanged] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    status: "all" as TransactionStatus | "all",
    method: "all" as PaymentMethod | "all",
    dateRange: undefined as DateRange | undefined,
  });
  
  // Load payee and transaction data
  useEffect(() => {
    if (!payeeId) return;
    
    const payeeData = mockPayees.find(p => p.id === payeeId);
    if (payeeData) {
      setPayee(payeeData);
      const payeeTransactions = getPayeeTransactions(payeeId);
      setTransactions(payeeTransactions);
    }
  }, [payeeId]);

  // Handle applying this quarter date range
  useEffect(() => {
    if (dateRangeType === "thisQuarter") {
      const now = new Date();
      const start = startOfQuarter(now);
      const end = endOfQuarter(now);
      setDateRange({ from: start, to: end });
    }
  }, [dateRangeType]);
  
  // Track filter changes
  useEffect(() => {
    if (
      statusFilter !== appliedFilters.status ||
      methodFilter !== appliedFilters.method ||
      dateRange !== appliedFilters.dateRange
    ) {
      setFiltersChanged(true);
    } else {
      setFiltersChanged(false);
    }
  }, [statusFilter, methodFilter, dateRange, appliedFilters]);

  // Handle apply filters
  const handleApplyFilters = () => {
    setAppliedFilters({
      status: statusFilter,
      method: methodFilter,
      dateRange: dateRange,
    });
    setFiltersChanged(false);
    toast.success("Filters applied", {
      description: "Transaction list has been updated"
    });
  };
  
  // Handle reset filters
  const handleResetFilters = () => {
    setStatusFilter("all");
    setMethodFilter("all");
    setDateRange(undefined);
    setDateRangeType("custom");
    setAppliedFilters({
      status: "all",
      method: "all",
      dateRange: undefined,
    });
    setFiltersChanged(false);
  };
  
  // Handle sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
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
  
  // Calculate totals
  const totalPaid = getPayeeTotalPayments(payeeId || "");
  const lastTransactionDate = getPayeeLastTransactionDate(payeeId || "");
  
  // Handle download
  const handleDownload = (format: "pdf" | "csv") => {
    toast.success(`Downloaded statement in ${format.toUpperCase()} format`, {
      description: `${payee?.name} transaction history has been downloaded`
    });
  };
  
  // Handle print statement
  const handlePrint = () => {
    toast.success("Preparing statement for print", {
      description: "The print dialog will open in a moment"
    });
  };
  
  // Get payee-specific details
  const getPayeeDetails = () => {
    if (!payee) return null;
    
    switch (payee.type) {
      case "bank":
        const bankPayee = payee as BankPayee;
        return (
          <div className="flex flex-col gap-1 text-sm">
            <div><span className="font-medium">Bank:</span> {bankPayee.bankName}</div>
            <div><span className="font-medium">Account:</span> ****{bankPayee.accountNumber.slice(-4)}</div>
            {bankPayee.gstin && <div><span className="font-medium">GSTIN:</span> {bankPayee.gstin}</div>}
          </div>
        );
      case "biller":
        const billerPayee = payee as BillerPayee;
        return (
          <div className="flex flex-col gap-1 text-sm">
            <div><span className="font-medium">Biller:</span> {billerPayee.billerName}</div>
            <div><span className="font-medium">Customer ID:</span> {billerPayee.customerId}</div>
            <div><span className="font-medium">Billing Cycle:</span> {billerPayee.billingCycle}</div>
          </div>
        );
      case "payroll":
        const payrollPayee = payee as PayrollPayee;
        return (
          <div className="flex flex-col gap-1 text-sm">
            <div><span className="font-medium">Bank:</span> {payrollPayee.bankName}</div>
            <div><span className="font-medium">Account:</span> ****{payrollPayee.accountNumber.slice(-4)}</div>
            <div><span className="font-medium">Salary Type:</span> {payrollPayee.salaryType}</div>
          </div>
        );
      default:
        return null;
    }
  };
  
  // Get badge for transaction status
  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/10 border-green-500/20 text-green-600">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/10 border-yellow-500/20 text-yellow-600">Pending</Badge>;
      case "upcoming":
        return <Badge className="bg-blue-500/10 border-blue-500/20 text-blue-600">Scheduled</Badge>;
      case "failed":
        return <Badge className="bg-red-500/10 border-red-500/20 text-red-600">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get payment method badge
  const getMethodBadge = (method: PaymentMethod) => {
    switch (method) {
      case "credit":
        return (
          <div className="flex items-center gap-1">
            <CreditCard className="h-3.5 w-3.5 text-primary" />
            <span>Credit Card</span>
          </div>
        );
      case "bank":
        return (
          <div className="flex items-center gap-1">
            <BanknoteIcon className="h-3.5 w-3.5 text-purple-500" />
            <span>Bank Transfer</span>
          </div>
        );
      default:
        return method;
    }
  };
  
  if (!payee) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold">Payee not found</h2>
        <p className="text-muted-foreground mt-2">The payee you are looking for does not exist.</p>
        <Button className="mt-4" onClick={() => navigate("/payees")}>
          Back to Payees
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <Button 
          variant="ghost" 
          className="w-fit pl-0 hover:pl-0 hover:bg-transparent -ml-2 text-muted-foreground"
          onClick={() => navigate("/payees")}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Payees
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight animate-slide-up">
              {payee.name}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="capitalize">{payee.type}</Badge>
              {payee.type === "bank" && (payee as BankPayee).gstin && (
                <Badge variant="outline">GST Registered</Badge>
              )}
            </div>
            <div className="mt-2">
              {getPayeeDetails()}
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="flex flex-col p-4 rounded-lg border bg-muted/30">
              <span className="text-sm text-muted-foreground">Total Amount Paid</span>
              <span className="text-2xl font-bold">₹{totalPaid.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">Last payment: {lastTransactionDate ? format(new Date(lastTransactionDate), 'dd MMM yyyy') : 'N/A'}</span>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => handleDownload("pdf")}
              >
                <Download className="h-4 w-4" />
                Export PDF
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => handleDownload("csv")}
              >
                <FileText className="h-4 w-4" />
                Export CSV
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Filters Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="status-filter" className="text-sm font-medium">Payment Status</label>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TransactionStatus | "all")}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="upcoming">Scheduled</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label htmlFor="method-filter" className="text-sm font-medium">Payment Method</label>
              <Select value={methodFilter} onValueChange={(value) => setMethodFilter(value as PaymentMethod | "all")}>
                <SelectTrigger id="method-filter">
                  <SelectValue placeholder="All Methods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="credit">Credit Card</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Date Range</label>
              <div className="flex gap-2">
                <Select value={dateRangeType} onValueChange={(value) => setDateRangeType(value as "custom" | "thisQuarter")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Date Range Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Custom Range</SelectItem>
                    <SelectItem value="thisQuarter">This Quarter</SelectItem>
                  </SelectContent>
                </Select>
                {dateRangeType === "custom" && (
                  <DatePickerWithRange 
                    date={dateRange} 
                    setDate={setDateRange} 
                    className="flex-1"
                  />
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={handleResetFilters}
            >
              Reset
            </Button>
            <Button 
              variant="default" 
              onClick={handleApplyFilters}
              disabled={!filtersChanged}
            >
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Search and Transactions Table */}
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
                      <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer text-right"
                    onClick={() => handleSort("amount")}
                  >
                    Amount
                    {sortColumn === "amount" && (
                      <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort("date")}
                  >
                    Payment Date
                    {sortColumn === "date" && (
                      <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
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
                        {getStatusBadge(transaction.status)}
                      </TableCell>
                      <TableCell>
                        {getMethodBadge(transaction.method)}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {transaction.description || "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <FileText className="h-3.5 w-3.5 mr-1" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-muted-foreground">No transactions found matching your criteria.</p>
                      {(searchTerm || appliedFilters.status !== "all" || appliedFilters.method !== "all" || appliedFilters.dateRange?.from) && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={handleResetFilters}
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
    </div>
  );
};

export default PayeeHistory;
