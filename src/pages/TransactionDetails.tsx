import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Printer, FileText, CheckCircle2, XCircle, CreditCard, BanknoteIcon, RefreshCcw, CalendarIcon, MoreVertical } from "lucide-react";
import { getMockTransactionDetail } from "@/data/mockTransactionDetails";
import { Transaction, TransactionStatus } from "@/types/transaction";
import { format } from "date-fns";
import { formatCurrency } from "@/utils/formatters";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TransactionStatusBadge } from "@/components/transactions/TransactionStatusBadge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { TransactionDetailCard } from "@/components/transactions/TransactionDetailCard";
import { toast } from "sonner";

const TransactionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      try {
        const transactionData = getMockTransactionDetail(id);
        // Mock bill data for demonstration
        const transactionWithBill = {
          ...transactionData,
          category: "Software Subscription",
          fees: [
            { type: "Convenience Fee", amount: 24 },
            { type: "GST on Fee", amount: 4.32 }
          ],
          bill: {
            id: "BILL-2023-001",
            date: "2023-10-15T10:00:00.000Z",
            amount: 1200,
          },
          auditTrail: [
            { status: "Voucher Created", user: "Alex Smith", role: "Finance Clerk", date: "2023-10-24T09:00:00.000Z" },
            { status: "Approved", user: "Jane Doe", role: "Finance Manager", date: "2023-10-24T11:30:00.000Z" },
            { status: "Payment Initiated", user: "Alex Smith", role: "Finance Clerk", date: "2023-10-25T10:00:00.000Z" },
            { status: "Completed", user: "System", role: "", date: transactionData.date },
          ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
          initiatedBy: undefined,
          approvedBy: undefined,
        };
        setTransaction(transactionWithBill);
      } catch (error) {
        console.error("Error fetching transaction:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    toast.success("Transaction summary downloaded successfully");
  };

  const calculateTotalWithFees = (transaction: Transaction): number => {
    const fees = transaction.fees?.reduce((sum, fee) => sum + fee.amount, 0) || 0;
    return transaction.amount + fees;
  };

  const canApprove = (status: TransactionStatus): boolean => {
    return status === "pending_approval";
  };

  const canReject = (status: TransactionStatus): boolean => {
    return status === "pending_approval";
  };

  const canCancel = (status: TransactionStatus): boolean => {
    return status === "upcoming" || status === "pending_approval" || status === "pending";
  };

  const handleApprove = () => {
    toast.success("Transaction approved successfully");
  };

  const handleReject = () => {
    toast.error("Transaction rejected");
  };

  const handleCancel = () => {
    toast.success("Transaction cancelled successfully");
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-lg text-muted-foreground">Loading transaction details...</div>
    </div>;
  }

  if (!transaction) {
    return <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" className="gap-1" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-xl font-medium mb-2">Transaction Not Found</div>
        <p className="text-muted-foreground">
          The transaction you're looking for doesn't exist or has been removed.
        </p>
        <Button className="mt-4" onClick={() => navigate("/payments")}>
          Go to Payments
        </Button>
      </div>
    </div>;
  }

  return <div className="space-y-6 pb-12 print:p-6">
    <div className="flex items-center justify-between print:hidden">
      <Button variant="ghost" className="gap-1" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4" />
        Back to Transactions
      </Button>
      <div className="flex items-center gap-2">
        {transaction.bill && (
          <Button variant="outline" className="gap-1" onClick={() => toast.success("Opening original bill...")}>
            <FileText className="h-4 w-4" />
            View Original Bill
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleDownloadPdf}>
              <Download className="mr-2 h-4 w-4" />
              <span>Download PDF</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              <span>Print</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between pb-4">
            <div>
              <h2 className="text-2xl font-bold">{transaction.vendor}</h2>
              <p className="text-muted-foreground">
                Payment for <a href="#" className="text-primary hover:underline">Bill #{transaction.bill?.id}</a>
              </p>
            </div>
            <TransactionStatusBadge status={transaction.status} />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Total Paid</p>
                <p className="font-medium text-lg">
                  {formatCurrency(calculateTotalWithFees(transaction), true)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Payment Date</p>
                <p className="font-medium">{format(new Date(transaction.date), "MMM d, yyyy")}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Bill Date</p>
                <p className="font-medium">{transaction.bill ? format(new Date(transaction.bill.date), "MMM d, yyyy") : 'N/A'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Category</p>
                <Badge variant="outline" className="mt-1">{transaction.category}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {(canApprove(transaction.status) || canReject(transaction.status) || canCancel(transaction.status)) && (
          <Card className="animate-fade-in print:hidden">
            <CardContent className="p-6">
              <h2 className="text-base font-medium mb-4">Transaction Actions</h2>
              <div className="space-y-4">
                {canApprove(transaction.status) && <div className="flex justify-between items-center border-b pb-4">
                  <div>
                    <div className="font-medium">Approve Transaction</div>
                    <div className="text-sm text-muted-foreground">
                      Review and approve this transaction
                    </div>
                  </div>
                  <Button className="gap-1 bg-green-600 hover:bg-green-700" onClick={handleApprove}>
                    <CheckCircle2 className="h-4 w-4" />
                    Approve
                  </Button>
                </div>}

                {canReject(transaction.status) && <div className="flex justify-between items-center border-b pb-4">
                  <div>
                    <div className="font-medium">Reject Transaction</div>
                    <div className="text-sm text-muted-foreground">
                      Decline this transaction
                    </div>
                  </div>
                  <Button variant="destructive" className="gap-1" onClick={handleReject}>
                    <XCircle className="h-4 w-4" />
                    Reject
                  </Button>
                </div>}

                {canCancel(transaction.status) && <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Cancel Transaction</div>
                    <div className="text-sm text-muted-foreground">
                      Cancel this pending transaction
                    </div>
                  </div>
                  <Button variant="outline" className="gap-1 text-red-600 border-red-200 hover:bg-red-50" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <TransactionDetailCard title="Payment & Fees" className="col-span-1 lg:col-span-2 animate-fade-in" style={{ animationDelay: "50ms" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div>
            <h3 className="font-medium mb-4">Amount Breakdown</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 text-muted-foreground">Bill Amount</td>
                  <td className="py-2 text-right font-medium">
                    {formatCurrency(transaction.amount, true)}
                  </td>
                </tr>

                {transaction.fees?.map((fee, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 text-muted-foreground">{fee.type}</td>
                    <td className="py-2 text-right font-medium">
                      {formatCurrency(fee.amount, true)}
                    </td>
                  </tr>
                ))}

                <tr className="border-b bg-gray-50">
                  <td className="py-2 font-medium">Total Paid</td>
                  <td className="py-2 text-right font-bold">
                    {formatCurrency(calculateTotalWithFees(transaction), true)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h3 className="font-medium mb-4">Payment Information</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground">Payment Method</div>
                <div className="flex items-center gap-2 mt-1">
                  {transaction.method === "credit" ? (
                    <>
                      <CreditCard className="h-4 w-4 text-primary" />
                      <span className="font-medium">Credit Card</span>
                      {transaction.accountDetails?.cardProvider && <Badge variant="outline" className="font-normal">{transaction.accountDetails.cardProvider}</Badge>}
                    </>
                  ) : (
                    <>
                      <BanknoteIcon className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">Bank Transfer</span>
                      {transaction.accountDetails?.bank && <Badge variant="outline" className="font-normal">{transaction.accountDetails.bank}</Badge>}
                    </>
                  )}
                </div>
                {transaction.method === "credit" && transaction.accountDetails?.cardLast4 && <div className="text-sm text-muted-foreground mt-1">Card ending in {transaction.accountDetails.cardLast4}</div>}
                {transaction.method === "bank" && transaction.accountDetails?.accountNumberLast4 && <div className="text-sm text-muted-foreground mt-1">Account ending in {transaction.accountDetails.accountNumberLast4}</div>}
              </div>

              {transaction.scheduledDate && <div>
                <div className="text-sm text-muted-foreground">Scheduled Date</div>
                <div className="font-medium mt-1">{format(new Date(transaction.scheduledDate), "MMMM d, yyyy")}</div>
              </div>}

              {transaction.isRecurring && <div>
                <div className="text-sm text-muted-foreground">Recurring Payment</div>
                <div className="flex items-center gap-2 mt-1">
                  <RefreshCcw className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Monthly</span>
                </div>
                {transaction.nextPaymentDate && <div className="text-sm text-muted-foreground mt-1">Next payment on {format(new Date(transaction.nextPaymentDate), "MMMM d, yyyy")}</div>}
              </div>}
            </div>
          </div>
        </div>
      </TransactionDetailCard>

      <TransactionDetailCard title="Activity" className="animate-fade-in" style={{ animationDelay: "100ms" }}>
        <CardContent className="p-6 space-y-4">
          <ul className="space-y-6">
            {transaction.auditTrail?.map((activity, index) => (
              <li key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                    {activity.status === 'Voucher Created' && <FileText className="h-4 w-4 text-muted-foreground" />}
                    {activity.status === 'Approved' && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                    {activity.status === 'Payment Initiated' && <RefreshCcw className="h-4 w-4 text-blue-500" />}
                    {activity.status === 'Completed' && <CheckCircle2 className="h-4 w-4 text-primary" />}
                  </div>
                </div>
                <div className="flex-grow">
                  <p className="font-medium text-sm">{activity.status}</p>
                  <p className="text-sm text-muted-foreground">
                    by {activity.user} {activity.role && <span className="text-xs">({activity.role})</span>}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {format(new Date(activity.date), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          {transaction.notes && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                <div className="p-3 bg-muted/50 rounded-md mt-2 text-sm">{transaction.notes}</div>
              </div>
            </>
          )}
        </CardContent>
      </TransactionDetailCard>
    </div>
  </div>;
};

export default TransactionDetails;