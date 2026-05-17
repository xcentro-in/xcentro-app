import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatters";

interface Invoice {
  id: string;
  inv_id: string;
  inv_date: string;
  document_id: string;
  total_amount: number;
  po_number?: string;
  match_status?: string;
}

interface InvoicesTableProps {
  invoices: Invoice[];
  isLoading?: boolean;
}

const InvoicesTable = ({ invoices, isLoading = false }: InvoicesTableProps) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Invoice Number</TableHead>
            <TableHead>PO Number</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Match Status</TableHead>
            <TableHead className="text-right">Total Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length > 0 ? (
            invoices.map((invoice) => (
              <TableRow
                key={invoice.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => navigate(`/vouchers/invoices/${invoice.id}`, { state: { invoice } })}
              >
                <TableCell className="font-mono font-medium">
                  {invoice.inv_id || (invoice as any).invoice_number || '-'}
                </TableCell>
                <TableCell className="font-mono font-medium">
                  {invoice.po_number || '-'}
                </TableCell>
                <TableCell>
                  {(invoice.inv_date || (invoice as any).invoice_date || (invoice as any).invoice_due_date || (invoice as any).due_date)
                    ? new Date(invoice.inv_date || (invoice as any).invoice_date || (invoice as any).invoice_due_date || (invoice as any).due_date).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>
                  {invoice.match_status ? (
                    <Badge variant="outline" className={
                      invoice.match_status === 'MATCHED' ? 'bg-green-100 text-green-800 border-green-200' :
                      invoice.match_status === 'PENDING_MATCH' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      invoice.match_status === 'ORPHAN_INVOICE' ? 'bg-red-100 text-red-800 border-red-200' :
                      invoice.match_status === 'MISMATCH' ? 'bg-red-100 text-red-800 border-red-200' :
                      'bg-gray-100 text-gray-800 border-gray-200'
                    }>
                      {invoice.match_status.toLowerCase().replace(/_/g, ' ')}
                    </Badge>
                  ) : '-'}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(invoice.total_amount)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                <div className="text-muted-foreground">
                  {isLoading ? "Loading invoices..." : "No invoices found"}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvoicesTable;
