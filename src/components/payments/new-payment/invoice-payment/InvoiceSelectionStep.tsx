import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, FileText, AlertCircle, RefreshCw, Plus } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import PaymentScheduleSelector, { PaymentScheduleType } from "../shared/common/PaymentScheduleSelector";
import { Invoice } from "@/data/mockInvoices";

interface InvoiceSelectionStepProps {
  invoices: Invoice[];
  selectedInvoices: Invoice[];
  paymentType: PaymentScheduleType;
  scheduledDate?: Date;
  frequency: string;
  onInvoicesSelect: (invoices: Invoice[]) => void;
  onPaymentTypeChange: (value: PaymentScheduleType) => void;
  onScheduledDateChange: (date?: Date) => void;
  onFrequencyChange: (value: string) => void;
  onNext: () => void;
}

const InvoiceSelectionStep = ({
  invoices,
  selectedInvoices,
  paymentType,
  scheduledDate,
  frequency,
  onInvoicesSelect,
  onPaymentTypeChange,
  onScheduledDateChange,
  onFrequencyChange,
  onNext,
}: InvoiceSelectionStepProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [localSelectedInvoices, setLocalSelectedInvoices] = useState<Invoice[]>(selectedInvoices);
  const navigate = useNavigate();

  const filteredInvoices = invoices.filter(invoice =>
    invoice.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRefresh = () => {
    // TODO: Implement refresh functionality
    console.log("Refreshing invoices...");
  };

  const handleAddNewInvoice = () => {
    navigate('/invoices/new');
  };

  const handleToggleInvoice = (invoice: Invoice) => {
    const isSelected = localSelectedInvoices.some(selected => selected.id === invoice.id);
    const updatedSelection = isSelected
      ? localSelectedInvoices.filter(selected => selected.id !== invoice.id)
      : [...localSelectedInvoices, invoice];
    
    setLocalSelectedInvoices(updatedSelection);
    onInvoicesSelect(updatedSelection);
  };

  const totalSelectedAmount = localSelectedInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);

  const getStatusBadge = (status: string, overdueDays?: number) => {
    switch (status) {
      case 'paid':
        return <Badge variant="secondary" className="bg-green-500/10 text-green-700 border-green-200">Paid</Badge>;
      case 'overdue':
        return <Badge variant="destructive" className="bg-red-500/10 text-red-700 border-red-200">
          <AlertCircle className="h-3 w-3 mr-1" />
          Overdue {overdueDays}d
        </Badge>;
      default:
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-200">Open</Badge>;
    }
  };

  const handleNext = () => {
    if (localSelectedInvoices.length > 0) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Select Invoices for Payment</h3>
        
        {/* Search and Controls */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by vendor name or invoice number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleAddNewInvoice}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Invoice
          </Button>
        </div>

        {/* Helper Text */}
        <div className="mb-4 p-3 bg-muted/30 rounded-lg border">
          <p className="text-sm text-muted-foreground">
            <strong>Don't see your invoice?</strong> Invoices are automatically synced from your ERP system. 
            You can also manually add new invoices using the button above or refresh to sync the latest data.
          </p>
        </div>

        {/* Invoices Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="w-12 p-4 text-left">
                      Select
                    </th>
                    <th className="p-4 text-left font-medium">Vendor</th>
                    <th className="p-4 text-left font-medium">Invoice #</th>
                    <th className="p-4 text-left font-medium">Amount</th>
                    <th className="p-4 text-left font-medium">Due Date</th>
                    <th className="p-4 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => {
                    const isSelected = localSelectedInvoices.some(selected => selected.id === invoice.id);
                    return (
                      <tr 
                        key={invoice.id} 
                        className={`border-b hover:bg-muted/30 cursor-pointer ${isSelected ? 'bg-primary/5' : ''}`}
                        onClick={() => handleToggleInvoice(invoice)}
                      >
                        <td className="p-4">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleToggleInvoice(invoice)}
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{invoice.vendorName}</div>
                              <div className="text-sm text-muted-foreground">
                                {invoice.gstin && `GSTIN: ${invoice.gstin}`}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-sm">{invoice.invoiceNumber}</td>
                        <td className="p-4 font-medium">{formatCurrency(invoice.amount)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {invoice.dueDate}
                          </div>
                        </td>
                        <td className="p-4">{getStatusBadge(invoice.status, invoice.overdueDays)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {localSelectedInvoices.length > 0 && (
              <div className="border-t bg-muted/20 p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {localSelectedInvoices.length} invoice{localSelectedInvoices.length !== 1 ? 's' : ''} selected
                  </span>
                  <span className="font-semibold">
                    Total: {formatCurrency(totalSelectedAmount)}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {localSelectedInvoices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>When to schedule this payment?</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentScheduleSelector
              paymentType={paymentType}
              scheduledDate={scheduledDate}
              frequency={frequency}
              onPaymentTypeChange={onPaymentTypeChange}
              onScheduledDateChange={onScheduledDateChange}
              onFrequencyChange={onFrequencyChange}
            />
          </CardContent>
        </Card>
      )}

      {localSelectedInvoices.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={handleNext}>
            Continue to Payment Method
          </Button>
        </div>
      )}
    </div>
  );
};

export default InvoiceSelectionStep;