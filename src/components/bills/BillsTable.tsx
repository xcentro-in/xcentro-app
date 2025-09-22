import { cn } from "@/lib/utils";
import { Invoice } from "@/data/mockInvoices";
import { BillsPagination, BillsAppliedFilters } from "@/hooks/useBills";

// Import UI components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Icons
import {
  Search,
  Calendar,
  AlertCircle,
  CheckCircle
} from "lucide-react";

// Utilities
import { formatCurrency } from "@/utils/formatters";
import { formatPaymentDate } from "@/utils/dateFormatting";

interface BillsTableProps {
  bills: Invoice[];
  pagination: BillsPagination;
  appliedFilters: BillsAppliedFilters;
  searchValue: string;
  onSearchChange: (value: string) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  onPageChange: (page: number) => void;
  onSortChange: (column: 'dueDate' | 'billDate' | 'amount' | 'vendor' | 'status') => void;
  onStatusFilterChange: (status: 'all' | 'paid' | 'open' | 'overdue') => void;
  onBillSelect: (bill: Invoice) => void;
  onPayBill?: (billId: string) => void;
  isLoading?: boolean;
}

const BillsTable = ({
  bills,
  pagination,
  appliedFilters,
  searchValue,
  onSearchChange,
  itemsPerPage,
  onItemsPerPageChange,
  onPageChange,
  onSortChange,
  onStatusFilterChange,
  onBillSelect,
  onPayBill,
  isLoading = false
}: BillsTableProps) => {

  // Apply client-side search filter on current page data
  const searchFilteredBills = bills.filter(bill =>
    bill.vendorName.toLowerCase().includes(searchValue.toLowerCase()) ||
    bill.invoiceNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
    bill.amount.toString().includes(searchValue)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'open':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-3 w-3" />;
      case 'open':
        return <Calendar className="h-3 w-3" />;
      case 'overdue':
        return <AlertCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const isOverdue = (bill: Invoice) => {
    return bill.status === 'overdue';
  };

  const canPay = (bill: Invoice) => {
    return bill.status === 'open' || bill.status === 'overdue';
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search bills..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-80"
            />
          </div>

          {/* Status Filter Badges */}
          <div className="flex items-center space-x-2">
            <Button
              variant={appliedFilters.status === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onStatusFilterChange('all')}
            >
              All ({appliedFilters.totalResults})
            </Button>
            <Button
              variant={appliedFilters.status === 'overdue' ? 'destructive' : 'outline'}
              size="sm"
              onClick={() => onStatusFilterChange('overdue')}
            >
              Overdue ({appliedFilters.overdueCount})
            </Button>
            <Button
              variant={appliedFilters.status === 'open' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onStatusFilterChange('open')}
            >
              Open ({appliedFilters.openCount})
            </Button>
            <Button
              variant={appliedFilters.status === 'paid' ? 'outline' : 'outline'}
              size="sm"
              onClick={() => onStatusFilterChange('paid')}
            >
              Paid ({appliedFilters.paidCount})
            </Button>
          </div>
        </div>

        {/* Items per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Rows per page:</span>
          <Select 
            value={String(itemsPerPage)} 
            onValueChange={(value) => onItemsPerPageChange(Number(value))}
          >
            <SelectTrigger className="w-[80px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="10">20</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

      </div>
      {/* Bills Table */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead
                className="cursor-pointer hover:bg-muted/80"
                onClick={() => onSortChange('vendor')}
              >
                Vendor
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/80"
                onClick={() => onSortChange('billDate')}
              >
                Invoice #
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/80"
                onClick={() => onSortChange('dueDate')}
              >
                Due Date
              </TableHead>
              <TableHead
                className="text-right cursor-pointer hover:bg-muted/80"
                onClick={() => onSortChange('amount')}
              >
                Amount
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/80"
                onClick={() => onSortChange('status')}
              >
                Status
              </TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {searchFilteredBills.length > 0 ? (
              searchFilteredBills.map((bill) => (
                <TableRow
                  key={bill.id}
                  className={cn(
                    "cursor-pointer hover:bg-muted/50 transition-colors",
                    isOverdue(bill) && "bg-red-50 hover:bg-red-100/50"
                  )}
                  onClick={() => onBillSelect(bill)}
                >
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{bill.vendorName}</div>
                      {bill.gstin && (
                        <div className="text-xs text-muted-foreground">
                          GSTIN: {bill.gstin}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="font-mono text-sm">{bill.invoiceNumber}</div>
                  </TableCell>

                  <TableCell>
                    <div className={cn(
                      "text-sm",
                      isOverdue(bill) && "text-red-600 font-medium"
                    )}>
                      {formatPaymentDate(bill.dueDate)}
                    </div>
                  </TableCell>

                  <TableCell className="text-right font-medium">
                    {formatCurrency(bill.amount)}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("capitalize text-xs", getStatusColor(bill.status))}
                    >
                      <span className="flex items-center gap-1">
                        {getStatusIcon(bill.status)}
                        {bill.status}
                      </span>
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center justify-center">
                      {canPay(bill) && onPayBill && (
                        <Button
                          size="sm"
                          variant={isOverdue(bill) ? "destructive" : "default"}
                          onClick={(e) => {
                            e.stopPropagation();
                            onPayBill(bill.id);
                          }}
                          className="h-7 px-3 text-xs"
                        >
                          Pay
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="text-muted-foreground">
                    {isLoading ? "Loading bills..." : "No bills found"}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.total > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} bills
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(pagination.page - 1)}
                  className={cn(pagination.page === 1 && "opacity-50 pointer-events-none")}
                />
              </PaginationItem>

              {/* Generate page numbers */}
              {Array.from({ length: Math.min(5, pagination.totalPages) }).map((_, index) => {
                let pageNum = index + 1;

                // Adjust pagination display for many pages
                if (pagination.totalPages > 5) {
                  if (pagination.page > 3 && pagination.page <= pagination.totalPages - 2) {
                    pageNum = pagination.page - 2 + index;
                  } else if (pagination.page > pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + index;
                  }
                }

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      isActive={pagination.page === pageNum}
                      onClick={() => onPageChange(pageNum)}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange(pagination.page + 1)}
                  className={cn(pagination.page === pagination.totalPages && "opacity-50 pointer-events-none")}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default BillsTable;