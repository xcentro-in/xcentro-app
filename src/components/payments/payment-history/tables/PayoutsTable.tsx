import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, BanknoteIcon, ExternalLink, RefreshCw } from "lucide-react";
import TablePagination from "@/components/payee-history/TablePagination";
import { format } from "date-fns";
import { formatCurrency } from "@/utils/formatters";
import { Payout } from "@/types/payout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { processPaymentAPI } from "@/services/api";
import { toast } from "sonner";

interface PayoutsTableProps {
  payouts: Payout[];
  page: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (limit: number) => void;
}

const getStatusBadgeVariant = (status: Payout['status']): BadgeProps["variant"] => {
  switch (status) {
    case "Completed":
      return "success";
    case "In Progress":
      return "secondary";
    case "Failed":
      return "destructive";
    default:
      return "outline";
  }
};



const PayoutsTable: React.FC<PayoutsTableProps> = ({
  payouts,
  page,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const [expandedRowId, setExpandedRowId] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleRowClick = (payoutId: string) => {
    setExpandedRowId(expandedRowId === payoutId ? null : payoutId);
  };

  const handleViewDetails = (payoutId: string) => {
    navigate(`/payments/${payoutId}`);
  };

  const handleBillClick = (voucherId: string | undefined, billId: string, event: React.MouseEvent) => {
    // Prevent row expansion when clicking bill link
    event.stopPropagation();

    if (voucherId) {
      navigate(`/bills/${voucherId}`);
    } else {
      toast.error("Bill details not available");
      console.error(`No voucher ID found for bill: ${billId}`);
    }
  };

  // Handle retry payment
  const handleRetryPayment = async (payoutId: string, event: React.MouseEvent) => {
    // Prevent row expansion when clicking retry button
    event.stopPropagation();

    if (!user?.businessId) {
      toast.error("Unable to process payment. Please try logging in again.");
      return;
    }

    try {
      // Make retry payment API call
      const response = await processPaymentAPI.retryPayment(user.businessId, {
        original_payment_id: payoutId
      });

      // Extract redirect URL from response
      if (response.data?.redirect_url) {
        const redirectUrl = response.data.redirect_url;

        toast.success("Retry payment initiated successfully!");

        // Navigate to payment processing page with redirect URL
        navigate('/payment-processing', { state: { redirectUrl } });
      } else {
        // Fallback: if no redirect URL, show success and complete
        toast.success("Payment retry processed successfully!");
        navigate('/payments');
      }
    } catch (error) {
      console.error("Retry payment error:", error);
      toast.error("Payment retry failed", {
        description: error instanceof Error ? error.message : "Please try again"
      });
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4"> {/* New div for top-right positioning */}
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(value) => onItemsPerPageChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={itemsPerPage} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={String(pageSize)}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Date</TableHead>
              <TableHead className="w-[150px]">Payment ID</TableHead>
              <TableHead>Payee(s)</TableHead>
              <TableHead className="w-[100px]">Bills Paid</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead className="text-right">Total Amount</TableHead>
              <TableHead className="text-center w-[120px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payouts.length > 0 ? (
              payouts.map((payout) => (
                <React.Fragment key={payout.payoutId}>
                  <TableRow
                    onClick={() => handleRowClick(payout.payoutId)}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell className="text-muted-foreground">
                      <div>{format(new Date(payout.date), "dd/MM/yyyy")}</div>
                      <div className="text-xs">{format(new Date(payout.date), "hh:mm a")}</div>
                    </TableCell>
                    <TableCell className="font-medium text-primary">
                      {payout.payoutId.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{payout.payees[0]}</div>
                      {payout.payees.length > 1 && (
                        <div className="text-xs text-muted-foreground">
                          + {payout.payees.length - 1} more
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {payout.billCount} Bills
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {payout.paymentMethod.type === "credit" ? (
                          <CreditCard className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        ) : payout.paymentMethod.type === "upi" ? (
                          <BanknoteIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <BanknoteIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        )}
                        <div className="flex flex-col">
                          <span>
                            {payout.paymentMethod.type === "credit" && payout.paymentMethod.cardProvider
                              ? payout.paymentMethod.cardProvider
                              : payout.paymentMethod.type === "bank" && payout.paymentMethod.bank
                              ? payout.paymentMethod.bank
                              : payout.paymentMethod.type === "upi"
                              ? "UPI"
                              : payout.paymentMethod.type === "bnpl"
                              ? "Buy Now Pay Later"
                              : "Other"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            .... {payout.paymentMethod.last4}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(payout.totalAmount, true)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getStatusBadgeVariant(payout.status)} className="capitalize">
                        {payout.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                  {expandedRowId === payout.payoutId && (payout.breakdown ? (
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableCell colSpan={7}>
                        <div className="p-4 space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Payment ID</h4>
                            <p className="text-sm font-mono text-muted-foreground">{payout.payoutId}</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">Payees</h4>
                            <ul className="list-disc list-inside text-sm text-muted-foreground">
                              {payout.payees.map((payee, index) => (
                                <li key={index}>{payee}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Bill Breakdown</h4>
                            <div className="space-y-1">
                              {payout.breakdown.bills.map((bill) => (
                                <div key={bill.billId} className="flex justify-between text-sm">
                                  <Button variant="link" className="h-auto p-0 text-primary" onClick={(e) => handleBillClick(bill.voucherId, bill.billId, e)}>
                                    Bill #{bill.billId}
                                  </Button>
                                  <span>{formatCurrency(bill.amount, true)}</span>
                                </div>
                              ))}
                              <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Convenience Fee</span>
                                <span>{formatCurrency(payout.breakdown.convenienceFee, true)}</span>
                              </div>
                              <div className="flex justify-between text-sm text-muted-foreground">
                                <span>GST on Fee</span>
                                <span>{formatCurrency(payout.breakdown.gstOnFee, true)}</span>
                              </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                              {payout.status === "Failed" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-orange-500 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                                  onClick={(e) => handleRetryPayment(payout.payoutId, e)}
                                >
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Retry Payment
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetails(payout.payoutId)}
                              >
                                View Details <ExternalLink className="ml-2 h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        No breakdown details available.
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  No payouts found for the selected period.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center mt-4">
        <TablePagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};
export default PayoutsTable;