
import { Card } from "@/components/ui/card";

// Import new components and hooks
import PaymentsHeader from "@/components/payments/PaymentsHeader";
import FiltersContainer from "@/components/payments/FiltersContainer";
import PaymentsTableContainer from "@/components/payments/PaymentsTableContainer";
import { usePaymentFilters } from "@/hooks/usePaymentFilters";
import { useTransactionTable } from "@/hooks/useTransactionTable";

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
  // Use our custom hooks
  const filterState = usePaymentFilters();
  
  const {
    dateFilter,
    dateRange,
    statusFilter,
    methodFilter,
    categoryFilter,
    showCustomDateRange,
    filtersChanged,
    activeFilters,
    appliedDateRange,
    appliedStatusFilter,
    appliedMethodFilter,
    appliedCategoryFilter,
    applyFilters,
    handleDateFilterChange,
    handleStatusFilterChange,
    handleMethodFilterChange,
    handleCategoryFilterChange,
    removeFilter,
    resetToDefaultFilters,
    handleDateRangeChange
  } = filterState;

  const tableState = useTransactionTable({
    transactions,
    appliedStatusFilter,
    appliedMethodFilter,
    appliedCategoryFilter,
    appliedDateRange
  });

  const {
    searchValue,
    setSearchValue,
    sortField,
    sortDirection,
    itemsPerPage,
    setItemsPerPage,
    handleSort,
    filteredAndSortedTransactions
  } = tableState;
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PaymentsHeader />

      <Card className="animate-scale-in">
        {/* Filter Section */}
        <FiltersContainer 
          dateFilter={dateFilter}
          dateRange={dateRange}
          statusFilter={statusFilter}
          methodFilter={methodFilter}
          categoryFilter={categoryFilter}
          showCustomDateRange={showCustomDateRange}
          filtersChanged={filtersChanged}
          activeFilters={activeFilters}
          appliedDateRange={appliedDateRange}
          onDateFilterChange={handleDateFilterChange}
          onStatusFilterChange={handleStatusFilterChange}
          onMethodFilterChange={handleMethodFilterChange}
          onCategoryFilterChange={handleCategoryFilterChange}
          onDateRangeChange={handleDateRangeChange}
          onApplyFilters={applyFilters}
          onResetFilters={resetToDefaultFilters}
          onRemoveFilter={removeFilter}
        />
        
        {/* Transactions Table Container */}
        <PaymentsTableContainer 
          transactions={filteredAndSortedTransactions}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </Card>
    </div>
  );
};

export default Payments;
