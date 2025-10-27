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
import { Invoice } from "@/data/mockInvoices";
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
  Users,
  Database,
  Paperclip,
  BarChart3,
  Download
} from "lucide-react";

const BillDetailPage = () => {
  const { billId } = useParams<{ billId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setTitle } = usePageTitle();
  const [bill, setBill] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle("Bill Details");
  }, [setTitle]);

  useEffect(() => {
    const fetchBillDetails = async () => {
      if (!billId || !user?.businessId) return;

      try {
        setIsLoading(true);
        setError(null);

        // TODO: Replace with actual API call when ready
        // const response = await voucherAPI.getDetails(user.businessId, billId);
        // setBill(mapVoucherDetailToInvoice(response));

        // MOCK: Try to find in mockInvoices first (for static mock IDs)
        const { mockInvoices } = await import('@/data/mockInvoices');
        let mockBill = mockInvoices.find(b => b.id === billId);

        if (!mockBill) {
          // If not found in mockInvoices, create mock data structure
          // This handles dynamic voucherIds from the API
          mockBill = {
            id: billId,
            invoiceNumber: `INV-${billId.slice(0, 8)}`,
            vendorName: "Mock Vendor",
            vendorAddress: "123 Mock Street\nMock City, Mock State\n123456\nIndia",
            amount: 25000.00,
            dueDate: new Date().toLocaleDateString('en-GB'),
            billDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB'),
            status: 'open',
            gstin: '29ABCDE1234F1Z5',
            items: [
              {
                description: 'Professional Services',
                quantity: 1,
                rate: 21186.44,
                amount: 21186.44
              }
            ],
            cgst: 1906.78,
            sgst: 1906.78,
            igst: 0,
            terms: 'Net 30'
          };
        }

        setBill(mockBill);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch bill details';
        setError(errorMessage);
        console.error('Error fetching bill details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBillDetails();
  }, [billId, user?.businessId]);

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
  const subtotal = bill.items.reduce((sum, item) => sum + item.amount, 0);

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
                  {bill.gstin && (
                    <p className="text-sm text-muted-foreground">GSTIN: {bill.gstin}</p>
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
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="details">
                <FileText className="h-4 w-4 mr-2" />
                Details
              </TabsTrigger>
              <TabsTrigger value="timeline">
                <Clock className="h-4 w-4 mr-2" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="approval">
                <Users className="h-4 w-4 mr-2" />
                Approval
              </TabsTrigger>
              <TabsTrigger value="payment">
                <CreditCard className="h-4 w-4 mr-2" />
                Payment
              </TabsTrigger>
              <TabsTrigger value="accounting">
                <BarChart3 className="h-4 w-4 mr-2" />
                Accounting
              </TabsTrigger>
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
                      <span className="font-medium">{formatCurrency(subtotal)}</span>
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

            {/* Timeline Tab */}
            <TabsContent value="timeline" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bill Lifecycle Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* TODO: Implement timeline from API data */}
                    <div className="text-sm text-muted-foreground">
                      Timeline data will be populated from voucher lifecycle events
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Approval Tab */}
            <TabsContent value="approval" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Approval Workflow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* TODO: Implement approval workflow from API data */}
                    <div className="text-sm text-muted-foreground">
                      Approval history and workflow data will be populated from API
                    </div>
                  </div>
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
                  <div className="space-y-4">
                    {/* TODO: Implement payment tracking from API data */}
                    <div className="text-sm text-muted-foreground">
                      Payment details, UTR numbers, and settlement status will be shown here
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Accounting Tab */}
            <TabsContent value="accounting" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Accounting & ERP Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* TODO: Implement accounting details from API data */}
                    <div className="text-sm text-muted-foreground">
                      ERP sync status, journal entries, and ledger postings will be displayed here
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Attachments Tab */}
            <TabsContent value="attachments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Attachments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* TODO: Implement attachments from API data */}
                    <div className="text-sm text-muted-foreground">
                      Invoice PDFs and supporting documents will be listed here
                    </div>
                  </div>
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
