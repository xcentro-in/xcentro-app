import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { Invoice } from "@/data/mockInvoices";
import BillsTable from "@/components/bills/BillsTable";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "@/contexts/PageTitleContext";
import { useBills } from "@/hooks/useBills";
import { useAuth } from "@/contexts/AuthContext";
import { useVoucherCounts } from "@/hooks/useVoucherCounts";
import PaymentMethodAndReviewStep, { PaymentItem } from "@/components/payments/shared/PaymentMethodAndReviewStep";
import { formatDueDate } from "@/utils/dateFormatting";

const Bills = () => {
  const navigate = useNavigate();
  const { setTitle } = usePageTitle();
  const { user } = useAuth();
  const [searchValue, setSearchValue] = useState("");

  // Payment view state
  const [isPaymentView, setIsPaymentView] = useState(false);
  const [selectedBillForPayment, setSelectedBillForPayment] = useState<Invoice | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");

  // Bills data management
  const [billsFilters, setBillsFilters] = useState({
    status: 'all' as 'all' | 'paid' | 'open' | 'overdue',
    page: 1,
    limit: 20,
    sortBy: 'dueDate' as 'dueDate' | 'billDate' | 'amount' | 'vendor' | 'status',
    sortOrder: 'asc' as 'asc' | 'desc'
  });

  // Use server-side hook for bills data
  const {
    bills,
    pagination,
    isLoading,
    error,
    payBill,
    requestApproval
  } = useBills(billsFilters);

  // Fetch voucher counts
  const { counts, refetch: refetchCounts } = useVoucherCounts();

  useEffect(() => {
    setTitle("Bills");
  }, [setTitle]);

  // Event handlers for table
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handleItemsPerPageChange = (value: number) => {
    setBillsFilters(prev => ({ ...prev, limit: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setBillsFilters(prev => ({ ...prev, page }));
  };

  const handleSortChange = (column: 'dueDate' | 'billDate' | 'amount' | 'vendor' | 'status') => {
    setBillsFilters(prev => ({
      ...prev,
      sortBy: column,
      sortOrder: prev.sortBy === column && prev.sortOrder === 'desc' ? 'asc' : 'desc',
      page: 1
    }));
  };

  const handleStatusFilterChange = (status: 'all' | 'paid' | 'open' | 'overdue') => {
    setBillsFilters(prev => ({ ...prev, status, page: 1 }));
  };

  const handleBillSelect = (bill: Invoice) => {
    // Navigate to bill detail page
    navigate(`/bills/${bill.id}`);
  };

  const handlePayBill = async (billId: string) => {
    // Find the bill from the bills list
    const billToPay = bills.find(bill => bill.id === billId);
    if (billToPay) {
      setSelectedBillForPayment(billToPay);
      setIsPaymentView(true);
    }
  };

  const handleBackToBills = () => {
    setIsPaymentView(false);
    setSelectedBillForPayment(null);
    setSelectedPaymentMethod("");
  };

  const handlePaymentSubmit = async () => {
    if (selectedBillForPayment) {
      try {
        // Call the payBill function from the hook
        await payBill(selectedBillForPayment.id);

        // Refetch voucher counts to update the UI
        refetchCounts();

        // Return to bills view
        handleBackToBills();

        console.log('Bill paid successfully');
      } catch (error) {
        console.error('Failed to pay bill:', error);
        // Error is already handled by the payment component
      }
    }
  };

  const handleRequestApproval = async (billId: string) => {
    if (!user?.id) {
      console.error('User ID not available');
      throw new Error('User not authenticated');
    }

    try {
      const result = await requestApproval(billId, user.id);
      console.log('Approval request sent successfully:', result.message);
      return result; // Return the result so BillsTable can use the message
    } catch (error) {
      console.error('Failed to request approval:', error);
      throw error; // Re-throw so BillsTable can handle the error
    }
  };

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  // Prepare payment items when in payment view
  const paymentItems: PaymentItem[] = selectedBillForPayment
    ? [
        {
          id: selectedBillForPayment.id,
          name: selectedBillForPayment.vendorName,
          amount: selectedBillForPayment.amount,
          description: `Invoice #${selectedBillForPayment.invoiceNumber}`,
        },
      ]
    : [];

  // If in payment view, render the payment component
  if (isPaymentView && selectedBillForPayment) {
    return (
      <div className="h-full flex flex-col">
        {/* Header with back button */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBackToBills}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bills
            </Button>
            <span className="text-lg font-semibold">Pay Bill</span>
          </div>
        </div>

        {/* Payment Component */}
        <div className="flex-1 overflow-auto p-6">
          <PaymentMethodAndReviewStep
            totalAmount={selectedBillForPayment.amount}
            paymentItems={paymentItems}
            summaryType="simple"
            scheduleText={formatDueDate(selectedBillForPayment.dueDate)}
            selectedPaymentMethod={selectedPaymentMethod}
            onPaymentMethodChange={setSelectedPaymentMethod}
            onBack={handleBackToBills}
            onSubmit={handlePaymentSubmit}
            additionalSummaryData={{
              invoiceReference: selectedBillForPayment.invoiceNumber,
              vendorName: selectedBillForPayment.vendorName,
              gstin: selectedBillForPayment.gstin,
            }}
            paymentContext="vendor_payment"
            voucherIds={[selectedBillForPayment.id]}
          />
        </div>
      </div>
    );
  }

  // Default view: Bills table
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">Bills</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/bills/new')}>
              <Plus className="h-4 w-4 mr-2" />
              New Bill
            </Button>
          </div>
        </div>
      </div>

      {/* Bills Table */}
      <div className="flex-1 overflow-auto p-4">
        {isLoading ? (
          <div className="space-y-4">
            <div className="animate-pulse space-y-4">
              {/* Search and Filter Bar Skeleton */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-80 bg-gray-200 rounded"></div>
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                    <div className="h-8 w-20 bg-gray-200 rounded"></div>
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-20 bg-gray-200 rounded"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>
              {/* Table Skeleton */}
              <div className="rounded-md border overflow-hidden">
                <div className="h-12 bg-gray-100 border-b"></div>
                <div className="space-y-0">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-16 border-b bg-white"></div>
                  ))}
                </div>
              </div>
              {/* Pagination Skeleton */}
              <div className="flex items-center justify-between mt-4">
                <div className="h-4 w-48 bg-gray-200 rounded"></div>
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-20 bg-gray-200 rounded"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ) :
        (
          <BillsTable
            bills={bills}
            pagination={pagination}
            currentStatus={billsFilters.status}
            searchValue={searchValue}
            onSearchChange={handleSearchChange}
            itemsPerPage={billsFilters.limit}
            onItemsPerPageChange={handleItemsPerPageChange}
            onPageChange={handlePageChange}
            onSortChange={handleSortChange}
            onStatusFilterChange={handleStatusFilterChange}
            onBillSelect={handleBillSelect}
            onPayBill={handlePayBill}
            onRequestApproval={handleRequestApproval}
            isLoading={isLoading}
            voucherCounts={counts}
          />
        )}
      </div>
    </div>
  );
};

export default Bills;