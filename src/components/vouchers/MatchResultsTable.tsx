import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ChevronDown, Loader2 } from "lucide-react";
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

export interface POGroup {
  poKey: string;
  po_number: string;
  vendor_name: string;
  po_date: string;
  po_amount: number;
  po_remaining_balance: number;
  po_status: string;
  po_document_id?: string;
  matches: MatchResult[];
  totalInvoiced: number;
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

const PO_STATUS_STYLES: Record<string, string> = {
  OPEN: "bg-blue-100 text-blue-800 border-blue-200",
  PARTIALLY_INVOICED: "bg-amber-100 text-amber-800 border-amber-200",
  CLOSED: "bg-zinc-100 text-zinc-800 border-zinc-200",
};

export function groupMatchResultsByPO(matchResults: MatchResult[]) {
  const groupMap = new Map<string, POGroup>();
  const orphans: MatchResult[] = [];

  for (const row of matchResults) {
    if (!row.purchase_order_id || row.match_status === "ORPHAN_INVOICE") {
      orphans.push(row);
      continue;
    }

    const poKey = row.purchase_order_id;
    if (!groupMap.has(poKey)) {
      groupMap.set(poKey, {
        poKey,
        po_number: row.po_number,
        vendor_name: row.vendor_name,
        po_date: row.po_date,
        po_amount: row.po_amount,
        po_remaining_balance: row.po_remaining_balance,
        po_status: row.po_status,
        po_document_id: row.po_document_id,
        matches: [],
        totalInvoiced: 0,
      });
    }

    const group = groupMap.get(poKey)!;
    group.matches.push(row);
    group.totalInvoiced += row.invoice_amount;
  }

  return { poGroups: Array.from(groupMap.values()), orphans };
}

const MatchResultsTable = ({ matchResults, isLoading = false }: MatchResultsTableProps) => {
  const navigate = useNavigate();
  const [expandedPOs, setExpandedPOs] = useState<Set<string>>(new Set());

  const { poGroups, orphans } = useMemo(
    () => groupMatchResultsByPO(matchResults),
    [matchResults],
  );

  const togglePO = (e: React.MouseEvent, poKey: string) => {
    e.stopPropagation();
    setExpandedPOs((prev) => {
      const next = new Set(prev);
      if (next.has(poKey)) next.delete(poKey);
      else next.add(poKey);
      return next;
    });
  };

  const navigateToPOOverview = (group: POGroup) => {
    navigate(`/vouchers/po-matches/${group.poKey}`, {
      state: { poGroup: group },
    });
  };

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
            <TableHead className="w-8"></TableHead>
            <TableHead>PO Number</TableHead>
            <TableHead>Invoice Number</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">PO Amount</TableHead>
            <TableHead className="text-right">Invoice Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* PO Groups */}
          {poGroups.map((group) => {
            const isExpanded = expandedPOs.has(group.poKey);
            const matchCount = group.matches.length;

            return (
              <React.Fragment key={group.poKey}>
                {/* PO parent row */}
                <TableRow
                  className="cursor-pointer hover:bg-muted/50 transition-colors bg-muted/20 font-medium"
                  onClick={() => navigateToPOOverview(group)}
                >
                  <TableCell
                    className="w-8 px-2 cursor-pointer"
                    onClick={(e) => togglePO(e, group.poKey)}
                  >
                    {isExpanded
                      ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      : <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    }
                  </TableCell>
                  <TableCell className="font-mono font-semibold">
                    {group.po_number || "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {matchCount} invoice{matchCount !== 1 ? "s" : ""}
                  </TableCell>
                  <TableCell>{group.vendor_name || "-"}</TableCell>
                  <TableCell>
                    {group.po_date ? new Date(group.po_date).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(group.po_amount)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(group.totalInvoiced)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={PO_STATUS_STYLES[group.po_status] ?? "bg-gray-100 text-gray-800 border-gray-200"}
                    >
                      {group.po_status?.toLowerCase().replace(/_/g, " ") || "open"}
                    </Badge>
                  </TableCell>
                </TableRow>

                {/* Invoice child rows */}
                {isExpanded && group.matches.map((row) => (
                  <TableRow
                    key={row.match_result_id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() =>
                      navigate(`/vouchers/match-results/${row.match_result_id}`, {
                        state: { matchResult: row },
                      })
                    }
                  >
                    <TableCell className="w-8"></TableCell>
                    <TableCell></TableCell>
                    <TableCell className="font-mono text-sm pl-4">
                      {row.invoice_number || "-"}
                    </TableCell>
                    <TableCell className="text-sm">{row.vendor_name || "-"}</TableCell>
                    <TableCell className="text-sm">
                      {row.invoice_date ? new Date(row.invoice_date).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right text-sm">
                      {formatCurrency(row.invoice_amount)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs ${MATCH_STATUS_STYLES[row.match_status] ?? "bg-gray-100 text-gray-800 border-gray-200"}`}
                      >
                        {row.match_status?.toLowerCase().replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            );
          })}

          {/* Orphan invoices (no PO) */}
          {orphans.map((row) => (
            <TableRow
              key={row.match_result_id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() =>
                navigate(`/vouchers/match-results/${row.match_result_id}`, {
                  state: { matchResult: row },
                })
              }
            >
              <TableCell className="w-8"></TableCell>
              <TableCell className="font-mono text-muted-foreground">
                {row.po_number || "-"}
              </TableCell>
              <TableCell className="font-mono font-medium">
                {row.invoice_number || "-"}
              </TableCell>
              <TableCell>{row.vendor_name || "-"}</TableCell>
              <TableCell>
                {row.invoice_date ? new Date(row.invoice_date).toLocaleDateString() : "-"}
              </TableCell>
              <TableCell className="text-right">-</TableCell>
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
