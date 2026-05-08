import { z } from "zod";

const lineItemSchema = z.object({
  sku: z.string().optional(),
  description: z.string().min(1, "Line item description is required"),
  quantity: z.number().gt(0, "Quantity must be greater than 0"),
  qty_received: z.number().optional(),
  rate: z.number().gt(0, "Rate must be greater than 0"),
  amount: z.number().nonnegative(),
  gst_rate: z.number().optional(),
  gst_amount: z.number().optional(),
});

const baseDraftSchema = z.object({
  vendor_name: z.string().trim().min(1, "Vendor name is required"),
  vendor_gstin: z.string().optional(),
  buyer_gstin: z.string().optional(),
  invoice_number: z.string().optional(),
  invoice_date: z.string(),
  due_date: z.string(),
  currency: z.string(),
  subtotal: z.number().nonnegative(),
  tax_amount: z.number().nonnegative(),
  discount: z.number().nonnegative(),
  discount_type: z.enum(["FLAT", "PERCENTAGE"]),
  total_amount: z.number().nonnegative(),
  net_amount: z.number().optional(),
  po_number: z.string().optional(),
  notes: z.string(),
  doc_type: z.enum(["INVOICE", "PURCHASE_ORDER"]),
  line_items: z.array(lineItemSchema).min(1, "At least one line item is required"),
  sgst: z.number().optional(),
  cgst: z.number().optional(),
  igst: z.number().optional(),
  gst_type: z.enum(["cgst_sgst", "igst"]).optional(),
  shipping: z.number().optional(),
  round_off: z.boolean().optional(),
  round_off_amount: z.number().optional(),
  payee_id: z.string().nullable().optional(),
  confidence_scores: z.record(z.number()).optional(),
  gst_rate: z.number().optional(),
});

export const voucherDraftSchema = baseDraftSchema.superRefine((draft, ctx) => {
  if (draft.doc_type === "INVOICE") {
    if (!draft.invoice_number || draft.invoice_number.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["invoice_number"],
        message: "Invoice number is required",
      });
    }
  }
});

export type VoucherDraftInput = z.input<typeof voucherDraftSchema>;
export type VoucherDraftParsed = z.output<typeof voucherDraftSchema>;

export interface VoucherDraftValidationError {
  path: string;
  message: string;
}

export const validateVoucherDraft = (
  draft: unknown,
): { ok: true; data: VoucherDraftParsed } | { ok: false; errors: VoucherDraftValidationError[] } => {
  const result = voucherDraftSchema.safeParse(draft);
  if (result.success) return { ok: true, data: result.data };
  const errors = result.error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
  return { ok: false, errors };
};
