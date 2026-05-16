import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePageTitle } from "@/contexts/PageTitleContext";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";
import { voucherAPI } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import type { POGroup, MatchResult } from "@/components/vouchers/MatchResultsTable";

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
  CLOSED: "bg-green-100 text-green-800 border-green-200",
};

interface LineItem {
  id: string;
  sku: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
}

const CompareRow = ({
  label,
  poValue,
  invValue,
  highlight = true,
}: {
  label: string;
  poValue: React.ReactNode;
  invValue: React.ReactNode;
  highlight?: boolean;
}) => {
  const poStr = String(poValue ?? "");
  const invStr = String(invValue ?? "");
  const differs = highlight && poStr !== invStr && poStr !== "" && invStr !== "" && poStr !== "-" && invStr !== "-";

  return (
    <div className="grid grid-cols-[180px_1fr_1fr] items-center gap-0 border-b last:border-b-0">
      <div className="px-4 py-2.5 text-xs font-medium text-muted-foreground bg-muted/30 border-r">
        {label}
      </div>
      <div className={`px-4 py-2.5 text-sm border-r ${differs ? "bg-red-50 text-red-900" : ""}`}>
        {poValue ?? "-"}
      </div>
      <div className={`px-4 py-2.5 text-sm ${differs ? "bg-red-50 text-red-900" : ""}`}>
        {invValue ?? "-"}
      </div>
    </div>
  );
};

/* ---- Single invoice match section (expandable) ---- */

const InvoiceMatchSection = ({
  match,
  poItems,
  businessId,
}: {
  match: MatchResult;
  poItems: LineItem[];
  businessId: string;
}) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [loadingDocId, setLoadingDocId] = useState<string | null>(null);

  const { data: invoiceLineItemsResp, isLoading: isLoadingInvItems } = useQuery({
    queryKey: ["invoice-line-items", match.invoice_id],
    queryFn: () => voucherAPI.getInvoiceLineItems(match.invoice_id),
    enabled: !!businessId && !!match.invoice_id && expanded,
  });

  const invoiceItems: LineItem[] = (invoiceLineItemsResp as any)?.data ?? [];

  // Extract matched pairs from match_notes
  const lineItemsMatch = match.match_notes?.line_items_match as
    | { matched_pairs?: { invoice_item_id: string; po_item_id: string; method: string }[] }
    | undefined;

  let lineItemRows: { po: LineItem | null; inv: LineItem | null; matched: boolean }[] = [];

  if (expanded) {
    if (lineItemsMatch?.matched_pairs?.length) {
      const usedPOIds = new Set<string>();
      const usedInvIds = new Set<string>();

      const matchedRows = lineItemsMatch.matched_pairs.map((pair) => {
        const po = poItems.find((p) => p.id === pair.po_item_id) ?? null;
        const inv = invoiceItems.find((i) => i.id === pair.invoice_item_id) ?? null;
        if (po) usedPOIds.add(po.id);
        if (inv) usedInvIds.add(inv.id);
        return { po, inv, matched: true };
      });

      const unmatchedInv = invoiceItems
        .filter((i) => !usedInvIds.has(i.id))
        .map((i) => ({ po: null as LineItem | null, inv: i, matched: false }));

      lineItemRows = [...matchedRows, ...unmatchedInv];
    } else {
      const maxRows = Math.max(poItems.length, invoiceItems.length);
      lineItemRows = Array.from({ length: maxRows }, (_, i) => ({
        po: poItems[i] ?? null,
        inv: invoiceItems[i] ?? null,
        matched: false,
      }));
    }
  }

  const openPdf = async (docId: string) => {
    if (!businessId || !docId) return;
    setLoadingDocId(docId);
    try {
      const resp = await voucherAPI.getDocumentUrl(docId);
      window.open(resp?.data?.url, "_blank");
    } finally {
      setLoadingDocId(null);
    }
  };

  const snapshotBalance = typeof match.match_notes?.po_remaining_balance_at_match === "number"
    ? match.match_notes.po_remaining_balance_at_match as number
    : null;

  return (
    <Card className="overflow-hidden">
      {/* Invoice header - always visible */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-3">
          {expanded
            ? <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
            : <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          }
          <div>
            <span className="font-mono font-semibold text-sm">{match.invoice_number || "-"}</span>
            <span className="text-muted-foreground text-xs ml-3">
              {match.invoice_date ? new Date(match.invoice_date).toLocaleDateString() : ""}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-semibold text-sm">{formatCurrency(match.invoice_amount)}</span>
          {snapshotBalance !== null && (
            <span className="text-xs text-muted-foreground">
              (bal: {formatCurrency(snapshotBalance)})
            </span>
          )}
          <Badge
            variant="outline"
            className={`text-xs ${MATCH_STATUS_STYLES[match.match_status] ?? "bg-gray-100 text-gray-800 border-gray-200"}`}
          >
            {match.match_status?.toLowerCase().replace(/_/g, " ")}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-muted-foreground"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/vouchers/match-results/${match.match_result_id}`, {
                state: { matchResult: match },
              });
            }}
          >
            Full detail →
          </Button>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <CardContent className="p-0 border-t">
          {/* Match notes */}
          {match.match_notes &&
            Object.keys(match.match_notes).some((k) => k !== "line_items_match" && k !== "po_remaining_balance_at_match") && (
            <div className="px-4 py-2 text-xs text-amber-800 bg-amber-50/50 border-b">
              <span className="font-medium">Notes: </span>
              {Object.entries(match.match_notes)
                .filter(([k]) => k !== "line_items_match" && k !== "po_remaining_balance_at_match")
                .map(([k, v]) => (
                  <span key={k}>{k}: {typeof v === "object" ? JSON.stringify(v) : String(v)} </span>
                ))}
            </div>
          )}

          {/* Invoice PDF link */}
          {match.invoice_document_id && (
            <div className="px-4 py-2 border-b flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={loadingDocId === match.invoice_document_id}
                onClick={() => openPdf(match.invoice_document_id!)}
                className="h-7 text-xs"
              >
                {loadingDocId === match.invoice_document_id
                  ? <Loader2 className="h-3 w-3 animate-spin" />
                  : <><ExternalLink className="h-3 w-3 mr-1" />View Invoice PDF</>}
              </Button>
            </div>
          )}

          {/* Line items */}
          {isLoadingInvItems ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading line items...
            </div>
          ) : lineItemRows.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No line items found</p>
          ) : (
            <div>
              <div className="grid grid-cols-[180px_1fr_1fr] gap-0 border-b bg-muted/30">
                <div className="px-4 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-r">Field</div>
                <div className="px-4 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-r">Purchase Order</div>
                <div className="px-4 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Invoice</div>
              </div>

              {lineItemRows.map((row, idx) => (
                <div key={idx} className={idx > 0 ? "border-t-2 border-muted" : ""}>
                  <div className="grid grid-cols-[180px_1fr_1fr] gap-0 bg-muted/10 border-b">
                    <div className="px-4 py-1 text-xs font-semibold text-muted-foreground border-r col-span-3">
                      Line item {idx + 1}
                      {row.matched && <span className="ml-2 text-green-600">(matched)</span>}
                      {!row.po && <span className="ml-2 text-amber-600">(no PO line)</span>}
                      {!row.inv && <span className="ml-2 text-amber-600">(no invoice line)</span>}
                    </div>
                  </div>
                  <CompareRow label="SKU" poValue={row.po?.sku || "-"} invValue={row.inv?.sku || "-"} />
                  <CompareRow label="Description" poValue={row.po?.description || "-"} invValue={row.inv?.description || "-"} />
                  <CompareRow label="Quantity" poValue={row.po?.quantity ?? "-"} invValue={row.inv?.quantity ?? "-"} />
                  <CompareRow
                    label="Unit Price"
                    poValue={row.po != null ? formatCurrency(row.po.unit_price) : "-"}
                    invValue={row.inv != null ? formatCurrency(row.inv.unit_price) : "-"}
                  />
                  <CompareRow
                    label="GST Rate"
                    poValue={row.po != null ? `${row.po.tax_rate}%` : "-"}
                    invValue={row.inv != null ? `${row.inv.tax_rate}%` : "-"}
                  />
                  <CompareRow
                    label="Total Amount"
                    poValue={row.po != null ? formatCurrency(row.po.total_amount) : "-"}
                    invValue={row.inv != null ? formatCurrency(row.inv.total_amount) : "-"}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

/* ---- Main PO Match Overview Page ---- */

const POMatchOverviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setTitle } = usePageTitle();
  const { businessId } = useCurrentBusiness();
  const [loadingDocId, setLoadingDocId] = useState<string | null>(null);

  const poGroup: POGroup | undefined = location.state?.poGroup;

  useEffect(() => {
    setTitle("PO Match Overview");
  }, [setTitle]);

  const { data: poLineItemsResp, isLoading: isLoadingPOItems } = useQuery({
    queryKey: ["po-line-items", poGroup?.poKey],
    queryFn: () => voucherAPI.getPOLineItems(poGroup!.poKey),
    enabled: !!businessId && !!poGroup?.poKey,
  });

  if (!poGroup) {
    navigate("/vouchers");
    return null;
  }

  const poItems: LineItem[] = (poLineItemsResp as any)?.data ?? [];

  const totalInvoiced = poGroup.totalInvoiced;
  const remainingBalance = poGroup.po_amount - totalInvoiced;
  const matchedCount = poGroup.matches.filter((m) => m.match_status === "MATCHED").length;
  const mismatchCount = poGroup.matches.filter((m) => m.match_status === "MISMATCH").length;

  const openPdf = async (docId: string) => {
    if (!businessId || !docId) return;
    setLoadingDocId(docId);
    try {
      const resp = await voucherAPI.getDocumentUrl(docId);
      window.open(resp?.data?.url, "_blank");
    } finally {
      setLoadingDocId(null);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/vouchers")}
          className="pl-0 hover:pl-0 hover:bg-transparent -ml-1 text-muted-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Vouchers
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">PO Match Overview</h2>
        <Badge
          variant="outline"
          className={PO_STATUS_STYLES[poGroup.po_status] ?? "bg-gray-100 text-gray-800 border-gray-200"}
        >
          {poGroup.po_status?.toLowerCase().replace(/_/g, " ") || "open"}
        </Badge>
      </div>

      {/* PO Summary Card */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3 pt-4 px-5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Purchase Order Summary</CardTitle>
            {poGroup.po_document_id && (
              <Button
                variant="outline"
                size="sm"
                disabled={loadingDocId === poGroup.po_document_id}
                onClick={() => openPdf(poGroup.po_document_id!)}
                className="h-7 text-xs"
              >
                {loadingDocId === poGroup.po_document_id
                  ? <Loader2 className="h-3 w-3 animate-spin" />
                  : <><ExternalLink className="h-3 w-3 mr-1" />View PO PDF</>}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">PO Number</p>
              <p className="font-mono font-semibold">{poGroup.po_number}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Vendor</p>
              <p className="font-medium">{poGroup.vendor_name || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">PO Date</p>
              <p>{poGroup.po_date ? new Date(poGroup.po_date).toLocaleDateString() : "-"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">PO Total Amount</p>
              <p className="font-semibold">{formatCurrency(poGroup.po_amount)}</p>
            </div>
          </div>

          {/* Invoicing summary bar */}
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Total Invoiced</p>
                <p className="font-semibold">{formatCurrency(totalInvoiced)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Remaining Balance</p>
                <p className={`font-semibold ${remainingBalance < 0 ? "text-red-600" : ""}`}>
                  {formatCurrency(Math.abs(remainingBalance))}
                  {remainingBalance < 0 && <span className="text-xs ml-1">(over-invoiced)</span>}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Invoices</p>
                <p>
                  <span className="font-semibold">{poGroup.matches.length}</span>
                  {matchedCount > 0 && <span className="text-green-600 text-xs ml-1">({matchedCount} matched)</span>}
                  {mismatchCount > 0 && <span className="text-red-600 text-xs ml-1">({mismatchCount} mismatch)</span>}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Matched %</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${remainingBalance < 0 ? "bg-red-500" : "bg-green-500"}`}
                      style={{ width: `${Math.min(100, remainingBalance > 0 ? Math.floor((totalInvoiced / poGroup.po_amount) * 100) : Math.round((totalInvoiced / poGroup.po_amount) * 100))}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium">
                    {remainingBalance > 0
                      ? Math.floor((totalInvoiced / poGroup.po_amount) * 100)
                      : Math.round((totalInvoiced / poGroup.po_amount) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Matches */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold">
          Invoice Matches ({poGroup.matches.length})
        </h3>

        {isLoadingPOItems ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Loading PO line items...
          </div>
        ) : (
          poGroup.matches.map((match) => (
            <InvoiceMatchSection
              key={match.match_result_id}
              match={match}
              poItems={poItems}
              businessId={businessId!}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default POMatchOverviewPage;
