import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePageTitle } from "@/contexts/PageTitleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/formatters";
import { formatPaymentDate } from "@/utils/dateFormatting";
import { canViewFeature } from "@/lib/featureFlags";
import { formatDistanceToNow, format } from "date-fns";
import { voucherAPI } from "@/services/api";
import {
  VoucherDetailsResponseAPI,
  VoucherActivityResponseAPI,
  VoucherPaymentResponseAPI,
  VoucherAccountingResponseAPI,
  VoucherAttachmentsResponseAPI
} from "@/types/voucher-summary-api";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Eye,
  FileText,
  Clock,
  CreditCard,
  Activity,
  Paperclip,
  BarChart3,
  Download,
  X,
  FilePlus
} from "lucide-react";

// Simplified bill summary type (from API)
interface BillSummary {
  id: string;
  invoiceNumber: string;
  vendorName: string;
  vendorAddress: string;
  vendorGstin: string;
  amount: number; // in rupees (converted from paise)
  dueDate: string;
  billDate: string;
  status: 'paid' | 'open' | 'overdue';
  overdueDays?: number;
  terms: string;
  // Details tab data (included in summary)
  items: {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
}

// Helper function to get event display properties
const getEventDisplay = (eventType: string) => {
  switch (eventType) {
    case 'created':
      return { icon: FilePlus, color: 'text-blue-600', label: 'Bill Created' };
    case 'edited':
      return { icon: FileText, color: 'text-gray-600', label: 'Bill Edited' };
    case 'approved':
      return { icon: CheckCircle, color: 'text-green-600', label: 'Approved' };
    case 'rejected':
      return { icon: X, color: 'text-red-600', label: 'Rejected' };
    case 'request_changes':
      return { icon: AlertCircle, color: 'text-blue-600', label: 'Requested Changes' };
    case 'pending':
      return { icon: Clock, color: 'text-yellow-600', label: 'Pending Approval' };
    case 'paid':
      return { icon: CheckCircle, color: 'text-green-600', label: 'Payment Completed' };
    case 'status_changed':
      return { icon: AlertCircle, color: 'text-gray-600', label: 'Status Changed' };
    default:
      return { icon: Clock, color: 'text-gray-600', label: eventType };
  }
};

// Helper function to map API response to BillSummary
const mapVoucherToBill = (response: VoucherDetailsResponseAPI): BillSummary => {
  const formatDate = (isoDate: string | null): string => {
    if (!isoDate) return '';
    try {
      return format(new Date(isoDate), 'dd/MM/yyyy');
    } catch {
      return '';
    }
  };

  const voucher = response.data;

  // Calculate payment status (paid/open/overdue)
  const calculatePaymentStatus = (): 'paid' | 'open' | 'overdue' => {
    // If voucher status is 'processed', it's paid
    if (voucher.status === 'processed') return 'paid';

    // Check if overdue
    if (voucher.invoice_due_date) {
      const dueDate = new Date(voucher.invoice_due_date);
      const today = new Date();
      if (today > dueDate) return 'overdue';
    }

    return 'open';
  };

  // Calculate overdue days
  const calculateOverdueDays = (): number | undefined => {
    if (!voucher.invoice_due_date) return undefined;
    const dueDate = new Date(voucher.invoice_due_date);
    const today = new Date();
    if (today <= dueDate) return undefined;

    const diffTime = today.getTime() - dueDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : undefined;
  };

  // Calculate subtotal (sum of line items before GST)
  const subtotal = voucher.financial_details.line_items.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  // Calculate IGST (if gst_type is not cgst_sgst)
  const igstAmount = voucher.financial_details.gst_type === 'cgst_sgst' ? 0 : voucher.gst_amount;

  return {
    id: voucher.voucher_id,
    invoiceNumber: voucher.invoice_number,
    vendorName: voucher.payee.name,
    vendorAddress: '', // Not provided in response
    vendorGstin: voucher.payee.gstin || '',
    amount: voucher.gross_amount / 100, // Convert paise to rupees
    dueDate: formatDate(voucher.invoice_due_date),
    billDate: formatDate(voucher.invoice_date),
    status: calculatePaymentStatus(),
    overdueDays: calculateOverdueDays(),
    terms: '', // Not provided in response
    items: voucher.financial_details.line_items.map(item => ({
      description: item.description,
      quantity: item.quantity,
      rate: item.rate / 100,
      amount: item.amount / 100,
    })),
    subtotal: subtotal / 100,
    cgst: voucher.cgst_amount / 100,
    sgst: voucher.sgst_amount / 100,
    igst: igstAmount / 100,
  };
};

const BillDetailPage = () => {
  const { billId } = useParams<{ billId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setTitle } = usePageTitle();

  // Main bill data (loaded on page load)
  const [bill, setBill] = useState<BillSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tab-specific data (lazy-loaded)
  const [activityData, setActivityData] = useState<VoucherActivityResponseAPI | null>(null);
  const [paymentData, setPaymentData] = useState<VoucherPaymentResponseAPI | null>(null);
  const [accountingData, setAccountingData] = useState<VoucherAccountingResponseAPI | null>(null);
  const [attachmentsData, setAttachmentsData] = useState<VoucherAttachmentsResponseAPI | null>(null);

  // Loading states for each tab
  const [loadingTabs, setLoadingTabs] = useState({
    activity: false,
    payment: false,
    accounting: false,
    attachments: false,
  });

  // Track which tabs have been loaded (for caching)
  const [loadedTabs, setLoadedTabs] = useState({
    activity: false,
    payment: false,
    accounting: false,
    attachments: false,
  });

  useEffect(() => {
    setTitle("Bill Details");
  }, [setTitle]);

  // Fetch voucher details on page load (includes header + details tab)
  useEffect(() => {
    const fetchVoucherDetails = async () => {
      if (!billId || !user?.businessId) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch voucher details (includes header + details tab)
        const response = await voucherAPI.getDetails(user.businessId, billId);
        const voucherResponse = response as VoucherDetailsResponseAPI;

        // Map to BillSummary
        const mappedBill = mapVoucherToBill(voucherResponse);
        setBill(mappedBill);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch bill details';
        setError(errorMessage);
        console.error('Error fetching voucher details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVoucherDetails();
  }, [billId, user?.businessId]);

  // Lazy-load activity tab
  const loadActivityTab = async () => {
    if (!billId || !user?.businessId || loadedTabs.activity) return;

    try {
      setLoadingTabs(prev => ({ ...prev, activity: true }));
      const response = await voucherAPI.getActivity(user.businessId, billId);
      setActivityData(response as VoucherActivityResponseAPI);
      setLoadedTabs(prev => ({ ...prev, activity: true }));
    } catch (err) {
      console.error('Error loading activity:', err);
    } finally {
      setLoadingTabs(prev => ({ ...prev, activity: false }));
    }
  };

  // Lazy-load payment tab
  const loadPaymentTab = async () => {
    if (!billId || !user?.businessId || loadedTabs.payment) return;

    try {
      setLoadingTabs(prev => ({ ...prev, payment: true }));
      const response = await voucherAPI.getPayment(user.businessId, billId);
      setPaymentData(response as VoucherPaymentResponseAPI);
      setLoadedTabs(prev => ({ ...prev, payment: true }));
    } catch (err) {
      console.error('Error loading payment:', err);
    } finally {
      setLoadingTabs(prev => ({ ...prev, payment: false }));
    }
  };

  // Lazy-load accounting tab
  const loadAccountingTab = async () => {
    if (!billId || !user?.businessId || loadedTabs.accounting) return;

    try {
      setLoadingTabs(prev => ({ ...prev, accounting: true }));
      const response = await voucherAPI.getAccounting(user.businessId, billId);
      setAccountingData(response as VoucherAccountingResponseAPI);
      setLoadedTabs(prev => ({ ...prev, accounting: true }));
    } catch (err) {
      console.error('Error loading accounting:', err);
    } finally {
      setLoadingTabs(prev => ({ ...prev, accounting: false }));
    }
  };

  // Lazy-load attachments tab
  const loadAttachmentsTab = async () => {
    if (!billId || !user?.businessId || loadedTabs.attachments) return;

    try {
      setLoadingTabs(prev => ({ ...prev, attachments: true }));
      const response = await voucherAPI.getAttachments(user.businessId, billId);
      setAttachmentsData(response as VoucherAttachmentsResponseAPI);
      setLoadedTabs(prev => ({ ...prev, attachments: true }));
    } catch (err) {
      console.error('Error loading attachments:', err);
    } finally {
      setLoadingTabs(prev => ({ ...prev, attachments: false }));
    }
  };

  // OCR helper functions
  const getOcrConfidence = (field: string): number => {
    const confidences: { [key: string]: number } = {
      vendorName: 0.95,
      invoiceNumber: 0.92,
      amount: 0.89,
      dueDate: 0.87,
      billDate: 0.91,
      gstin: 0.78,
      items: 0.85
    };
    return confidences[field] || 0.8;
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.9) return "text-green-600";
    if (confidence >= 0.7) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.9) return <CheckCircle className="h-3 w-3 text-green-600" />;
    if (confidence >= 0.7) return <AlertTriangle className="h-3 w-3 text-yellow-600" />;
    return <AlertCircle className="h-3 w-3 text-red-600" />;
  };

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
        return <CheckCircle className="h-4 w-4" />;
      case 'open':
        return <Calendar className="h-4 w-4" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading bill details...</p>
        </div>
      </div>
    );
  }

  if (error || !bill) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error || 'Bill not found'}</p>
          <Button onClick={() => navigate('/bills')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bills
          </Button>
        </div>
      </div>
    );
  }

  const canPay = bill.status === 'open' || bill.status === 'overdue';
  const isOverdue = bill.status === 'overdue';

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/bills')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="text-2xl font-bold">Invoice {bill.invoiceNumber}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={getStatusColor(bill.status)}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(bill.status)}
                    {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                  </span>
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  <span>OCR Parsed</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canPay && (
              <Button variant={isOverdue ? "destructive" : "default"}>
                <CreditCard className="h-4 w-4 mr-2" />
                {isOverdue ? "Pay Overdue Bill" : "Pay Now"}
              </Button>
            )}
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Hero Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Vendor</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold">{bill.vendorName}</h2>
                    <div className="flex items-center gap-1">
                      {getConfidenceIcon(getOcrConfidence('vendorName'))}
                      <span className={`text-xs ${getConfidenceColor(getOcrConfidence('vendorName'))}`}>
                        {Math.round(getOcrConfidence('vendorName') * 100)}%
                      </span>
                    </div>
                  </div>
                  {bill.vendorGstin && (
                    <p className="text-sm text-muted-foreground">GSTIN: {bill.vendorGstin}</p>
                  )}
                  {bill.vendorAddress && (
                    <p className="text-sm text-muted-foreground mt-2 whitespace-pre-line">{bill.vendorAddress}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Dates</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Bill Date:</span>
                      <span className="ml-2 font-medium">{formatPaymentDate(bill.billDate)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Due Date:</span>
                      <span className={`ml-2 font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                        {formatPaymentDate(bill.dueDate)}
                        {isOverdue && bill.overdueDays && (
                          <span className="text-xs ml-1">({bill.overdueDays}d overdue)</span>
                        )}
                      </span>
                    </div>
                    {bill.terms && (
                      <div>
                        <span className="text-muted-foreground">Terms:</span>
                        <span className="ml-2 font-medium">{bill.terms}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Amount</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-3xl font-bold text-primary">{formatCurrency(bill.amount)}</div>
                    <div className="flex items-center gap-1">
                      {getConfidenceIcon(getOcrConfidence('amount'))}
                      <span className={`text-xs ${getConfidenceColor(getOcrConfidence('amount'))}`}>
                        {Math.round(getOcrConfidence('amount') * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabbed Content */}
          <Tabs
            defaultValue="details"
            className="w-full"
            onValueChange={(value) => {
              // Lazy-load tab data when user clicks on it
              if (value === 'activity') loadActivityTab();
              if (value === 'payment') loadPaymentTab();
              if (value === 'accounting') loadAccountingTab();
              if (value === 'attachments') loadAttachmentsTab();
            }}
          >
            <TabsList className={`grid w-full ${canViewFeature('ERP_INTEGRATION', user) ? 'grid-cols-5' : 'grid-cols-4'}`}>
              <TabsTrigger value="details">
                <FileText className="h-4 w-4 mr-2" />
                Details
              </TabsTrigger>
              <TabsTrigger value="activity">
                <Activity className="h-4 w-4 mr-2" />
                Activity
              </TabsTrigger>
              <TabsTrigger value="payment">
                <CreditCard className="h-4 w-4 mr-2" />
                Payment
              </TabsTrigger>
              {canViewFeature('ERP_INTEGRATION', user) && (
                <TabsTrigger value="accounting">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Accounting
                </TabsTrigger>
              )}
              <TabsTrigger value="attachments">
                <Paperclip className="h-4 w-4 mr-2" />
                Attachments
              </TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-6">
              {/* Line Items */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Line Items</CardTitle>
                    <div className="flex items-center gap-1">
                      {getConfidenceIcon(getOcrConfidence('items'))}
                      <span className={`text-xs ${getConfidenceColor(getOcrConfidence('items'))}`}>
                        OCR {Math.round(getOcrConfidence('items') * 100)}%
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b">
                        <tr>
                          <th className="text-left py-3 px-2 font-medium">Description</th>
                          <th className="text-right py-3 px-2 font-medium">Qty</th>
                          <th className="text-right py-3 px-2 font-medium">Rate</th>
                          <th className="text-right py-3 px-2 font-medium">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bill.items.map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-3 px-2">{item.description}</td>
                            <td className="text-right py-3 px-2">{item.quantity}</td>
                            <td className="text-right py-3 px-2">{formatCurrency(item.rate)}</td>
                            <td className="text-right py-3 px-2 font-medium">{formatCurrency(item.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Financial Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Financial Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatCurrency(bill.subtotal)}</span>
                    </div>
                    {bill.cgst > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">CGST</span>
                        <span className="font-medium">{formatCurrency(bill.cgst)}</span>
                      </div>
                    )}
                    {bill.sgst > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">SGST</span>
                        <span className="font-medium">{formatCurrency(bill.sgst)}</span>
                      </div>
                    )}
                    {bill.igst > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">IGST</span>
                        <span className="font-medium">{formatCurrency(bill.igst)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-semibold">Total Amount</span>
                      <span className="text-2xl font-bold text-primary">{formatCurrency(bill.amount)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingTabs.activity ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : activityData && activityData.events.length > 0 ? (
                    <div className="space-y-3">
                      {activityData.events.map((event, index) => {
                        const eventDisplay = getEventDisplay(event.event_type);
                        const EventIcon = eventDisplay.icon;

                        return (
                          <div key={event.event_id} className="flex gap-3">
                            {/* Timeline dot and line */}
                            <div className="flex flex-col items-center">
                              <div className={`rounded-full p-1.5 bg-background border-2 ${eventDisplay.color.replace('text-', 'border-')}`}>
                                <EventIcon className={`h-3 w-3 ${eventDisplay.color}`} />
                              </div>
                              {index < activityData.events.length - 1 && (
                                <div className="w-0.5 flex-1 bg-border mt-1 min-h-[20px]" />
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-3">
                              <div className="flex items-start justify-between mb-1">
                                <div>
                                  <p className="text-sm font-medium">{eventDisplay.label}</p>
                                  {event.user_name && (
                                    <p className="text-xs text-muted-foreground">
                                      by {event.user_name}
                                    </p>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                  {formatDistanceToNow(new Date(event.event_date), { addSuffix: true })}
                                </p>
                              </div>
                              <p className="text-sm text-muted-foreground">{event.description}</p>
                              {event.remarks && (
                                <p className="text-xs text-muted-foreground bg-muted/30 rounded p-2 mt-2">
                                  "{event.remarks}"
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                        <Activity className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No Activity Yet</h3>
                      <p className="text-sm text-muted-foreground">
                        Activity timeline will appear here once events are recorded.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment Tab */}
            <TabsContent value="payment" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment & Payout Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingTabs.payment ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : paymentData && paymentData.has_payment && paymentData.payment_details ? (
                    <div className="space-y-6">
                      {/* Payment Status Banner */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-green-900">Payment Completed</h3>
                            <p className="text-sm text-green-700">
                              This bill was paid on {format(new Date(paymentData.payment_details.payment_date), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Payment Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Payment ID</p>
                          <p className="font-mono font-medium">{paymentData.payment_details.payment_id}</p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Payment Method</p>
                          <p className="font-medium">{paymentData.payment_details.payment_method}</p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Payment Date</p>
                          <p className="font-medium">
                            {format(new Date(paymentData.payment_details.payment_date), 'MMM d, yyyy h:mm a')}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">UTR Number</p>
                          <p className="font-mono font-medium">{paymentData.payment_details.utr_number}</p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Transaction Reference</p>
                          <p className="font-mono font-medium">{paymentData.payment_details.transaction_reference}</p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Settlement Status</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {paymentData.payment_details.settlement_status.charAt(0).toUpperCase() +
                               paymentData.payment_details.settlement_status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Payment Amount Summary */}
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Amount Paid</p>
                            <p className="text-2xl font-bold text-primary">
                              {formatCurrency(paymentData.payment_details.amount_paid / 100)}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Payment Receipt
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                        <Clock className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No Payment Made Yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        This bill is still unpaid. Payment details will appear here once processed.
                      </p>
                      {canPay && (
                        <Button>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pay Now
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Accounting Tab - Feature Flagged */}
            {canViewFeature('ERP_INTEGRATION', user) && (
              <TabsContent value="accounting" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Accounting & ERP Integration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      // Mock accounting details - will be replaced with actual API data
                      // const accountingDetails = bill.accounting_details; // From API
                      const mockAccountingDetails = {
                        journal_entry_id: 'JE-' + billId?.slice(0, 8),
                        ledger_account: '5000 - Accounts Payable',
                        cost_center: 'Operations',
                        department: 'Finance',
                        erp_sync_status: 'synced',
                        erp_reference_id: 'ERP-' + Math.random().toString().slice(2, 10),
                        erp_sync_date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
                      };

                      const accountingDetails = mockAccountingDetails;

                      if (!accountingDetails) {
                        return (
                          <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                              <BarChart3 className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No Accounting Data</h3>
                            <p className="text-sm text-muted-foreground">
                              This bill has not been synced to your ERP system yet.
                            </p>
                          </div>
                        );
                      }

                      const syncStatusColor = {
                        synced: 'bg-green-100 text-green-800 border-green-200',
                        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                        failed: 'bg-red-100 text-red-800 border-red-200',
                        not_applicable: 'bg-gray-100 text-gray-800 border-gray-200'
                      }[accountingDetails.erp_sync_status] || 'bg-gray-100 text-gray-800 border-gray-200';

                      const syncStatusIcon = {
                        synced: CheckCircle,
                        pending: Clock,
                        failed: AlertCircle,
                        not_applicable: AlertTriangle
                      }[accountingDetails.erp_sync_status] || Clock;

                      const StatusIcon = syncStatusIcon;

                      return (
                        <div className="space-y-6">
                          {/* ERP Sync Status Banner */}
                          <div className={`border rounded-lg p-4 ${
                            accountingDetails.erp_sync_status === 'synced'
                              ? 'bg-green-50 border-green-200'
                              : 'bg-yellow-50 border-yellow-200'
                          }`}>
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0">
                                <StatusIcon className={`h-6 w-6 ${
                                  accountingDetails.erp_sync_status === 'synced'
                                    ? 'text-green-600'
                                    : 'text-yellow-600'
                                }`} />
                              </div>
                              <div>
                                <h3 className={`font-semibold ${
                                  accountingDetails.erp_sync_status === 'synced'
                                    ? 'text-green-900'
                                    : 'text-yellow-900'
                                }`}>
                                  ERP Sync Status: {accountingDetails.erp_sync_status.charAt(0).toUpperCase() +
                                   accountingDetails.erp_sync_status.slice(1)}
                                </h3>
                                {accountingDetails.erp_sync_date && (
                                  <p className={`text-sm ${
                                    accountingDetails.erp_sync_status === 'synced'
                                      ? 'text-green-700'
                                      : 'text-yellow-700'
                                  }`}>
                                    Last synced {formatDistanceToNow(new Date(accountingDetails.erp_sync_date), { addSuffix: true })}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Accounting Details Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Journal Entry ID</p>
                              <p className="font-mono font-medium">{accountingDetails.journal_entry_id}</p>
                            </div>

                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Ledger Account</p>
                              <p className="font-medium">{accountingDetails.ledger_account}</p>
                            </div>

                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Cost Center</p>
                              <p className="font-medium">{accountingDetails.cost_center}</p>
                            </div>

                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Department</p>
                              <p className="font-medium">{accountingDetails.department}</p>
                            </div>

                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">ERP Reference ID</p>
                              <p className="font-mono font-medium">{accountingDetails.erp_reference_id}</p>
                            </div>

                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Sync Date</p>
                              <p className="font-medium">
                                {format(new Date(accountingDetails.erp_sync_date), 'MMM d, yyyy h:mm a')}
                              </p>
                            </div>
                          </div>

                          <Separator />

                          {/* Actions */}
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium mb-1">ERP Actions</p>
                              <p className="text-xs text-muted-foreground">
                                Manage this bill's integration with your ERP system
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              View in ERP System
                            </Button>
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Attachments Tab */}
            <TabsContent value="attachments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Attachments</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    // Mock attachments - will be replaced with actual API data
                    // const attachments = bill.attachments; // From API
                    const mockAttachments = [
                      {
                        attachment_id: '1',
                        file_name: `Invoice_${bill.invoiceNumber}.pdf`,
                        file_url: '#',
                        file_type: 'application/pdf',
                        file_size: 245678,
                        uploaded_date: bill.billDate
                      },
                      {
                        attachment_id: '2',
                        file_name: 'Supporting_Document.pdf',
                        file_url: '#',
                        file_type: 'application/pdf',
                        file_size: 128456,
                        uploaded_date: bill.billDate
                      }
                    ];

                    const attachments = mockAttachments;

                    if (!attachments || attachments.length === 0) {
                      return (
                        <div className="text-center py-12">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                            <Paperclip className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <h3 className="text-lg font-semibold mb-2">No Attachments</h3>
                          <p className="text-sm text-muted-foreground">
                            No documents have been attached to this bill yet.
                          </p>
                        </div>
                      );
                    }

                    // Helper to format file size
                    const formatFileSize = (bytes: number) => {
                      if (bytes < 1024) return bytes + ' B';
                      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
                      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
                    };

                    // Helper to get file icon
                    const getFileIcon = (fileType: string) => {
                      if (fileType.includes('pdf')) return FileText;
                      if (fileType.includes('image')) return FileText;
                      return FileText;
                    };

                    return (
                      <div className="space-y-3">
                        {attachments.map((attachment) => {
                          const FileIcon = getFileIcon(attachment.file_type);

                          return (
                            <div
                              key={attachment.attachment_id}
                              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="flex-shrink-0">
                                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <FileIcon className="h-5 w-5 text-primary" />
                                  </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">{attachment.file_name}</p>
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                    <span>{formatFileSize(attachment.file_size)}</span>
                                    <span>•</span>
                                    <span>Uploaded {formatPaymentDate(attachment.uploaded_date)}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default BillDetailPage;
