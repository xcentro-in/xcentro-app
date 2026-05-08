import type { GSTType } from "@/constants/gstRates";
import { GST_TYPES } from "@/constants/gstRates";
import type { ExtractedData, ExtractedLineItem } from "@/components/vouchers/InvoiceReviewForm";

type RawLineItem = {
  sku?: string;
  item_code?: string;
  description?: string;
  quantity?: number;
  rate?: number;
  unit_price?: number;
  amount?: number;
  total?: number;
  tax_rate?: number;
  gst_rate?: number;
  gst_amount?: number;
};

type RawDraft = {
  vendor_name?: string;
  vendor_gstin?: string | null;
  buyer_gstin?: string | null;
  po_number?: string | null;
  invoice_number?: string | null;
  invoice_date?: string | null;
  invoice_due_date?: string | null;
  due_date?: string | null;
  currency?: string | null;
  subtotal?: number;
  tax_amount?: number;
  discount?: number;
  discount_type?: 'FLAT' | 'PERCENTAGE';
  total_amount?: number;
  notes?: string | null;
  doc_type?: 'INVOICE' | 'PURCHASE_ORDER' | 'OTHER' | 'UNKNOWN' | null;
  sgst?: number;
  cgst?: number;
  igst?: number;
  shipping?: number;
  confidence_scores?: Record<string, number>;
  gst_type?: string | null;
  round_off?: boolean;
  round_off_amount?: number;
  gst_rate?: number;
  line_items?: RawLineItem[];
};

// HTML <input type="date"> requires "YYYY-MM-DD". The backend sometimes
// returns a full datetime string like "2025-08-03 00:00:00" or ISO
// "2025-08-03T00:00:00Z". Slice to the first 10 characters to normalize.
const toDateStr = (v?: string | null): string => (v ? v.slice(0, 10) : "");

const normalizeGstType = (raw: unknown): GSTType => {
  if (raw === 'INTER_STATE') return GST_TYPES.IGST;
  if (raw === 'INTRA_STATE') return GST_TYPES.CGST_SGST;
  if (raw === GST_TYPES.IGST || raw === GST_TYPES.CGST_SGST) return raw as GSTType;
  return GST_TYPES.CGST_SGST;
};

const transformLineItems = (draft: RawDraft): ExtractedLineItem[] => {
  const rawItems: RawLineItem[] = draft.line_items ?? [];
  const allLackGstRate = rawItems.every(
    (li) => !li.tax_rate && li.tax_rate !== 0 && !li.gst_rate && li.gst_rate !== 0,
  );
  let inferredGstRate = 0;
  if (allLackGstRate && (draft.subtotal ?? 0) > 0 && (draft.tax_amount ?? 0) > 0) {
    inferredGstRate = draft.gst_rate
      ? Number(draft.gst_rate)
      : Math.round(((draft.tax_amount ?? 0) / (draft.subtotal ?? 1)) * 100);
  }
  return rawItems.map((li) => {
    const qty = li.quantity ?? 0;
    const rate = li.rate ?? li.unit_price ?? 0;
    const amount = li.amount ?? li.total ?? qty * rate;
    const gstRate = li.tax_rate ?? li.gst_rate ?? inferredGstRate;
    const gstAmount = li.gst_amount ?? (amount * gstRate) / 100;
    return {
      sku: li.sku ?? li.item_code ?? "",
      description: li.description ?? "",
      quantity: qty,
      rate,
      amount,
      gst_rate: gstRate,
      gst_amount: gstAmount,
    };
  });
};

export interface TransformDraftContext {
  /** Buyer GSTIN to fall back to when the draft doesn't carry one. */
  buyerGstinFallback?: string;
}

/**
 * Extract the best-available draft payload from a backend draft response
 * (prefers `validated_data`, falls back to `draft_data`, then to the root payload).
 * Returns null if no usable payload exists.
 */
export const pickDraftPayload = (resp: unknown): RawDraft | null => {
  if (!resp || typeof resp !== "object") return null;
  const r = resp as Record<string, unknown>;
  const dataPayload = (r.data ?? r) as Record<string, unknown> | undefined;
  if (!dataPayload) return null;
  const validated = dataPayload.validated_data as RawDraft | undefined;
  const draft = dataPayload.draft_data as RawDraft | undefined;
  if (validated) return validated;
  if (draft) return draft;
  if (typeof dataPayload.invoice_number === "string" || dataPayload.invoice_number === null) {
    return dataPayload as RawDraft;
  }
  return null;
};

/**
 * Map a raw backend draft (from extraction) into the shape the review forms
 * expect. Keeps backend field-name aliases (tax_rate/unit_price/total) in
 * one place so backend renames surface as type errors here rather than as
 * silently-wrong data downstream.
 */
export const transformDraftToExtractedData = (
  resp: unknown,
  ctx: TransformDraftContext = {},
): ExtractedData | null => {
  const draft = pickDraftPayload(resp);
  if (!draft) return null;

  return {
    vendor_name: draft.vendor_name ?? "",
    vendor_gstin: draft.vendor_gstin ?? undefined,
    buyer_gstin: draft.buyer_gstin || ctx.buyerGstinFallback || undefined,
    po_number: draft.po_number ?? "",
    invoice_number: draft.invoice_number ?? "",
    invoice_date: toDateStr(draft.invoice_date),
    due_date: toDateStr(draft.invoice_due_date ?? draft.due_date),
    currency: draft.currency ?? "INR",
    subtotal: draft.subtotal ?? 0,
    tax_amount: draft.tax_amount ?? 0,
    discount: draft.discount ?? 0,
    discount_type: draft.discount_type ?? 'FLAT',
    total_amount: draft.total_amount ?? 0,
    notes: draft.notes ?? "",
    doc_type: draft.doc_type ?? undefined,
    sgst: draft.sgst ?? 0,
    cgst: draft.cgst ?? 0,
    igst: draft.igst ?? 0,
    shipping: draft.shipping ?? 0,
    confidence_scores: draft.confidence_scores ?? undefined,
    gst_type: normalizeGstType(draft.gst_type),
    round_off: draft.round_off ?? false,
    round_off_amount: draft.round_off_amount ?? 0,
    line_items: transformLineItems(draft),
  };
};
