import { useCallback, useMemo, useState } from "react";
import { GST_TYPES, type GSTType } from "@/constants/gstRates";
import type { ExtractedData, ExtractedLineItem } from "@/components/vouchers/InvoiceReviewForm";

export interface DraftFormComputed {
  gstType: GSTType;
  computedSubtotal: number;
  totalGst: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  grossAmount: number;
  discountAmount: number;
  netAmount: number;
  shippingAmount: number;
  roundOffAmount: number;
  finalPayableAmount: number;
  gstBreakdown: Record<number, { amount: number; gst: number }>;
  useDocumentGst: boolean;
}

export interface UseDraftFormStateResult {
  form: ExtractedData;
  setForm: React.Dispatch<React.SetStateAction<ExtractedData>>;
  editedFields: Set<string>;
  markEdited: (field: string) => void;
  updateField: <K extends keyof ExtractedData>(key: K, value: ExtractedData[K]) => void;
  updateLineItem: (idx: number, field: keyof ExtractedLineItem, value: string | number) => void;
  addLineItem: () => void;
  removeLineItem: (idx: number) => void;
  isLowConfidence: (field: string) => boolean;
  lowConfidenceFields: string[];
  computed: DraftFormComputed;
}

const LOW_CONFIDENCE_THRESHOLD = 0.7;

const emptyLineItem = (): ExtractedLineItem => ({
  description: "",
  sku: "",
  quantity: 1,
  qty_received: 0,
  rate: 0,
  amount: 0,
  gst_rate: 0,
  gst_amount: 0,
});

export const useDraftFormState = (data: ExtractedData): UseDraftFormStateResult => {
  const [form, setForm] = useState<ExtractedData>({ ...data });
  const [editedFields, setEditedFields] = useState<Set<string>>(new Set());

  const markEdited = useCallback((field: string) => {
    setEditedFields((prev) => {
      if (prev.has(field)) return prev;
      const next = new Set(prev);
      next.add(field);
      return next;
    });
  }, []);

  const updateField = useCallback(
    <K extends keyof ExtractedData>(key: K, value: ExtractedData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      markEdited(key as string);
    },
    [markEdited],
  );

  const updateLineItem = useCallback(
    (idx: number, field: keyof ExtractedLineItem, value: string | number) => {
      setForm((prev) => {
        const items = [...prev.line_items];
        const item = { ...items[idx], [field]: value };
        if (field === "gst_rate") {
          const itemAmount = Number(item.quantity) * Number(item.rate);
          item.amount = itemAmount;
          item.gst_amount = (itemAmount * Number(item.gst_rate)) / 100;
          item.gst_amount_overridden = false;
        } else if (field === "gst_amount") {
          item.gst_amount_overridden = true;
        } else if (field === "quantity" || field === "rate") {
          const itemAmount = Number(item.quantity) * Number(item.rate);
          item.amount = itemAmount;
          if (!item.gst_amount_overridden && Number(item.gst_rate) > 0) {
            item.gst_amount = (itemAmount * Number(item.gst_rate)) / 100;
          }
        }
        items[idx] = item;
        return { ...prev, line_items: items };
      });
      markEdited(`line_items[${idx}].${field as string}`);
    },
    [markEdited],
  );

  const addLineItem = useCallback(() => {
    setForm((prev) => ({ ...prev, line_items: [...prev.line_items, emptyLineItem()] }));
  }, []);

  const removeLineItem = useCallback((idx: number) => {
    setForm((prev) => ({ ...prev, line_items: prev.line_items.filter((_, i) => i !== idx) }));
  }, []);

  const isLowConfidence = useCallback(
    (field: string) => {
      const score = form.confidence_scores?.[field];
      return score !== undefined && score < LOW_CONFIDENCE_THRESHOLD;
    },
    [form.confidence_scores],
  );

  const lowConfidenceFields = useMemo(
    () =>
      Object.entries(form.confidence_scores ?? {})
        .filter(([, score]) => score < LOW_CONFIDENCE_THRESHOLD)
        .map(([field]) => field.replace(/_/g, " ")),
    [form.confidence_scores],
  );

  const computed = useMemo<DraftFormComputed>(() => {
    const gstType = form.gst_type ?? GST_TYPES.CGST_SGST;
    const computedSubtotal = form.line_items.reduce((sum, li) => sum + Number(li.amount), 0);
    const lineItemGst = form.line_items.reduce((sum, li) => sum + Number(li.gst_amount ?? 0), 0);

    // When no line item carries GST, use document-level fields (form.igst / form.sgst / form.cgst)
    const useDocumentGst =
      lineItemGst === 0 &&
      ((form.igst ?? 0) > 0 || (form.sgst ?? 0) > 0 || (form.cgst ?? 0) > 0);

    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;
    const gstBreakdown: Record<number, { amount: number; gst: number }> = {};

    if (useDocumentGst) {
      igstAmount = Number(form.igst ?? 0);
      cgstAmount = Number(form.cgst ?? 0);
      sgstAmount = Number(form.sgst ?? 0);
    } else {
      form.line_items.forEach((item) => {
        const itemGst = Number(item.gst_amount ?? 0);
        if (gstType === GST_TYPES.CGST_SGST) {
          cgstAmount += itemGst / 2;
          sgstAmount += itemGst / 2;
        } else {
          igstAmount += itemGst;
        }
        const rate = Number(item.gst_rate ?? 0);
        if (!gstBreakdown[rate]) gstBreakdown[rate] = { amount: 0, gst: 0 };
        gstBreakdown[rate].amount += Number(item.amount);
        gstBreakdown[rate].gst += itemGst;
      });
    }

    const totalGst = igstAmount + cgstAmount + sgstAmount;
    const grossAmount = computedSubtotal + totalGst;
    const discountAmount =
      form.discount_type === "PERCENTAGE"
        ? (grossAmount * Number(form.discount)) / 100
        : Number(form.discount);
    const netAmount = grossAmount - discountAmount;
    const shippingAmount = Number(form.shipping ?? 0);

    let roundOffAmount = 0;
    if (form.round_off) {
      const rounded = Math.round(netAmount + shippingAmount);
      roundOffAmount = rounded - (netAmount + shippingAmount);
    }

    const finalPayableAmount = netAmount + shippingAmount + roundOffAmount;

    return {
      gstType,
      computedSubtotal,
      totalGst,
      cgstAmount,
      sgstAmount,
      igstAmount,
      grossAmount,
      discountAmount,
      netAmount,
      shippingAmount,
      roundOffAmount,
      finalPayableAmount,
      gstBreakdown,
      useDocumentGst,
    };
  }, [form]);

  return {
    form,
    setForm,
    editedFields,
    markEdited,
    updateField,
    updateLineItem,
    addLineItem,
    removeLineItem,
    isLowConfidence,
    lowConfidenceFields,
    computed,
  };
};
