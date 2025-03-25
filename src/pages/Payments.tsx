
import { useState, useEffect } from "react";
import { subDays, startOfQuarter, endOfDay } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { Filter } from "lucide-react";

// Import the new components
import PaymentsHeader from "@/components/payments/PaymentsHeader";
import FilterBar from "@/components/payments/FilterBar";
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
  const [filtersChanged, setFiltersChanged] = useState(false);
  const [appliedDateFilter, setAppliedDateFilter] = useState(dateFilter);
  const [appliedStatusFilter, setAppliedStatusFilter] = useState(statusFilter);
  const [appliedMethodFilter, setAppliedMethodFilter] = useState(methodFilter);
  const [appliedCategoryFilter, setAppliedCategoryFilter] = useState(categoryFilter);
  const [appliedDateRange, setAppliedDateRange] = useState(dateRange);
  
  useEffect(() => {
    // Initialize default date range based on the dateFilter
    updateDateRangeFromFilter(dateFilter);
  }, []);

  // Check if filters have changed from applied state
  useEffect(() => {
    if (dateFilter !== appliedDateFilter || 
        statusFilter !== appliedStatusFilter || 
        methodFilter !== appliedMethodFilter || 
        categoryFilter !== appliedCategoryFilter ||
        JSON.stringify(dateRange) !== JSON.stringify(appliedDateRange)) {
      setFiltersChanged(true);
    } else {
      setFiltersChanged(false);
    }
  }, [dateFilter, statusFilter, methodFilter, categoryFilter, dateRange, 
      appliedDateFilter, appliedStatusFilter, appliedMethodFilter, appliedCategoryFilter, appliedDateRange]);

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

  // Apply filters - this will now be called when the Apply button is clicked
  const applyFilters = () => {
    // Update the applied filter states
    setAppliedDateFilter(dateFilter);
    setAppliedStatusFilter(statusFilter);
    setAppliedMethodFilter(methodFilter);
    setAppliedCategoryFilter(categoryFilter);
    setAppliedDateRange(dateRange);
    
    // Update active filters
    const updatedFilters = [...activeFilters];
    
    // Update date filter
    const dateFilterOption = dateFilterOptions.find(option => option.value === dateFilter);
    if (dateFilterOption) {
      const existingDateIndex = updatedFilters.findIndex(filter => filter.type === "date");
      if (existingDateIndex >= 0) {
        updatedFilters[existingDateIndex] = { type: "date", value: dateFilter, label: dateFilterOption.label };
      } else {
        updatedFilters.push({ type: "date", value: dateFilter, label: dateFilterOption.label });
      }
    }
    
    // Update status filter
    const statusFilterOption = statusFilterOptions.find(option => option.value === statusFilter);
    if (statusFilterOption) {
      const existingStatusIndex = updatedFilters.findIndex(filter => filter.type === "status");
      if (existingStatusIndex >= 0) {
        updatedFilters[existingStatusIndex] = { type: "status", value: statusFilter, label: statusFilterOption.label };
      } else {
        updatedFilters.push({ type: "status", value: statusFilter, label: statusFilterOption.label });
      }
    }
    
    // Update method filter
    const methodFilterOption = methodFilterOptions.find(option => option.value === methodFilter);
    if (methodFilterOption) {
      const existingMethodIndex = updatedFilters.findIndex(filter => filter.type === "method");
      if (existingMethodIndex >= 0) {
        updatedFilters[existingMethodIndex] = { type: "method", value: methodFilter, label: methodFilterOption.label };
      } else {
        updatedFilters.push({ type: "method", value: methodFilter, label: methodFilterOption.label });
      }
    }
    
    // Update category filter
    const categoryFilterOption = categoryFilterOptions.find(option => option.value === categoryFilter);
    if (categoryFilterOption) {
      const existingCategoryIndex = updatedFilters.findIndex(filter => filter.type === "category");
      if (existingCategoryIndex >= 0) {
        updatedFilters[existingCategoryIndex] = { type: "category", value: categoryFilter, label: categoryFilterOption.label };
      } else {
        updatedFilters.push({ type: "category", value: categoryFilter, label: categoryFilterOption.label });
      }
    }
    
    setActiveFilters(updatedFilters);
    setFiltersChanged(false);
  };

  // Handle filter changes
  const handleDateFilterChange = (value: string) => {
    setDateFilter(value);
    updateDateRangeFromFilter(value);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleMethodFilterChange = (value: string) => {
    setMethodFilter(value);
  };

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value);
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
        setAppliedDateFilter(defaultValue);
        setDateRange(undefined);
        setAppliedDateRange(undefined);
        setShowCustomDateRange(false);
        break;
      case "status":
        setStatusFilter(defaultValue);
        setAppliedStatusFilter(defaultValue);
        break;
      case "method":
        setMethodFilter(defaultValue);
        setAppliedMethodFilter(defaultValue);
        break;
      case "category":
        setCategoryFilter(defaultValue);
        setAppliedCategoryFilter(defaultValue);
        break;
      default:
        break;
    }
  };
  
  // Reset to default filters
  const resetToDefaultFilters = () => {
    const defaultDateFilter = "7days";
    
    setActiveFilters([
      { type: "date", value: defaultDateFilter, label: "Last 7 Days" },
      { type: "status", value: "all", label: "All Statuses" },
      { type: "method", value: "all", label: "All Methods" },
      { type: "category", value: "all", label: "All Categories" }
    ]);
    
    setDateFilter(defaultDateFilter);
    setAppliedDateFilter(defaultDateFilter);
    updateDateRangeFromFilter(defaultDateFilter);
    setStatusFilter("all");
    setAppliedStatusFilter("all");
    setMethodFilter("all");
    setAppliedMethodFilter("all");
    setCategoryFilter("all");
    setAppliedCategoryFilter("all");
    setSearchValue("");
    setShowCustomDateRange(false);
    setFiltersChanged(false);
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
  };
  
  // Apply filters and sort to transactions
  const filteredAndSortedTransactions = transactions
    .filter(transaction => {
      // Apply search filter
      const matchesSearch = transaction.vendor.toLowerCase().includes(searchValue.toLowerCase());
      
      // Apply status filter
      const matchesStatus = appliedStatusFilter === "all" || transaction.status === appliedStatusFilter;
      
      // Apply method filter
      const matchesMethod = appliedMethodFilter === "all" || transaction.method === appliedMethodFilter;
      
      // Apply category filter
      const matchesCategory = appliedCategoryFilter === "all" || transaction.category === appliedCategoryFilter;
      
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
        {/* Filter Section */}
        <CardHeader className="pb-2 space-y-4">
          <div className="flex items-center space-x-2 text-lg font-semibold text-foreground mb-1">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </div>
          
          {/* Horizontal Filter Bar */}
          <FilterBar 
            dateFilter={dateFilter}
            dateRange={dateRange}
            statusFilter={statusFilter}
            methodFilter={methodFilter}
            categoryFilter={categoryFilter}
            showCustomDateRange={showCustomDateRange}
            filtersChanged={filtersChanged}
            onDateFilterChange={handleDateFilterChange}
            onStatusFilterChange={handleStatusFilterChange}
            onMethodFilterChange={handleMethodFilterChange}
            onCategoryFilterChange={handleCategoryFilterChange}
            onDateRangeChange={handleDateRangeChange}
            onApplyFilters={applyFilters}
            onResetFilters={resetToDefaultFilters}
          />
          
          {/* Applied Filters Section */}
          <AppliedFilters 
            activeFilters={activeFilters}
            dateRange={appliedDateRange}
            onRemoveFilter={removeFilter}
            onResetFilters={resetToDefaultFilters}
          />
        </CardHeader>
        
        <CardContent>
          {/* Transactions Table with Search and Rows per Page */}
          <TransactionsTable 
            transactions={filteredAndSortedTransactions}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;
