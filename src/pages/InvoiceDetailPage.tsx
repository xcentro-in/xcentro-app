import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePageTitle } from "@/contexts/PageTitleContext";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";
import { voucherAPI } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import { GST_TYPES } from "@/constants/gstRates";

const MATCH_STATUS_STYLES: Record<string, string> = {
  MATCHED: "bg-green-100 text-green-800 border-green-200",
  PARTIAL_MATCH: "bg-amber-100 text-amber-800 border-amber-200",
  MISMATCH: "bg-red-100 text-red-800 border-red-200",
  ORPHAN_INVOICE: "bg-red-100 text-red-800 border-red-200",
  PENDING_MATCH: "bg-blue-100 text-blue-800 border-blue-200",
};

/* ---- helpers ---- */

const fmt = (n: number) => `₹ ${Number(n ?? 0).toFixed(2)}`;

const Field = ({ label, value, mono = false }: { label: string; value?: string | null; mono?: boolean }) => (
  <div>
    <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
    <p className={`text-sm font-medium ${mono ? "font-mono" : ""}`}>{value || "-"}</p>
  </div>
);

const InvoiceDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setTitle } = usePageTitle();
  const { businessId } = useCurrentBusiness();
  const [loadingDoc, setLoadingDoc] = useState(false);

  const invoiceRow = location.state?.invoice;

  useEffect(() => {
    setTitle("Invoice Detail");
  }, [setTitle]);

  const { data: draftResponse, isLoading } = useQuery({
    queryKey: ["voucher-draft", invoiceRow?.document_id],
    queryFn: () => voucherAPI.getDraftData(invoiceRow!.document_id),
    enabled: !!businessId && !!invoiceRow?.document_id,
    staleTime: Infinity,
  });

  if (!invoiceRow) {
    navigate("/vouchers");
    return null;
  }

  /* Parse draft data the same way VoucherUpload does */
  const raw = draftResponse as any;
  const dataPayload = raw?.data || raw;
  const draft = dataPayload?.validated_data || dataPayload?.draft_data || (dataPayload?.invoice_number ? dataPayload : null);

  const gstType = draft?.gst_type ?? GST_TYPES.CGST_SGST;

  const lineItems: any[] = (() => {
    if (!draft?.line_items) return [];
    return (draft.line_items as any[]).map((li: any) => {
      const qty = li.quantity ?? 0;
      const rate = li.rate ?? li.unit_price ?? 0;
      const amount = li.amount ?? li.total ?? qty * rate;
      const gstRate = li.tax_rate ?? li.gst_rate ?? 0;
      const gstAmount = li.gst_amount ?? (amount * gstRate) / 100;
      return { sku: li.sku ?? "", description: li.description ?? "", quantity: qty, rate, amount, gst_rate: gstRate, gst_amount: gstAmount };
    });
  })();

  /* Compute totals */
  const subtotal = lineItems.reduce((s, i) => s + Number(i.amount), 0);
  const totalGst = lineItems.reduce((s, i) => s + Number(i.gst_amount ?? 0), 0);
  const grossAmount = subtotal + totalGst;
  const discount = Number(draft?.discount ?? 0);
  const discountType = draft?.discount_type ?? "FLAT";
  const discountAmount = discountType === "PERCENTAGE" ? (grossAmount * discount) / 100 : discount;
  const netAmount = grossAmount - discountAmount;
  const shipping = Number(draft?.shipping ?? 0);
  const roundOffAmount = (() => {
    if (!draft?.round_off) return 0;
    const rounded = Math.round(netAmount + shipping);
    return rounded - (netAmount + shipping);
  })();
  const finalPayable = netAmount + shipping + roundOffAmount;

  /* GST breakdown by rate */
  const gstBreakdown: Record<number, { amount: number; gst: number }> = {};
  lineItems.forEach(item => {
    const r = Number(item.gst_rate ?? 0);
    if (!gstBreakdown[r]) gstBreakdown[r] = { amount: 0, gst: 0 };
    gstBreakdown[r].amount += Number(item.amount);
    gstBreakdown[r].gst += Number(item.gst_amount ?? 0);
  });

  const openPdf = async () => {
    if (!businessId || !invoiceRow.document_id) return;
    setLoadingDoc(true);
    try {
      const resp = await voucherAPI.getDocumentUrl(invoiceRow.document_id);
      window.open(resp?.data?.url, "_blank");
    } finally {
      setLoadingDoc(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/vouchers")}
        className="pl-0 hover:pl-0 hover:bg-transparent -ml-1 text-muted-foreground"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Vouchers
      </Button>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Invoice</h2>
        <div className="flex items-center gap-3">
          {invoiceRow.match_status && (
            <Badge variant="outline" className={MATCH_STATUS_STYLES[invoiceRow.match_status] ?? "bg-gray-100 text-gray-800 border-gray-200"}>
              {invoiceRow.match_status.toLowerCase().replace(/_/g, " ")}
            </Badge>
          )}
          <Button variant="outline" size="sm" disabled={!invoiceRow.document_id || loadingDoc} onClick={openPdf}>
            {loadingDoc ? <Loader2 className="h-4 w-4 animate-spin" /> : <><ExternalLink className="h-4 w-4 mr-1.5" />View PDF</>}
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Loading…
        </div>
      )}

      {!isLoading && draft && (
        <>
          {/* Vendor */}
          <Card>
            <CardContent className="p-6">
              <p className="text-xs text-muted-foreground mb-1">Vendor / Supplier</p>
              <p className="text-lg font-semibold mb-0.5">{draft.vendor_name || "-"}</p>
              {draft.vendor_gstin && <p className="text-sm font-mono text-muted-foreground">{draft.vendor_gstin}</p>}
              <div className="pt-4 mt-4 border-t grid grid-cols-2 gap-4">
                <Field label="Vendor GSTIN" value={draft.vendor_gstin} mono />
                <Field label="Buyer GSTIN" value={draft.buyer_gstin} mono />
              </div>
            </CardContent>
          </Card>

          {/* Invoice Details */}
          <Card>
            <CardContent className="p-6">
              <h4 className="text-base font-medium mb-4">Invoice Details</h4>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <Field label="Invoice Number" value={draft.invoice_number} mono />
                <Field label="PO Number" value={draft.po_number} mono />
                <Field label="Invoice Date" value={draft.invoice_date ? new Date(draft.invoice_date).toLocaleDateString() : "-"} />
                <Field label="Due Date" value={(draft.invoice_due_date || draft.due_date) ? new Date(draft.invoice_due_date ?? draft.due_date).toLocaleDateString() : "-"} />
                <Field label="Currency" value={draft.currency} />
              </div>
              {draft.notes && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-muted-foreground mb-1">Notes / Remarks</p>
                  <p className="text-sm">{draft.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* GST Configuration */}
          <Card>
            <CardContent className="p-6">
              <h4 className="text-base font-medium mb-2">GST Configuration</h4>
              <p className="text-sm">
                {gstType === GST_TYPES.CGST_SGST ? "CGST + SGST (Intra-state)" : "IGST (Inter-state)"}
              </p>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 pb-3">
                <h4 className="text-base font-medium">Line Items</h4>
              </div>
              {lineItems.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center pb-8">No line items</p>
              ) : (
                <div>
                  <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-0 border-y bg-muted/30 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    <div className="px-4 py-2.5 border-r">Description</div>
                    <div className="px-4 py-2.5 border-r text-right">Qty</div>
                    <div className="px-4 py-2.5 border-r text-right">Rate</div>
                    <div className="px-4 py-2.5 border-r text-right">Amount</div>
                    <div className="px-4 py-2.5 border-r text-right">GST %</div>
                    <div className="px-4 py-2.5 text-right">GST Amt</div>
                  </div>
                  {lineItems.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-0 border-b last:border-b-0 text-sm">
                      <div className="px-4 py-3 border-r">
                        {item.sku && <span className="font-mono text-xs text-muted-foreground mr-2">{item.sku}</span>}
                        {item.description || "-"}
                      </div>
                      <div className="px-4 py-3 border-r text-right">{item.quantity}</div>
                      <div className="px-4 py-3 border-r text-right">₹ {Number(item.rate).toFixed(2)}</div>
                      <div className="px-4 py-3 border-r text-right">₹ {Number(item.amount).toFixed(2)}</div>
                      <div className="px-4 py-3 border-r text-right">{item.gst_rate}%</div>
                      <div className="px-4 py-3 text-right">₹ {Number(item.gst_amount).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bill Summary */}
          <Card>
            <CardContent className="p-6">
              <h4 className="text-base font-medium mb-4">Bill Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span className="font-medium">{fmt(subtotal)}</span>
                </div>

                {gstType === GST_TYPES.CGST_SGST ? (
                  Object.entries(gstBreakdown).map(([rate, data]) => (
                    <div key={rate} className="space-y-1 text-sm">
                      <div className="flex justify-between text-muted-foreground">
                        <span>CGST @ {rate}% (on ₹{data.amount.toFixed(2)})</span>
                        <span>{fmt(data.gst / 2)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>SGST @ {rate}% (on ₹{data.amount.toFixed(2)})</span>
                        <span>{fmt(data.gst / 2)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  Object.entries(gstBreakdown).map(([rate, data]) => (
                    <div key={rate} className="flex justify-between text-sm text-muted-foreground">
                      <span>IGST @ {rate}% (on ₹{data.amount.toFixed(2)})</span>
                      <span>{fmt(data.gst)}</span>
                    </div>
                  ))
                )}

                <div className="flex justify-between text-sm font-medium">
                  <span>Total {gstType === GST_TYPES.CGST_SGST ? "CGST + SGST" : "IGST"}</span>
                  <span>{fmt(totalGst)}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-sm font-medium">
                  <span>Gross Amount (Subtotal + GST)</span>
                  <span>{fmt(grossAmount)}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-sm">
                  <span>Discount {discountType === "PERCENTAGE" ? `(${discount}%)` : ""}</span>
                  <span className="font-medium">- {fmt(discountAmount)}</span>
                </div>

                <div className="flex justify-between text-sm font-medium">
                  <span>Net Amount</span>
                  <span>{fmt(netAmount)}</span>
                </div>

                {shipping > 0 && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span>{fmt(shipping)}</span>
                  </div>
                )}

                {draft.round_off && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Round off</span>
                    <span>{(roundOffAmount >= 0 ? "+" : "") + roundOffAmount.toFixed(2)}</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Final Payable Amount</span>
                  <span>{fmt(finalPayable)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {!isLoading && !draft && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <p className="text-sm">Draft data unavailable for this invoice.</p>
            <p className="text-xs mt-1">Invoice #{invoiceRow.inv_id} — {new Date(invoiceRow.inv_date).toLocaleDateString()}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InvoiceDetailPage;
