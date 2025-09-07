import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatters";
import { Invoice } from "@/data/mockInvoices";

interface InvoiceListProps {
  invoices: Invoice[];
  selectedInvoice?: Invoice;
  onInvoiceSelect: (invoice: Invoice) => void;
}

const InvoiceList = ({ invoices, selectedInvoice, onInvoiceSelect }: InvoiceListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'open':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getStatusText = (invoice: Invoice) => {
    if (invoice.status === 'paid') return 'Paid via Open';
    if (invoice.status === 'open') return 'OPEN';
    if (invoice.status === 'overdue') return `OVERDUE BY ${invoice.overdueDays} DAYS`;
    return (invoice.status as string).toUpperCase();
  };

  return (
    <div className="space-y-2">
      {invoices.map((invoice) => (
        <Card
          key={invoice.id}
          className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedInvoice?.id === invoice.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => onInvoiceSelect(invoice)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {invoice.vendorName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{invoice.vendorName}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="text-blue-600">{invoice.invoiceNumber}</span>
                    <span>•</span>
                    <span>{invoice.billDate}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900">
                {formatCurrency(invoice.amount)}
              </div>
              <Badge className={`text-xs ${getStatusColor(invoice.status)}`}>
                {getStatusText(invoice)}
              </Badge>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default InvoiceList;