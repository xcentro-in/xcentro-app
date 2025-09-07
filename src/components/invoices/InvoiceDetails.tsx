import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/utils/formatters";
import { Invoice } from "@/data/mockInvoices";
import { useState } from "react";

interface InvoiceDetailsProps {
  invoice: Invoice;
}

const InvoiceDetails = ({ invoice }: InvoiceDetailsProps) => {
  const [showPDF, setShowPDF] = useState(false);

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
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Invoice {invoice.invoiceNumber}</h2>
          <div className="flex items-center space-x-2">
            <Label htmlFor="pdf-view">Show PDF View</Label>
            <Switch 
              id="pdf-view" 
              checked={showPDF} 
              onCheckedChange={setShowPDF} 
            />
          </div>
        </div>
        <div className="flex-1 bg-gray-50">
          <object 
            data="/Printer-Friendly-Invoice-Template-Word.pdf" 
            type="application/pdf" 
            width="100%" 
            height="100%"
            className="min-h-full"
          >
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-2xl mb-2">📄</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">PDF View</h3>
                <p className="text-gray-500">
                  Your browser doesn't support PDF viewing. 
                  <a 
                    href="/Printer-Friendly-Invoice-Template-Word.pdf" 
                    className="text-blue-600 hover:underline ml-1"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Download the PDF instead
                  </a>
                </p>
              </div>
            </div>
          </object>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Invoice {invoice.invoiceNumber}</h2>
        <div className="flex items-center space-x-2">
          <Label htmlFor="pdf-view">Show PDF View</Label>
          <Switch 
            id="pdf-view" 
            checked={showPDF} 
            onCheckedChange={setShowPDF} 
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">BILL</h1>
              <p className="text-lg font-medium">Bill# {invoice.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Balance Due</div>
              <div className="text-2xl font-bold">{formatCurrency(invoice.amount)}</div>
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
                  <label className="text-sm font-medium text-gray-600">Bill Date:</label>
                  <p className="text-gray-900">{invoice.billDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Due Date:</label>
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
              <div className="text-blue-600 font-medium mb-2">{invoice.vendorName}</div>
              <div className="text-gray-700 whitespace-pre-line">{invoice.vendorAddress}</div>
              {invoice.gstin && (
                <div className="mt-2">
                  <span className="text-sm font-medium text-gray-600">GSTIN:</span>
                  <span className="ml-2 text-gray-900">{invoice.gstin}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Items</CardTitle>
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
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{formatCurrency(invoice.amount)}</span>
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