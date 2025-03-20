
import { useState, useEffect } from "react";
import { subDays, startOfQuarter, endOfDay } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DateRange } from "react-day-picker";

// Import the new components
import PaymentsHeader from "@/components/payments/PaymentsHeader";
import FilterBar from "@/components/payments/FilterBar";
import SearchBar from "@/components/payments/SearchBar";
import AppliedFilters, { ActiveFilter } from "@/components/payments/AppliedFilters";
import TransactionsTable from "@/components/payments/TransactionsTable";

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

const Payments = () => {
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
  
  // Handle filter changes
  const handleDateFilterChange = (value: string) => {
    setDateFilter(value);
    const selectedOption = dateFilterOptions.find(option => option.value === value);
    if (selectedOption) {
      applyFilter("date", value, selectedOption.label);
    }
    updateDateRangeFromFilter(value);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    const selectedOption = statusFilterOptions.find(option => option.value === value);
    if (selectedOption) {
      applyFilter("status", value, selectedOption.label);
    }
  };

  const handleMethodFilterChange = (value: string) => {
    setMethodFilter(value);
    const selectedOption = methodFilterOptions.find(option => option.value === value);
    if (selectedOption) {
      applyFilter("method", value, selectedOption.label);
    }
  };

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value);
    const selectedOption = categoryFilterOptions.find(option => option.value === value);
    if (selectedOption) {
      applyFilter("category", value, selectedOption.label);
    }
  };

  // Filter options
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
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PaymentsHeader />

      <Card className="animate-scale-in">
        <CardHeader className="pb-2">
          <div className="flex flex-col space-y-4">
            {/* Horizontal Filter Bar */}
            <FilterBar 
              dateFilter={dateFilter}
              dateRange={dateRange}
              statusFilter={statusFilter}
              methodFilter={methodFilter}
              categoryFilter={categoryFilter}
              itemsPerPage={itemsPerPage}
              showCustomDateRange={showCustomDateRange}
              onDateFilterChange={handleDateFilterChange}
              onStatusFilterChange={handleStatusFilterChange}
              onMethodFilterChange={handleMethodFilterChange}
              onCategoryFilterChange={handleCategoryFilterChange}
              onItemsPerPageChange={setItemsPerPage}
              onDateRangeChange={handleDateRangeChange}
            />
            
            {/* Search Bar - Moved to a separate row */}
            <SearchBar 
              searchValue={searchValue}
              onSearchChange={setSearchValue}
            />
            
            {/* Applied Filters Section */}
            <AppliedFilters 
              activeFilters={activeFilters}
              dateRange={dateRange}
              onRemoveFilter={removeFilter}
              onResetFilters={resetToDefaultFilters}
            />
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Transactions Table */}
          <TransactionsTable 
            transactions={filteredAndSortedTransactions}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            itemsPerPage={itemsPerPage}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;
