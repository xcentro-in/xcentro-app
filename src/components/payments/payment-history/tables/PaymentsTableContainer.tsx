
import { useState, useEffect } from "react";
import { CardContent } from "@/components/ui/card";
import PayoutsTable from "./PayoutsTable";
import { usePaymentList } from "@/hooks/usePaymentList";
import { useAuth } from "@/contexts/AuthContext";

const PaymentsTableContainer = () => {
  const { user, optimisticallyUpdateOnboardingFlag } = useAuth();
  // The state for filters and pagination
  const [dateRange, setDateRange] = useState<'last7days' | 'last30days' | 'last3months' | 'custom'>('last30days');
  const [customDateFrom, setCustomDateFrom] = useState<string>();
  const [customDateTo, setCustomDateTo] = useState<string>();
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default to 10 items per page
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchValue, setSearchValue] = useState("");

  // Calculate offset for API call
  const offset = (page - 1) * itemsPerPage;

  // Fetch payments from API
  const { payouts, totalCount, isLoading, error, refetch } = usePaymentList({
    limit: itemsPerPage,
    offset: offset,
  });

  // Verification: Check if payments exist while flag is false, then flip flag
  useEffect(() => {
    if (!isLoading && !error && user) {
      // If flag is false BUT we have payments, optimistically update the flag
      if (!user.hasCreatedFirstPayment && totalCount > 0) {
        optimisticallyUpdateOnboardingFlag('hasCreatedFirstPayment', true);
      }
    }
  }, [isLoading, error, totalCount, user, optimisticallyUpdateOnboardingFlag]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setPage(1); // Reset to first page when items per page changes
  };

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
      {/*
        TODO: The filter controls would be rendered here, similar to the old table.
        They would be wired to the state variables above.
      */}
      <PayoutsTable
        payouts={payouts}
        page={page}
        itemsPerPage={itemsPerPage}
        totalItems={totalCount}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </CardContent>
  );
};

export default PaymentsTableContainer;
