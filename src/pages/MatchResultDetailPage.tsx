import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePageTitle } from "@/contexts/PageTitleContext";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";
import { voucherAPI } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import type { MatchResult } from "@/components/vouchers/MatchResultsTable";

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

/* ---- Comparison row: field label | PO value | Invoice value ---- */

const CompareRow = ({
  label,
  poValue,
  invValue,
  highlight = true,
  className = "",
}: {
  label: string;
  poValue: React.ReactNode;
  invValue: React.ReactNode;
  highlight?: boolean;
  className?: string;
}) => {
  const poStr = String(poValue ?? "");
  const invStr = String(invValue ?? "");
  const differs = highlight && poStr !== invStr && poStr !== "" && invStr !== "" && poStr !== "-" && invStr !== "-";

  return (
    <div className={`grid grid-cols-[180px_1fr_1fr] items-center gap-0 border-b last:border-b-0 ${className}`}>
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

const MatchResultDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setTitle } = usePageTitle();
  const { businessId } = useCurrentBusiness();
  const [loadingDocId, setLoadingDocId] = useState<string | null>(null);

  const matchResult: MatchResult | undefined = location.state?.matchResult;

  useEffect(() => {
    setTitle("Match Result Detail");
  }, [setTitle]);

  const { data: invoiceLineItemsResp, isLoading: isLoadingInvItems } = useQuery({
    queryKey: ["invoice-line-items", matchResult?.invoice_id],
    queryFn: () => (voucherAPI as any).getInvoiceLineItems(businessId!, matchResult!.invoice_id),
    enabled: !!businessId && !!matchResult?.invoice_id,
  });

  const { data: poLineItemsResp, isLoading: isLoadingPOItems } = useQuery({
    queryKey: ["po-line-items", matchResult?.purchase_order_id],
    queryFn: () => (voucherAPI as any).getPOLineItems(businessId!, matchResult!.purchase_order_id!),
    enabled: !!businessId && !!matchResult?.purchase_order_id,
  });

  if (!matchResult) {
    navigate("/vouchers");
    return null;
  }

  const invoiceItems: LineItem[] = (invoiceLineItemsResp as any)?.data ?? [];
  const poItems: LineItem[] = (poLineItemsResp as any)?.data ?? [];

  // Extract matched pairs from match_notes for intelligent line item ordering
  const lineItemsMatch = matchResult.match_notes?.line_items_match as
    | { matched_pairs?: { invoice_item_id: string; po_item_id: string; method: string }[]; unmatched_invoice?: string[] }
    | undefined;

  let lineItemRows: { po: LineItem | null; inv: LineItem | null; matched: boolean }[];

  if (lineItemsMatch?.matched_pairs?.length) {
    const usedPOIds = new Set<string>();
    const usedInvIds = new Set<string>();

    // Matched rows first
    const matchedRows = lineItemsMatch.matched_pairs.map((pair) => {
      const po = poItems.find((p) => p.id === pair.po_item_id) ?? null;
      const inv = invoiceItems.find((i) => i.id === pair.invoice_item_id) ?? null;
      if (po) usedPOIds.add(po.id);
      if (inv) usedInvIds.add(inv.id);
      return { po, inv, matched: true };
    });

    // Unmatched items below
    const unmatchedPO = poItems
      .filter((p) => !usedPOIds.has(p.id))
      .map((p) => ({ po: p, inv: null as LineItem | null, matched: false }));
    const unmatchedInv = invoiceItems
      .filter((i) => !usedInvIds.has(i.id))
      .map((i) => ({ po: null as LineItem | null, inv: i, matched: false }));

    lineItemRows = [...matchedRows, ...unmatchedPO, ...unmatchedInv];
  } else {
    // Fallback: index-based pairing for old records without matched_pairs
    const maxRows = Math.max(poItems.length, invoiceItems.length);
    lineItemRows = Array.from({ length: maxRows }, (_, i) => ({
      po: poItems[i] ?? null,
      inv: invoiceItems[i] ?? null,
      matched: false,
    }));
  }

  const openPdf = async (docId: string) => {
    if (!businessId || !docId) return;
    setLoadingDocId(docId);
    try {
      const resp = await (voucherAPI as any).getDocumentUrl(businessId, docId) as any;
      window.open(resp?.data?.url, "_blank");
    } finally {
      setLoadingDocId(null);
    }
  };

  // Use the snapshot remaining balance from match time if available
  const snapshotBalance = typeof matchResult.match_notes?.po_remaining_balance_at_match === "number"
    ? matchResult.match_notes.po_remaining_balance_at_match as number
    : null;
  const hasSnapshot = snapshotBalance !== null;
  const isPartiallyInvoiced = hasSnapshot && snapshotBalance < matchResult.po_amount;
  const poCompareAmount = isPartiallyInvoiced ? snapshotBalance : matchResult.po_amount;
  const variance = matchResult.invoice_amount - poCompareAmount;
  const hasVariance = Math.abs(variance) > 0.01;

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
        <h2 className="text-2xl font-semibold">Match Detail</h2>
        <Badge
          variant="outline"
          className={MATCH_STATUS_STYLES[matchResult.match_status] ?? "bg-gray-100 text-gray-800 border-gray-200"}
        >
          {matchResult.match_status?.toLowerCase().replace(/_/g, " ")}
        </Badge>
      </div>

      {matchResult.match_notes &&
        Object.keys(matchResult.match_notes).some((k) => k !== "line_items_match" && k !== "po_remaining_balance_at_match") && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-4 text-sm text-amber-800">
            <span className="font-medium">Match notes: </span>
            {Object.entries(matchResult.match_notes)
              .filter(([k]) => k !== "line_items_match" && k !== "po_remaining_balance_at_match")
              .map(([k, v]) => (
                <span key={k}>{k}: {typeof v === "object" ? JSON.stringify(v) : String(v)} </span>
              ))}
          </CardContent>
        </Card>
      )}

      {/* Document summary comparison */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-0 pt-4 px-4">
          {/* Column headers */}
          <div className="grid grid-cols-[180px_1fr_1fr] gap-0 border-b pb-3">
            <div />
            <div className="px-4 flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Purchase Order</CardTitle>
              <Button
                variant="outline"
                size="sm"
                disabled={!matchResult.po_document_id || loadingDocId === matchResult.po_document_id}
                onClick={() => openPdf(matchResult.po_document_id!)}
                className="h-7 text-xs"
              >
                {loadingDocId === matchResult.po_document_id
                  ? <Loader2 className="h-3 w-3 animate-spin" />
                  : <><ExternalLink className="h-3 w-3 mr-1" />PDF</>}
              </Button>
            </div>
            <div className="px-4 flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Invoice</CardTitle>
              <Button
                variant="outline"
                size="sm"
                disabled={!matchResult.invoice_document_id || loadingDocId === matchResult.invoice_document_id}
                onClick={() => openPdf(matchResult.invoice_document_id!)}
                className="h-7 text-xs"
              >
                {loadingDocId === matchResult.invoice_document_id
                  ? <Loader2 className="h-3 w-3 animate-spin" />
                  : <><ExternalLink className="h-3 w-3 mr-1" />PDF</>}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <CompareRow
            label="Reference Number"
            poValue={<span className="font-mono">{matchResult.po_number || "-"}</span>}
            invValue={<span className="font-mono">{matchResult.invoice_number || "-"}</span>}
          />
          <CompareRow
            label="Date"
            poValue={matchResult.po_date ? new Date(matchResult.po_date).toLocaleDateString() : "-"}
            invValue={matchResult.invoice_date ? new Date(matchResult.invoice_date).toLocaleDateString() : "-"}
            highlight={false}
          />
          <CompareRow
            label="Vendor"
            poValue={matchResult.vendor_name || "-"}
            invValue={matchResult.vendor_name || "-"}
          />
          <CompareRow
            label="Total Amount"
            poValue={formatCurrency(matchResult.po_amount)}
            invValue={formatCurrency(matchResult.invoice_amount)}
            highlight={!isPartiallyInvoiced}
          />
          {isPartiallyInvoiced && (
            <CompareRow
              label="Remaining Balance"
              poValue={formatCurrency(snapshotBalance!)}
              invValue={formatCurrency(matchResult.invoice_amount)}
            />
          )}
          <CompareRow
            label="Status"
            highlight={false}
            poValue={
              <Badge variant="outline" className={`text-xs ${PO_STATUS_STYLES[matchResult.po_status] ?? "bg-gray-100 text-gray-800 border-gray-200"}`}>
                {matchResult.po_status || "-"}
              </Badge>
            }
            invValue={
              <Badge variant="outline" className={`text-xs ${MATCH_STATUS_STYLES[matchResult.match_status] ?? ""}`}>
                {matchResult.match_status?.toLowerCase().replace(/_/g, " ")}
              </Badge>
            }
          />

          {/* Amount variance bar */}
          <div className={`mx-0 px-5 py-3 text-sm font-medium flex items-center justify-center gap-3 ${hasVariance ? "bg-red-50 border-t border-red-200 text-red-700" : "bg-green-50 border-t border-green-200 text-green-700"}`}>
            {hasVariance
              ? <>Amount variance: <span className="font-semibold">{formatCurrency(Math.abs(variance))} {variance > 0 ? "over-invoiced" : "under-invoiced"}</span></>
              : <span className="font-semibold">Amounts match exactly</span>}
          </div>
        </CardContent>
      </Card>

      {/* Line items comparison */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-base">Line Items</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {(isLoadingPOItems || isLoadingInvItems) ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Loading line items…
            </div>
          ) : lineItemRows.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No line items found</p>
          ) : (
            <div>
              {/* Column headers */}
              <div className="grid grid-cols-[180px_1fr_1fr] gap-0 border-b bg-muted/30">
                <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-r">Field</div>
                <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-r">Purchase Order</div>
                <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Invoice</div>
              </div>

              {lineItemRows.map((row, idx) => (
                <div key={idx} className={idx > 0 ? "border-t-4 border-muted" : ""}>
                  {/* Line item index label */}
                  <div className="grid grid-cols-[180px_1fr_1fr] gap-0 bg-muted/20 border-b">
                    <div className="px-4 py-1.5 text-xs font-semibold text-muted-foreground border-r col-span-3">
                      Line item {idx + 1}
                      {row.matched && <span className="ml-2 text-green-600">(matched)</span>}
                      {!row.po && <span className="ml-2 text-amber-600">(no PO line)</span>}
                      {!row.inv && <span className="ml-2 text-amber-600">(no invoice line)</span>}
                    </div>
                  </div>

                  <CompareRow
                    label="SKU"
                    poValue={row.po?.sku || "-"}
                    invValue={row.inv?.sku || "-"}
                  />
                  <CompareRow
                    label="Description"
                    poValue={row.po?.description || "-"}
                    invValue={row.inv?.description || "-"}
                  />
                  <CompareRow
                    label="Quantity"
                    poValue={row.po?.quantity ?? "-"}
                    invValue={row.inv?.quantity ?? "-"}
                  />
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
                    label="GST Amount"
                    poValue={row.po != null ? formatCurrency(row.po.tax_amount) : "-"}
                    invValue={row.inv != null ? formatCurrency(row.inv.tax_amount) : "-"}
                  />
                  <CompareRow
                    label="Total Amount"
                    poValue={row.po != null ? formatCurrency(row.po.total_amount) : "-"}
                    invValue={row.inv != null ? formatCurrency(row.inv.total_amount) : "-"}
                  />
                </div>
              ))}

              {/* Totals row */}
              {(poItems.length > 0 || invoiceItems.length > 0) && (
                <div className={`grid grid-cols-[180px_1fr_1fr] gap-0 border-t-4 border-muted font-semibold text-sm ${hasVariance ? "bg-red-50" : "bg-green-50/60"}`}>
                  <div className="px-4 py-3 text-xs font-semibold text-muted-foreground border-r">Grand Total</div>
                  <div className="px-4 py-3 border-r">
                    {poItems.length > 0 ? formatCurrency(poItems.reduce((s, i) => s + i.total_amount, 0)) : "-"}
                  </div>
                  <div className={`px-4 py-3 ${hasVariance ? "text-red-700" : ""}`}>
                    {invoiceItems.length > 0 ? formatCurrency(invoiceItems.reduce((s, i) => s + i.total_amount, 0)) : "-"}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {matchResult.matched_at && (
        <p className="text-xs text-muted-foreground text-right">
          Matched at {new Date(matchResult.matched_at).toLocaleString()}
        </p>
      )}
    </div>
  );
};

export default MatchResultDetailPage;
