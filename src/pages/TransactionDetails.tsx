import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Printer, FileText, CheckCircle2, XCircle, CreditCard, BanknoteIcon, RefreshCcw, CalendarIcon } from "lucide-react";
import { getMockTransactionDetail } from "@/data/mockTransactionDetails";
import { Transaction, TransactionStatus } from "@/types/transaction";
import { format } from "date-fns";
import { TransactionStatusBadge } from "@/components/transactions/TransactionStatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { TransactionPaymentMethod } from "@/components/transactions/TransactionPaymentMethod";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { TransactionDetailCard } from "@/components/transactions/TransactionDetailCard";
import { TransactionAuditTrail } from "@/components/transactions/TransactionAuditTrail";
import { toast } from "sonner";

const TransactionDetails = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      try {
        const transactionData = getMockTransactionDetail(id);
        setTransaction(transactionData);
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

  const handleViewInvoice = () => {
    toast.success("Opening invoice...");
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
        <div className="flex gap-2">
          {transaction.invoice && <Button variant="outline" className="gap-1" onClick={handleViewInvoice}>
              <FileText className="h-4 w-4" />
              View Invoice
            </Button>}
          <Button variant="outline" className="gap-1" onClick={handleDownloadPdf}>
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" className="gap-1" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      {/* Transaction Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="animate-fade-in">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold mb-1">{transaction.vendor}</h1>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <span>Transaction ID: {transaction.transactionId}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(transaction.transactionId);
                      toast.success("Transaction ID copied to clipboard");
                    }}
                    className="hover:text-primary transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <TransactionStatusBadge status={transaction.status} className="text-sm" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mt-6">
              <div>
                <div className="text-sm text-muted-foreground">Amount</div>
                <div className="text-2xl font-bold">
                  ${transaction.amount.toLocaleString(undefined, {
                  minimumFractionDigits: 2
                })}
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">Date</div>
                <div className="font-medium">
                  {format(new Date(transaction.date), "MMMM d, yyyy")}
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(transaction.date), "h:mm a")}
                </div>
              </div>

              <div>


              </div>

              <div>
                <div className="text-sm text-muted-foreground">Transaction Type</div>
                <div className="flex items-center gap-2 font-medium">
                  {transaction.type === "recurring" ? <>
                      <RefreshCcw className="h-4 w-4 text-blue-500" />
                      Recurring Payment
                    </> : transaction.type === "batch" ? <>
                      <div className="h-4 w-4 flex items-center justify-center">
                        <div className="h-3 w-3 bg-purple-100 rounded-sm border border-purple-300"></div>
                        <div className="h-3 w-3 bg-purple-100 rounded-sm border border-purple-300 -ml-1.5 -mt-1.5"></div>
                      </div>
                      Batch Payment
                    </> : <>
                      <div className="h-4 w-4 flex items-center justify-center">
                        <div className="h-3 w-3 bg-gray-100 rounded-sm border border-gray-300"></div>
                      </div>
                      Single Payment
                    </>}
                </div>
              </div>
            </div>

            {transaction.isRecurring && transaction.nextPaymentDate && <div className="mt-4 rounded-md bg-blue-50 p-3 flex gap-2 items-center text-blue-700 text-sm">
                <CalendarIcon className="h-4 w-4 flex-shrink-0" />
                <p>
                  Next payment scheduled for{" "}
                  <span className="font-semibold">
                    {format(new Date(transaction.nextPaymentDate), "MMMM d, yyyy")}
                  </span>
                </p>
              </div>}

            {transaction.description && <div className="mt-4">
                <div className="text-sm text-muted-foreground">Description</div>
                <p className="mt-1">{transaction.description}</p>
              </div>}
          </CardContent>
        </Card>

        {/* Action Buttons for Pending Transactions */}
        {(canApprove(transaction.status) || canReject(transaction.status) || canCancel(transaction.status)) && <Card className="animate-fade-in print:hidden">
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
          </Card>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Details */}
        <TransactionDetailCard title="Payment Details" className="col-span-1 lg:col-span-2 animate-fade-in" style={{
        animationDelay: "50ms"
      }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div>
              <h3 className="font-medium mb-4">Amount Breakdown</h3>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 text-muted-foreground">Transaction Amount</td>
                    <td className="py-2 text-right font-medium">
                      ${transaction.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2
                    })}
                    </td>
                  </tr>

                  {transaction.fees?.map((fee, index) => <tr key={index} className="border-b">
                      <td className="py-2 text-muted-foreground">{fee.type}</td>
                      <td className="py-2 text-right font-medium">
                        ${fee.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2
                    })}
                      </td>
                    </tr>)}

                  <tr className="border-b bg-gray-50">
                    <td className="py-2 font-medium">Total Amount</td>
                    <td className="py-2 text-right font-bold">
                      ${calculateTotalWithFees(transaction).toLocaleString(undefined, {
                      minimumFractionDigits: 2
                    })}
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
                    {transaction.method === "credit" ? <>
                        <CreditCard className="h-4 w-4 text-primary" />
                        <span className="font-medium">Credit Card</span>
                        {transaction.accountDetails?.cardProvider && <Badge variant="outline" className="font-normal">
                            {transaction.accountDetails.cardProvider}
                          </Badge>}
                      </> : <>
                        <BanknoteIcon className="h-4 w-4 text-purple-500" />
                        <span className="font-medium">Bank Transfer</span>
                        {transaction.accountDetails?.bank && <Badge variant="outline" className="font-normal">
                            {transaction.accountDetails.bank}
                          </Badge>}
                      </>}
                  </div>
                  {transaction.method === "credit" && transaction.accountDetails?.cardLast4 && <div className="text-sm text-muted-foreground mt-1">
                      Card ending in {transaction.accountDetails.cardLast4}
                    </div>}
                  {transaction.method === "bank" && transaction.accountDetails?.accountNumberLast4 && <div className="text-sm text-muted-foreground mt-1">
                      Account ending in {transaction.accountDetails.accountNumberLast4}
                    </div>}
                </div>

                {transaction.scheduledDate && <div>
                    <div className="text-sm text-muted-foreground">Scheduled Date</div>
                    <div className="font-medium mt-1">
                      {format(new Date(transaction.scheduledDate), "MMMM d, yyyy")}
                    </div>
                  </div>}

                {transaction.isRecurring && <div>
                    <div className="text-sm text-muted-foreground">Recurring Payment</div>
                    <div className="flex items-center gap-2 mt-1">
                      <RefreshCcw className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Monthly</span>
                    </div>
                    {transaction.nextPaymentDate && <div className="text-sm text-muted-foreground mt-1">
                        Next payment on {format(new Date(transaction.nextPaymentDate), "MMMM d, yyyy")}
                      </div>}
                  </div>}
              </div>
            </div>
          </div>
        </TransactionDetailCard>

        {/* Initiation & Approval */}
        <TransactionDetailCard title="Initiation & Approval" className="animate-fade-in" style={{
        animationDelay: "100ms"
      }}>
          <div className="p-6 space-y-4">
            {transaction.initiatedBy && <div>
                <div className="text-sm text-muted-foreground">Initiated By</div>
                <div className="font-medium mt-1">{transaction.initiatedBy.name}</div>
                <div className="text-sm text-muted-foreground">
                  {transaction.initiatedBy.role}
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(transaction.date), "MMMM d, yyyy 'at' h:mm a")}
                </div>
              </div>}

            <Separator />

            {transaction.approvedBy ? <div>
                <div className="text-sm text-muted-foreground">Approved By</div>
                <div className="font-medium mt-1">{transaction.approvedBy.name}</div>
                <div className="text-sm text-muted-foreground">
                  {transaction.approvedBy.role}
                </div>
                {transaction.approvedBy.date && <div className="text-xs text-muted-foreground">
                    {format(new Date(transaction.approvedBy.date), "MMMM d, yyyy 'at' h:mm a")}
                  </div>}
              </div> : <div>
                <div className="text-sm text-muted-foreground">Approval Status</div>
                <div className="mt-1">
                  <TransactionStatusBadge status={transaction.status} />
                </div>
              </div>}

            {transaction.notes && <>
                <Separator />
                <div>
                  <div className="text-sm text-muted-foreground">Notes</div>
                  <div className="p-3 bg-muted/50 rounded-md mt-1 text-sm">
                    {transaction.notes}
                  </div>
                </div>
              </>}
          </div>
        </TransactionDetailCard>
      </div>

      {/* Audit Trail */}
      {transaction.auditTrail && transaction.auditTrail.length > 0 && <TransactionDetailCard title="Audit Trail" className="animate-fade-in" style={{
      animationDelay: "150ms"
    }}>
          <div className="p-6">
            <TransactionAuditTrail auditTrail={transaction.auditTrail} />
          </div>
        </TransactionDetailCard>}
    </div>;
};

export default TransactionDetails;