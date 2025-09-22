
import { useState } from "react";
import { CardContent } from "@/components/ui/card";
import TransactionsTable from "./TransactionsTable";
import { usePaymentHistory } from "@/hooks/usePaymentHistory";

interface PaymentsTableContainerProps {
  // No props needed - component is now self-contained
}

const PaymentsTableContainer = ({}: PaymentsTableContainerProps) => {
  // Self-managed state for server-side filtering and pagination
  const [dateRange, setDateRange] = useState<'last7days' | 'last30days' | 'last3months' | 'custom'>('last7days');
  const [customDateFrom, setCustomDateFrom] = useState<string>();
  const [customDateTo, setCustomDateTo] = useState<string>();
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'vendor' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Client-side search state (no API calls)
  const [searchValue, setSearchValue] = useState("");

  // Fetch data using the hook with server-side parameters
  const { transactions, pagination, appliedFilters, isLoading, error, refetch } = usePaymentHistory({
    dateRange,
    customDateFrom,
    customDateTo,
    status: statusFilter,
    paymentMethod: paymentMethodFilter,
    page,
    limit: itemsPerPage,
    sortBy,
    sortOrder
  });

  // Handle server-side filter changes (triggers API calls)
  const handleDateRangeChange = (newDateRange: typeof dateRange) => {
    setDateRange(newDateRange);
    setPage(1); // Reset to first page
  };

  const handleStatusFilterChange = (statuses: string[]) => {
    setStatusFilter(statuses);
    setPage(1);
  };

  const handlePaymentMethodFilterChange = (methods: string[]) => {
    setPaymentMethodFilter(methods);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setPage(1);
  };

  const handleSortChange = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
    setPage(1);
  };

  // Handle client-side search (no API calls)
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  // Show loading state
  if (isLoading) {
    return (
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </CardContent>
    );
  }

  // Show error state
  if (error) {
    return (
      <CardContent className="p-6">
        <div className="text-center py-8">
          <div className="text-muted-foreground mb-4">{error}</div>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </CardContent>
    );
  }

  return (
    <CardContent className="p-6">
      <TransactionsTable
        transactions={transactions}
        pagination={pagination}
        appliedFilters={appliedFilters}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        onPageChange={handlePageChange}
        onSortChange={handleSortChange}
        onDateRangeChange={handleDateRangeChange}
        onStatusFilterChange={handleStatusFilterChange}
        onPaymentMethodFilterChange={handlePaymentMethodFilterChange}
      />
    </CardContent>
  );
};

export default PaymentsTableContainer;
