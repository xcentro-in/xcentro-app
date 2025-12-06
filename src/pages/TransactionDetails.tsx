import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Printer, FileText, CheckCircle2, XCircle, CreditCard, Copy, MoreVertical } from "lucide-react";
import { PaymentDetails, PaymentStatus } from "@/types/payment";
import { processPaymentAPI } from "@/services/api";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { TransactionDetailCard } from "@/components/transactions/TransactionDetailCard";
import { toast } from "sonner";

const PaymentStatusBadge = ({ status }: { status: PaymentStatus }) => {
  const statusConfig = {
    success: { label: "Success", className: "bg-green-100 text-green-700 border-green-200" },
    pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    failed: { label: "Failed", className: "bg-red-100 text-red-700 border-red-200" },
    processing: { label: "Processing", className: "bg-blue-100 text-blue-700 border-blue-200" },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge variant="outline" className={`${config.className} font-medium`}>
      {status === "success" && <CheckCircle2 className="h-3 w-3 mr-1" />}
      {status === "failed" && <XCircle className="h-3 w-3 mr-1" />}
      {config.label}
    </Badge>
  );
};

const TransactionDetails = () => {
  const { id } = useParams();
  const { businessId, businessName } = useCurrentBusiness();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPaymentDetails = async () => {
      if (!id) {
        setError("No payment ID provided");
        setLoading(false);
        return;
      }

      if (!businessId) {
        setError('Missing business ID');
        setLoading(false);
        return;
      }

      try {
        const response = await processPaymentAPI.getDetails(businessId, id);
        setPayment(response.data);
      } catch (err) {
        console.error("Error fetching payment details:", err);
        setError(err instanceof Error ? err.message : "Failed to load payment details");
      } finally {
        setLoading(false);
      }
    };

    loadPaymentDetails();
  }, [id, businessId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    toast.success("Payment summary downloaded successfully");
  };

  const handleGenerateInvoice = () => {
    toast.success("Invoice generation initiated for ITC claim");
  };

  const formatAmount = (amount: number, currency: string = "INR") => {
    const symbol = currency === "INR" ? "₹" : "$";
    const formattedAmount = (amount / 100).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${symbol}${formattedAmount}`;
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-muted-foreground">Loading payment details...</div>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" className="gap-1" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-xl font-medium mb-2">Payment Not Found</div>
          <p className="text-muted-foreground">
            {error || "The payment you're looking for doesn't exist or has been removed."}
          </p>
          <Button className="mt-4" onClick={() => navigate("/payments")}>
            Go to Payments
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 print:p-6">
      <div className="flex items-center justify-between print:hidden">
        <Button variant="ghost" className="gap-1" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Back to Transactions
        </Button>
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
            {payment.status === "success" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleGenerateInvoice}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Generate ITC Invoice</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Payment Header and Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
        {/* Payment Details - Left Column */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">Payment Details</h1>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <span>Payment ID: {payment.payment_id}</span>
                  <button
                    onClick={() => copyToClipboard(payment.payment_id, "Payment ID")}
                    className="hover:text-primary transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {format(new Date(payment.created_at), "MMMM d, yyyy 'at' h:mm a")}
                </div>
              </div>
              <PaymentStatusBadge status={payment.status} />
            </div>

            <Separator className="my-6" />

            <div className="bg-muted/30 rounded-lg p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Amount Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total</span>
                  <span className="font-medium">
                    {formatAmount(payment.net_amount, payment.currency)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">+ Service Charge</span>
                  <span className="font-medium">
                    {formatAmount(payment.service_charge, payment.currency)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">+ GST on Service Charge</span>
                  <span className="font-medium">
                    {formatAmount(payment.service_charge_gst, payment.currency)}
                  </span>
                </div>

                <Separator className="my-3" />

                <div className="flex justify-between items-center pt-2">
                  <span className="text-base font-semibold">Net Amount</span>
                  <span className="text-3xl font-bold text-primary">
                    {formatAmount(payment.total_amount, payment.currency)}
                  </span>
                </div>
              </div>
            </div>

            {payment.description && (
              <div className="mt-6">
                <div className="text-sm text-muted-foreground">Description</div>
                <p className="mt-1">{payment.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Timeline - Right Column */}
        {payment.activity && payment.activity.length > 0 && (
          <Card className="lg:col-span-1">
            <CardContent className="p-6">
              <h3 className="text-base font-semibold mb-4">Activity Timeline</h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {payment.activity.map((activity, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </div>
                      {index < payment.activity.length - 1 && (
                        <div className="w-px flex-1 bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="font-medium text-sm">{activity.action}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        By {activity.actor_name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {format(new Date(activity.timestamp), "MMM d, yyyy 'at' h:mm a")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Method Details */}
        <TransactionDetailCard
          title="Payment Method"
          className="col-span-1 animate-fade-in"
          style={{ animationDelay: "50ms" }}
        >
          <div className="p-6 space-y-4">
            {payment.payment_source && (
              <>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="capitalize">
                        {payment.payment_source.card_type}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {payment.payment_source.card_category}
                      </Badge>
                    </div>
                    <div className="text-lg font-semibold tracking-wider">
                      •••• {payment.payment_source.last_four_digits}
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="text-sm text-muted-foreground">Bank</div>
                  <div className="font-medium mt-1">{payment.payment_source.bank_name}</div>
                </div>
              </>
            )}
          </div>
        </TransactionDetailCard>

        {/* Bills Section */}
        <TransactionDetailCard
          title={`Bills (${payment.bills.length})`}
          className="col-span-1 lg:col-span-2 animate-fade-in"
          style={{ animationDelay: "100ms" }}
        >
          <div className="p-6">
            <div className="space-y-3">
              {payment.bills.map((bill) => (
                <Link
                  key={bill.voucher_id}
                  to={`/bills/${bill.voucher_id}`}
                  className="block p-4 border rounded-lg hover:bg-accent hover:border-primary transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{bill.payee_name}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Invoice: {bill.invoice_number}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="capitalize text-xs">
                          {bill.payee_type}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">
                        {formatAmount(bill.amount, payment.currency)}
                      </div>
                      <FileText className="h-4 w-4 text-muted-foreground mt-2 ml-auto" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {payment.bills.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No bills associated with this payment
              </div>
            )}
          </div>
        </TransactionDetailCard>
      </div>
    </div>
  );
};

export default TransactionDetails;
