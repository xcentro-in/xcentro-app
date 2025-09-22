import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatters";
import { Invoice } from "@/data/mockInvoices";
import { X, CreditCard, CheckCircle, AlertTriangle, AlertCircle, Eye } from "lucide-react";
import { useState } from "react";

interface InvoiceDetailsProps {
  invoice: Invoice;
  onClose: () => void;
  onPayBill?: (billId: string) => void;
}

const InvoiceDetails = ({ invoice, onClose, onPayBill }: InvoiceDetailsProps) => {
  const [showPDF, setShowPDF] = useState(false);

  // Mock OCR confidence data
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

  const canPay = invoice.status === 'open' || invoice.status === 'overdue';
  const isOverdue = invoice.status === 'overdue';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (showPDF) {
    return (
      <div className="h-full flex flex-col min-h-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Invoice {invoice.invoiceNumber}</h2>
          <div className="flex items-center space-x-2">
            <Label htmlFor="pdf-view">Show PDF View</Label>
            <Switch 
              id="pdf-view" 
              checked={showPDF} 
              onCheckedChange={setShowPDF} 
            />
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex-1 bg-gray-50">
          <object data="/Printer-Friendly-Invoice-Template-Word.pdf" type="application/pdf" width="100%" height="100%">
            <p>Alternative text - include a link <a href="/Printer-Friendly-Invoice-Template-Word.pdf">to the PDF!</a></p>
          </object>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-semibold">Invoice {invoice.invoiceNumber}</h2>
          <Badge className={getStatusColor(invoice.status)}>
            {invoice.status.toUpperCase()}
          </Badge>
          {/* OCR Quality Indicator */}
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Eye className="h-3 w-3" />
            <span>OCR Parsed</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {canPay && onPayBill && (
            <Button
              variant={isOverdue ? "destructive" : "default"}
              size="sm"
              onClick={() => onPayBill(invoice.id)}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              {isOverdue ? "Pay Overdue" : "Pay Now"}
            </Button>
          )}
          <Label htmlFor="pdf-view">Show PDF View</Label>
          <Switch
            id="pdf-view"
            checked={showPDF}
            onCheckedChange={setShowPDF}
          />
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6 min-h-0">
          {/* Header Section */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">BILL</h1>
              <div className="flex items-center gap-2">
                <p className="text-lg font-medium">Bill# {invoice.invoiceNumber}</p>
                <div className="flex items-center gap-1">
                  {getConfidenceIcon(getOcrConfidence('invoiceNumber'))}
                  <span className={`text-xs ${getConfidenceColor(getOcrConfidence('invoiceNumber'))}`}>
                    {Math.round(getOcrConfidence('invoiceNumber') * 100)}%
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Balance Due</div>
              <div className="flex items-center gap-2 justify-end">
                <div className="text-2xl font-bold">{formatCurrency(invoice.amount)}</div>
                <div className="flex items-center gap-1">
                  {getConfidenceIcon(getOcrConfidence('amount'))}
                  <span className={`text-xs ${getConfidenceColor(getOcrConfidence('amount'))}`}>
                    {Math.round(getOcrConfidence('amount') * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bill Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bill Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <label className="text-sm font-medium text-gray-600">Bill Date:</label>
                    <div className="flex items-center gap-1">
                      {getConfidenceIcon(getOcrConfidence('billDate'))}
                      <span className={`text-xs ${getConfidenceColor(getOcrConfidence('billDate'))}`}>
                        {Math.round(getOcrConfidence('billDate') * 100)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-900">{invoice.billDate}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <label className="text-sm font-medium text-gray-600">Due Date:</label>
                    <div className="flex items-center gap-1">
                      {getConfidenceIcon(getOcrConfidence('dueDate'))}
                      <span className={`text-xs ${getConfidenceColor(getOcrConfidence('dueDate'))}`}>
                        {Math.round(getOcrConfidence('dueDate') * 100)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-900">{invoice.dueDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Terms:</label>
                  <p className="text-gray-900">{invoice.terms}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status:</label>
                  <Badge className={`${getStatusColor(invoice.status)} ml-2`}>
                    {invoice.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vendor Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bill From</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <div className="text-blue-600 font-medium">{invoice.vendorName}</div>
                <div className="flex items-center gap-1">
                  {getConfidenceIcon(getOcrConfidence('vendorName'))}
                  <span className={`text-xs ${getConfidenceColor(getOcrConfidence('vendorName'))}`}>
                    {Math.round(getOcrConfidence('vendorName') * 100)}%
                  </span>
                </div>
              </div>
              <div className="text-gray-700 whitespace-pre-line">{invoice.vendorAddress}</div>
              {invoice.gstin && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">GSTIN:</span>
                  <span className="text-gray-900">{invoice.gstin}</span>
                  <div className="flex items-center gap-1">
                    {getConfidenceIcon(getOcrConfidence('gstin'))}
                    <span className={`text-xs ${getConfidenceColor(getOcrConfidence('gstin'))}`}>
                      {Math.round(getOcrConfidence('gstin') * 100)}%
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">Items</CardTitle>
                <div className="flex items-center gap-1">
                  {getConfidenceIcon(getOcrConfidence('items'))}
                  <span className={`text-xs ${getConfidenceColor(getOcrConfidence('items'))}`}>
                    {Math.round(getOcrConfidence('items') * 100)}%
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Description</th>
                      <th className="text-right py-2">Qty</th>
                      <th className="text-right py-2">Rate</th>
                      <th className="text-right py-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{item.description}</td>
                        <td className="text-right py-2">{item.quantity}</td>
                        <td className="text-right py-2">{formatCurrency(item.rate)}</td>
                        <td className="text-right py-2">{formatCurrency(item.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Tax Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tax Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(invoice.items.reduce((sum, item) => sum + item.amount, 0))}</span>
                </div>
                <div className="flex justify-between">
                  <span>CGST:</span>
                  <span>{formatCurrency(invoice.cgst)}</span>
                </div>
                <div className="flex justify-between">
                  <span>SGST:</span>
                  <span>{formatCurrency(invoice.sgst)}</span>
                </div>
                {invoice.igst && (
                  <div className="flex justify-between">
                    <span>IGST:</span>
                    <span>{formatCurrency(invoice.igst)}</span>
                  </div>
                )}
                <hr className="my-2" />
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total:</span>
                  <div className="flex items-center gap-2">
                    <span>{formatCurrency(invoice.amount)}</span>
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
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;