import React from "react";
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
import { cn } from "@/lib/utils";

interface Invoice {
  id: string;
  inv_id: string;
  inv_date: string;
  document_id: string;
  total_amount: number;
}

interface InvoicesTableProps {
  invoices: Invoice[];
  isLoading?: boolean;
}

const InvoicesTable = ({ invoices, isLoading = false }: InvoicesTableProps) => {
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

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Invoice Number</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Document ID</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length > 0 ? (
            invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-mono">
                  {invoice.inv_id || (invoice as any).invoice_number || '-'}
                </TableCell>
                <TableCell>
                  {(invoice.inv_date || (invoice as any).invoice_date || (invoice as any).invoice_due_date || (invoice as any).due_date) 
                    ? new Date(invoice.inv_date || (invoice as any).invoice_date || (invoice as any).invoice_due_date || (invoice as any).due_date).toLocaleDateString() 
                    : "-"}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {invoice.document_id || invoice.id || '-'}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(invoice.total_amount)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
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
