import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { useNavigate } from "react-router-dom";

export interface MatchResult {
  match_result_id: string;
  invoice_id: string;
  purchase_order_id?: string;
  // Summary columns (match backend JSON field names)
  po_number: string;
  invoice_number: string;
  vendor_name: string;
  po_date: string;
  invoice_date?: string;
  po_amount: number;
  invoice_amount: number;
  // Match outcome
  match_status: "MATCHED" | "PARTIAL_MATCH" | "MISMATCH" | "ORPHAN_INVOICE" | "PENDING_MATCH";
  match_notes?: Record<string, unknown>;
  matched_at?: string;
  // PO detail fields
  po_remaining_balance: number;
  po_status: string;
  po_document_id?: string;
  // Invoice detail fields
  invoice_net_amount: number;
  invoice_total_amount: number;
  invoice_document_id?: string;
}

interface MatchResultsTableProps {
  matchResults: MatchResult[];
  isLoading?: boolean;
}

const MATCH_STATUS_STYLES: Record<string, string> = {
  MATCHED: "bg-green-100 text-green-800 border-green-200",
  PARTIAL_MATCH: "bg-amber-100 text-amber-800 border-amber-200",
  MISMATCH: "bg-red-100 text-red-800 border-red-200",
  ORPHAN_INVOICE: "bg-red-100 text-red-800 border-red-200",
  PENDING_MATCH: "bg-blue-100 text-blue-800 border-blue-200",
};

const MatchResultsTable = ({ matchResults, isLoading = false }: MatchResultsTableProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading match results...
      </div>
    );
  }

  if (matchResults.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No match results found
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>PO Number</TableHead>
            <TableHead>Invoice Number</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>PO Date</TableHead>
            <TableHead>Invoice Date</TableHead>
            <TableHead className="text-right">PO Amount</TableHead>
            <TableHead className="text-right">Invoice Amount</TableHead>
            <TableHead>Match Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matchResults.map((row) => (
            <TableRow
              key={row.match_result_id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() =>
                navigate(`/vouchers/match-results/${row.match_result_id}`, {
                  state: { matchResult: row },
                })
              }
            >
              <TableCell className="font-mono font-medium">
                {row.po_number || "-"}
              </TableCell>
              <TableCell className="font-mono font-medium">
                {row.invoice_number || "-"}
              </TableCell>
              <TableCell>{row.vendor_name || "-"}</TableCell>
              <TableCell>
                {row.po_date ? new Date(row.po_date).toLocaleDateString() : "-"}
              </TableCell>
              <TableCell>
                {row.invoice_date ? new Date(row.invoice_date).toLocaleDateString() : "-"}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(row.po_amount)}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(row.invoice_amount)}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={MATCH_STATUS_STYLES[row.match_status] ?? "bg-gray-100 text-gray-800 border-gray-200"}
                >
                  {row.match_status?.toLowerCase().replace(/_/g, " ")}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MatchResultsTable;
