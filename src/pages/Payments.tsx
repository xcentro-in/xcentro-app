
import { useState, useEffect } from "react";
import { 
  Search, Plus, Download, Users, ArrowUp, ArrowDown, Info,
  CreditCard, BanknoteIcon, Eye, X, Clock, Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Pagination, PaginationContent, PaginationItem, 
  PaginationLink, PaginationNext, PaginationPrevious 
} from "@/components/ui/pagination";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DateRangePicker } from "@/components/payments/DateRangePicker";
import { DateRange } from "react-day-picker";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { subDays, startOfQuarter, endOfDay } from "date-fns";

// Mock transaction data - would be replaced with an API call in a real application
const transactions = [
  { id: 1, vendor: "Office Supplies Co.", amount: 2499.99, status: "completed", date: "Today, 2:30 PM", method: "credit", category: "vendor" },
  { id: 2, vendor: "Cloud Services", amount: 899.00, status: "completed", date: "Yesterday, 10:15 AM", method: "bank", category: "supplier" },
  { id: 3, vendor: "Marketing Agency", amount: 5999.99, status: "pending", date: "Aug 12, 9:30 AM", method: "credit", category: "vendor" },
  { id: 4, vendor: "Rent Payment", amount: 8500.00, status: "upcoming", date: "Aug 15 (Scheduled)", method: "bank", category: "biller" },
  { id: 5, vendor: "IT Support", amount: 1299.50, status: "completed", date: "Aug 10, 3:45 PM", method: "credit", category: "supplier" },
  { id: 6, vendor: "Office Furniture", amount: 4750.25, status: "completed", date: "Aug 5, 11:20 AM", method: "bank", category: "vendor" },
  { id: 7, vendor: "Internet Provider", amount: 499.99, status: "upcoming", date: "Aug 20 (Scheduled)", method: "bank", category: "biller" },
  { id: 8, vendor: "Employee Benefits", amount: 3250.00, status: "pending", date: "Aug 14, Processing", method: "credit", category: "payroll" },
];

const dateFilterOptions = [
  { label: "Last 7 Days", value: "7days" },
  { label: "Last 30 Days", value: "30days" },
  { label: "Last Quarter", value: "quarter" },
  { label: "Custom Range", value: "custom" },
];

const statusFilterOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Failed", value: "failed" },
];

const methodFilterOptions = [
  { label: "All Methods", value: "all" },
  { label: "Credit Card", value: "credit" },
  { label: "Bank Transfer", value: "bank" },
];

const categoryFilterOptions = [
  { label: "All Categories", value: "all" },
  { label: "Vendor", value: "vendor" },
  { label: "Supplier", value: "supplier" },
  { label: "Biller", value: "biller" },
  { label: "Payroll", value: "payroll" },
];

interface ActiveFilter {
  type: string;
  value: string;
  label: string;
}

const Payments = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [dateFilter, setDateFilter] = useState("7days");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date()
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([
    { type: "date", value: "7days", label: "Last 7 Days" },
    { type: "status", value: "all", label: "All Statuses" },
    { type: "method", value: "all", label: "All Methods" },
    { type: "category", value: "all", label: "All Categories" }
  ]);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  
  useEffect(() => {
    // Initialize default date range based on the dateFilter
    updateDateRangeFromFilter(dateFilter);
  }, []);

  const updateDateRangeFromFilter = (filter: string) => {
    const today = new Date();
    let from: Date | undefined;
    let to: Date | undefined = today;
    let showDatePicker = false;

    switch (filter) {
      case "7days":
        from = subDays(today, 7);
        break;
      case "30days":
        from = subDays(today, 30);
        break;
      case "quarter":
        from = startOfQuarter(today);
        break;
      case "custom":
        showDatePicker = true;
        if (!dateRange?.from) {
          from = subDays(today, 7);
        } else {
          from = dateRange.from;
          to = dateRange.to || today;
        }
        break;
      case "all":
        from = undefined;
        to = undefined;
        break;
      default:
        from = subDays(today, 7);
    }

    setDateRange({ from, to });
    setShowCustomDateRange(showDatePicker);
  };

  // Handle filter changes
  const applyFilter = (type: string, value: string, label: string) => {
    if (type === "date") {
      updateDateRangeFromFilter(value);
    }
    
    // Check if filter of this type already exists
    const existingFilterIndex = activeFilters.findIndex(filter => filter.type === type);
    
    if (existingFilterIndex >= 0) {
      // Update existing filter
      const updatedFilters = [...activeFilters];
      updatedFilters[existingFilterIndex] = { type, value, label };
      setActiveFilters(updatedFilters);
    } else {
      // Add new filter
      setActiveFilters([...activeFilters, { type, value, label }]);
    }
  };
  
  // Handle removing a filter
  const removeFilter = (filterToRemove: ActiveFilter) => {
    const defaultValue = "all";
    const updatedFilters = activeFilters.filter(filter => 
      !(filter.type === filterToRemove.type && filter.value === filterToRemove.value)
    );
    
    // Add default filter if not present
    if (!updatedFilters.some(filter => filter.type === filterToRemove.type)) {
      let defaultLabel = "All";
      
      switch (filterToRemove.type) {
        case "date":
          defaultLabel = "All Dates";
          break;
        case "status":
          defaultLabel = "All Statuses";
          break;
        case "method":
          defaultLabel = "All Methods";
          break;
        case "category":
          defaultLabel = "All Categories";
          break;
      }
      
      updatedFilters.push({
        type: filterToRemove.type,
        value: defaultValue,
        label: defaultLabel
      });
    }
    
    setActiveFilters(updatedFilters);
    
    // Reset the corresponding filter state
    switch (filterToRemove.type) {
      case "date":
        setDateFilter(defaultValue);
        setDateRange(undefined);
        setShowCustomDateRange(false);
        break;
      case "status":
        setStatusFilter(defaultValue);
        break;
      case "method":
        setMethodFilter(defaultValue);
        break;
      case "category":
        setCategoryFilter(defaultValue);
        break;
      default:
        break;
    }
  };
  
  // Reset to default filters
  const resetToDefaultFilters = () => {
    setActiveFilters([
      { type: "date", value: "7days", label: "Last 7 Days" },
      { type: "status", value: "all", label: "All Statuses" },
      { type: "method", value: "all", label: "All Methods" },
      { type: "category", value: "all", label: "All Categories" }
    ]);
    
    setDateFilter("7days");
    updateDateRangeFromFilter("7days");
    setStatusFilter("all");
    setMethodFilter("all");
    setCategoryFilter("all");
    setSearchValue("");
    setShowCustomDateRange(false);
  };
  
  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle sort direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new sort field and default to descending
      setSortField(field);
      setSortDirection("desc");
    }
  };
  
  // Handle date range change
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    
    if (range?.from && range?.to) {
      const formattedFrom = range.from.toLocaleDateString();
      const formattedTo = range.to.toLocaleDateString();
      
      const rangeLabel = `${formattedFrom} - ${formattedTo}`;
      
      applyFilter("date", "custom", rangeLabel);
    }
  };
  
  // Apply filters and sort to transactions
  const filteredAndSortedTransactions = transactions
    .filter(transaction => {
      // Apply search filter
      const matchesSearch = transaction.vendor.toLowerCase().includes(searchValue.toLowerCase());
      
      // Apply status filter
      const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
      
      // Apply method filter
      const matchesMethod = methodFilter === "all" || transaction.method === methodFilter;
      
      // Apply category filter
      const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter;
      
      // Date filter would be implemented with actual dates
      // For this mock, we'll assume all transactions match the date filter
      
      return matchesSearch && matchesStatus && matchesMethod && matchesCategory;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      
      if (sortField === "vendor") {
        return sortDirection === "asc" 
          ? a.vendor.localeCompare(b.vendor)
          : b.vendor.localeCompare(a.vendor);
      }
      
      if (sortField === "amount") {
        return sortDirection === "asc" 
          ? a.amount - b.amount
          : b.amount - a.amount;
      }
      
      // For date, we'd compare actual date objects
      // This is simplified for the mock data
      if (sortField === "date") {
        return sortDirection === "asc" ? 1 : -1; // Mock implementation
      }
      
      return 0;
    });
  
  // Pagination
  const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredAndSortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle transaction row click
  const handleTransactionClick = (transactionId: number) => {
    navigate(`/payments/${transactionId}`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight animate-slide-up">Payments</h1>
          <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: "50ms" }}>
            Manage all your business transactions in one place
          </p>
        </div>
        
        <div className="flex gap-3 animate-slide-down" style={{ animationDelay: "100ms" }}>
          <Button 
            variant="outline" 
            className="h-10 gap-2"
            onClick={() => navigate('/payees')}
          >
            <Users className="h-4 w-4" />
            Manage Payees
          </Button>
          <Button 
            className="h-10 gap-2"
            onClick={() => navigate("/new-payment")}
          >
            <Plus className="h-4 w-4" />
            New Payment
          </Button>
        </div>
      </div>

      <Card className="animate-scale-in">
        <CardHeader className="pb-2">
          <div className="flex flex-col space-y-4">
            {/* Horizontal Filter Bar */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Date Filter */}
              <Select value={dateFilter} onValueChange={(value) => {
                setDateFilter(value);
                const selectedOption = dateFilterOptions.find(option => option.value === value);
                if (selectedOption) {
                  applyFilter("date", value, selectedOption.label);
                }
                updateDateRangeFromFilter(value);
              }}>
                <SelectTrigger className="w-[140px] h-9">
                  <Calendar className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Dates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  {dateFilterOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Custom Date Range Picker - Only show when custom is selected */}
              {showCustomDateRange && (
                <div className="min-w-[300px]">
                  <DateRangePicker 
                    dateRange={dateRange}
                    onDateRangeChange={handleDateRangeChange}
                  />
                </div>
              )}
              
              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={(value) => {
                setStatusFilter(value);
                const selectedOption = statusFilterOptions.find(option => option.value === value);
                if (selectedOption) {
                  applyFilter("status", value, selectedOption.label);
                }
              }}>
                <SelectTrigger className="w-[150px] h-9">
                  <Clock className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Statuses" />
                </SelectTrigger>
                <SelectContent>
                  {statusFilterOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Payment Method Filter */}
              <Select value={methodFilter} onValueChange={(value) => {
                setMethodFilter(value);
                const selectedOption = methodFilterOptions.find(option => option.value === value);
                if (selectedOption) {
                  applyFilter("method", value, selectedOption.label);
                }
              }}>
                <SelectTrigger className="w-[150px] h-9">
                  <CreditCard className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Methods" />
                </SelectTrigger>
                <SelectContent>
                  {methodFilterOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={(value) => {
                setCategoryFilter(value);
                const selectedOption = categoryFilterOptions.find(option => option.value === value);
                if (selectedOption) {
                  applyFilter("category", value, selectedOption.label);
                }
              }}>
                <SelectTrigger className="w-[150px] h-9">
                  <SelectValue placeholder="Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categoryFilterOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Items per page */}
              <div className="ml-auto flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Number of rows per page:</span>
                <Select 
                  value={String(itemsPerPage)} 
                  onValueChange={(value) => setItemsPerPage(Number(value))}
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
            
            {/* Search Bar - Moved to a separate row */}
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search payee name..." 
                className="pl-9 h-9 w-full"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              {searchValue && (
                <button 
                  className="absolute right-2.5 top-2.5" 
                  onClick={() => setSearchValue("")}
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
            
            {/* Applied Filters Section */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <div className="flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>If a filter is removed, the default value 'All' will be applied</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="text-sm text-muted-foreground">Applied filters:</span>
              </div>
              
              {activeFilters.map((filter, index) => (
                <Badge 
                  key={`${filter.type}-${index}`} 
                  variant="outline" 
                  className="flex items-center gap-1 pl-2"
                >
                  {filter.type === "date" && dateRange?.from && dateRange?.to && filter.value === "custom" 
                    ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}` 
                    : filter.label}
                  <button 
                    className="ml-1 rounded-full hover:bg-muted"
                    onClick={() => removeFilter(filter)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              
              {activeFilters.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={resetToDefaultFilters}
                >
                  Reset to defaults
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Transactions Table */}
          <div className="rounded-md border overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[1.5fr_1fr_0.8fr_0.8fr_0.8fr] gap-4 p-4 bg-muted/50 text-sm font-medium">
              <div 
                className="flex items-center gap-1 cursor-pointer"
                onClick={() => handleSort("vendor")}
              >
                Payee Name
                {sortField === "vendor" ? (
                  sortDirection === "asc" ? 
                  <ArrowUp className="h-3.5 w-3.5 ml-1 text-black" /> : 
                  <ArrowDown className="h-3.5 w-3.5 ml-1 text-black" />
                ) : (
                  <div className="flex flex-col ml-1 text-black">
                    <ArrowUp className="h-2 w-2" />
                    <ArrowDown className="h-2 w-2" />
                  </div>
                )}
              </div>
              <div 
                className="flex items-center gap-1 cursor-pointer"
                onClick={() => handleSort("date")}
              >
                Date & Time
                {sortField === "date" ? (
                  sortDirection === "asc" ? 
                  <ArrowUp className="h-3.5 w-3.5 ml-1 text-black" /> : 
                  <ArrowDown className="h-3.5 w-3.5 ml-1 text-black" />
                ) : (
                  <div className="flex flex-col ml-1 text-black">
                    <ArrowUp className="h-2 w-2" />
                    <ArrowDown className="h-2 w-2" />
                  </div>
                )}
              </div>
              <div 
                className="flex items-center gap-1 cursor-pointer justify-end"
                onClick={() => handleSort("amount")}
              >
                Amount
                {sortField === "amount" ? (
                  sortDirection === "asc" ? 
                  <ArrowUp className="h-3.5 w-3.5 ml-1 text-black" /> : 
                  <ArrowDown className="h-3.5 w-3.5 ml-1 text-black" />
                ) : (
                  <div className="flex flex-col ml-1 text-black">
                    <ArrowUp className="h-2 w-2" />
                    <ArrowDown className="h-2 w-2" />
                  </div>
                )}
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
          {filteredAndSortedTransactions.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedTransactions.length)} of {filteredAndSortedTransactions.length} transactions
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;
