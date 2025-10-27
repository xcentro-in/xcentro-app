import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Invoice } from "@/data/mockInvoices";
import BillDetailsModal from "@/components/bills/BillDetailsModal";
import BillsTable from "@/components/bills/BillsTable";
import { Dialog, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "@/contexts/PageTitleContext";
import { useBills } from "@/hooks/useBills";

const Bills = () => {
  const navigate = useNavigate();
  const { setTitle } = usePageTitle();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    setSelectedInvoice(bill);
    setIsModalOpen(true);
  };

  const handlePayBill = async (billId: string) => {
    try {
      await payBill(billId);
      // Success feedback could be added here
      console.log('Bill paid successfully');
    } catch (error) {
      console.error('Failed to pay bill:', error);
    }
  };

  const handleRequestApproval = async (billId: string) => {
    try {
      await requestApproval(billId);
      console.log('Approval request sent successfully');
    } catch (error) {
      console.error('Failed to request approval:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInvoice(null);
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

  return (
    <>
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
            />
          )}
        </div>
      </div>

      {/* Bill Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogPortal>
          <DialogOverlay className="backdrop-blur-md bg-black/50" />
          <DialogPrimitive.Content
            className={cn(
              "fixed left-[50%] top-[50%] z-50 flex flex-col w-[95vw] max-w-7xl h-[95vh] max-h-[95vh] translate-x-[-50%] translate-y-[-50%] border-0 bg-background p-0 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg overflow-hidden"
            )}
          >
            {selectedInvoice && (
              <BillDetailsModal
                invoice={selectedInvoice}
                onClose={handleCloseModal}
                onPayBill={handlePayBill}
              />
            )}
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>
    </>
  );
};

export default Bills;