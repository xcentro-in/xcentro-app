import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatters";
import { formatPaymentDate } from "@/utils/dateFormatting";
import { Invoice } from "@/data/mockInvoices";
import { X, CreditCard, CheckCircle, AlertTriangle, AlertCircle, Eye, ExternalLink, Calendar, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BillDetailsModalProps {
  invoice: Invoice;
  onClose: () => void;
  onPayBill?: (billId: string) => void;
}

const BillDetailsModal = ({ invoice, onClose, onPayBill }: BillDetailsModalProps) => {
  const navigate = useNavigate();

  // Mock OCR confidence - overall score
  const getOverallOcrScore = (): number => {
    // In real implementation, this would come from API
    return 0.89;
  };

  const getOcrScoreBadge = (score: number) => {
    if (score >= 0.9) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          High Confidence {Math.round(score * 100)}%
        </Badge>
      );
    }
    if (score >= 0.7) {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Medium Confidence {Math.round(score * 100)}%
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
        <AlertCircle className="h-3 w-3 mr-1" />
        Low Confidence {Math.round(score * 100)}%
      </Badge>
    );
  };

  const canPay = invoice.status === 'open' || invoice.status === 'overdue';
  const isOverdue = invoice.status === 'overdue';

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

  const handleViewFullDetails = () => {
    navigate(`/bills/${invoice.id}`);
    onClose();
  };

  // Calculate subtotal from items
  const subtotal = invoice.items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b bg-muted/30">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-xl font-semibold mb-1">Invoice {invoice.invoiceNumber}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="h-3 w-3" />
              <span>OCR Parsed</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Hero Section - Invoice Overview */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-6">
                {/* Vendor Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Vendor</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{invoice.vendorName}</h3>
                  {invoice.gstin && (
                    <p className="text-sm text-muted-foreground">GSTIN: {invoice.gstin}</p>
                  )}
                </div>

                {/* Amount */}
                <div className="text-right">
                  <div className="text-sm text-muted-foreground mb-1">Total Amount</div>
                  <div className="text-3xl font-bold text-primary">{formatCurrency(invoice.amount)}</div>
                </div>
              </div>

              {/* Status and Dates Row */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">Status</div>
                  <Badge variant="outline" className={`${getStatusColor(invoice.status)} text-sm`}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(invoice.status)}
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </Badge>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">Due Date</div>
                  <p className={`text-sm font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                    {formatPaymentDate(invoice.dueDate)}
                    {isOverdue && invoice.overdueDays && (
                      <span className="ml-2 text-xs">({invoice.overdueDays}d overdue)</span>
                    )}
                  </p>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">OCR Quality</div>
                  {getOcrScoreBadge(getOverallOcrScore())}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Financial Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                {invoice.cgst > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">CGST</span>
                    <span className="font-medium">{formatCurrency(invoice.cgst)}</span>
                  </div>
                )}
                {invoice.sgst > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">SGST</span>
                    <span className="font-medium">{formatCurrency(invoice.sgst)}</span>
                  </div>
                )}
                {invoice.igst > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">IGST</span>
                    <span className="font-medium">{formatCurrency(invoice.igst)}</span>
                  </div>
                )}
                <div className="pt-3 border-t flex justify-between items-center">
                  <span className="font-semibold">Total Amount</span>
                  <span className="text-xl font-bold text-primary">{formatCurrency(invoice.amount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information (when paid) */}
          {invoice.status === 'paid' && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Status</span>
                    <span className="font-medium text-green-600">Completed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Date</span>
                    <span className="font-medium">{formatPaymentDate(invoice.billDate)}</span>
                  </div>
                  {/* Additional payment details would come from API */}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Footer with Actions */}
      <div className="border-t p-6 bg-muted/30">
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={handleViewFullDetails}
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            View Full Details
          </Button>

          <div className="flex gap-2">
            {canPay && onPayBill && (
              <Button
                variant={isOverdue ? "destructive" : "default"}
                onClick={() => onPayBill(invoice.id)}
                className="gap-2"
              >
                <CreditCard className="h-4 w-4" />
                {isOverdue ? "Pay Overdue Bill" : "Pay Now"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillDetailsModal;
