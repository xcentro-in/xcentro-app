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

interface PurchaseOrder {
  id: string;
  po_id: string;
  po_date: string;
  document_id: string;
  total_amount: number;
}

interface PurchaseOrdersTableProps {
  pos: PurchaseOrder[];
  isLoading?: boolean;
}

const PurchaseOrdersTable = ({ pos, isLoading = false }: PurchaseOrdersTableProps) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>PO Number</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Document ID</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pos.length > 0 ? (
            pos.map((po) => (
              <TableRow key={po.id}>
                <TableCell className="font-mono">
                  {po.po_id || (po as any).po_number || (po as any).voucher_number || '-'}
                </TableCell>
                <TableCell>
                  {(po.po_date || (po as any).invoice_date || (po as any).due_date) 
                    ? new Date(po.po_date || (po as any).invoice_date || (po as any).due_date).toLocaleDateString() 
                    : "-"}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {po.document_id || po.id || '-'}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(po.total_amount)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                <div className="text-muted-foreground">
                  {isLoading ? "Loading POs..." : "No purchase orders found"}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PurchaseOrdersTable;
