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

interface PurchaseOrder {
  id: string;
  document_id: string;
  po_number: string;
  po_date: string;
  total_amount: number;
  remaining_balance: number;
  po_status: string;
}

interface PurchaseOrdersTableProps {
  pos: PurchaseOrder[];
  isLoading?: boolean;
}

const PurchaseOrdersTable = ({ pos, isLoading = false }: PurchaseOrdersTableProps) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>PO Number</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Total Amount</TableHead>
            <TableHead className="text-right">Remaining Balance</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pos.length > 0 ? (
            pos.map((po) => (
              <TableRow
                key={po.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => navigate(`/vouchers/purchase-orders/${po.id}`, { state: { po } })}
              >
                <TableCell className="font-mono font-medium">
                  {po.po_number || (po as any).po_id || '-'}
                </TableCell>
                <TableCell>
                  {po.po_date ? new Date(po.po_date).toLocaleDateString() : "-"}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(po.total_amount)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(po.remaining_balance ?? 0)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={
                    po.po_status === 'OPEN' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                    po.po_status === 'PARTIALLY_INVOICED' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                    po.po_status === 'CLOSED' ? 'bg-zinc-100 text-zinc-800 border-zinc-200' :
                    ''
                  }>
                    {po.po_status || 'OPEN'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
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
