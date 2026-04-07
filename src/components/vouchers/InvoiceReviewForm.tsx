import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GST_RATES, GST_TYPES, type GSTType } from "@/constants/gstRates";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Pencil,
  AlertTriangle,
  Plus,
  X,
  Send,
  ShieldCheck,
} from "lucide-react";
import AddPayeeResolutionDialog from "@/components/vouchers/AddPayeeResolutionDialog";
import { useVendors } from "@/hooks/useVendors";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

export interface ExtractedLineItem {
  sku?: string;
  description: string;
  quantity: number;
  qty_received?: number;
  rate: number;
  amount: number;
  gst_rate: number;
  gst_amount: number;
}

export interface PayeeResolution {
  payee_id: string | null;
  status: 'VERIFIED' | 'NOT_FOUND';
  confidence: 'HIGH' | 'LOW';
  suggested_data?: Record<string, any>;
}

export interface BusinessResolution {
  business_id: string | null;
  resolved_via: string;
}

export interface ExtractedData {
  vendor_name: string;
  vendor_gstin?: string;
  buyer_gstin?: string;
  po_number?: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  currency: string;
  subtotal: number;
  tax_amount: number;
  discount: number;
  discount_type: 'FLAT' | 'PERCENTAGE';
  total_amount: number;
  notes: string;
  doc_type?: 'INVOICE' | 'PURCHASE_ORDER' | 'OTHER' | 'UNKNOWN';
  line_items: ExtractedLineItem[];
  sgst?: number;
  cgst?: number;
  igst?: number;
  shipping?: number;
  confidence_scores?: Record<string, number>;
  payee_id?: string | null;
  gst_type?: GSTType;
  round_off?: boolean;
  round_off_amount?: number;
}

interface InvoiceReviewFormProps {
  data: ExtractedData;
  onSubmit: (corrected: ExtractedData) => void;
  isSubmitting: boolean;
  payeeResolution?: PayeeResolution | null;
  businessResolution?: BusinessResolution | null;
  businessId?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

const InvoiceReviewForm = ({
  data,
  onSubmit,
  isSubmitting,
  payeeResolution: initialPayeeResolution,
  businessResolution,
  businessId,
}: InvoiceReviewFormProps) => {
  const { businessId: currentBusinessId } = useCurrentBusiness();
  const effectiveBusinessId = businessId || currentBusinessId;
  const { vendors, refetch: refetchVendors } = useVendors(effectiveBusinessId);

  const [form, setForm] = useState<ExtractedData>({ ...data });
  const [editedFields, setEditedFields] = useState<Set<string>>(new Set());
  const [payeeResolution, setPayeeResolution] = useState<PayeeResolution | null | undefined>(initialPayeeResolution);
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [selectedVendorRelationId, setSelectedVendorRelationId] = useState<string>('');
  const [showVendorSelector, setShowVendorSelector] = useState(false);

  /* Track which fields the user has manually changed */
  const markEdited = (field: string) => {
    setEditedFields((prev) => new Set(prev).add(field));
  };

  /* Generic scalar field handler */
  const updateField = <K extends keyof ExtractedData>(
    key: K,
    value: ExtractedData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    markEdited(key);
  };

  /* ---- Line item helpers ---- */

  const updateLineItem = (
    idx: number,
    field: keyof ExtractedLineItem,
    value: string | number
  ) => {
    setForm((prev) => {
      const items = [...prev.line_items];
      const item = { ...items[idx], [field]: value };

      // Recalculate amount and GST when quantity, rate, or gst_rate changes
      if (field === "quantity" || field === "rate" || field === "gst_rate") {
        const itemAmount = Number(item.quantity) * Number(item.rate);
        item.amount = itemAmount;
        item.gst_amount = (itemAmount * Number(item.gst_rate)) / 100;
      }

      items[idx] = item;
      return { ...prev, line_items: items };
    });
    markEdited(`line_items[${idx}].${field}`);
  };

  const addLineItem = () => {
    setForm((prev) => ({
      ...prev,
      line_items: [
        ...prev.line_items,
        { description: "", sku: "", quantity: 1, qty_received: 0, rate: 0, amount: 0, gst_rate: 0, gst_amount: 0 },
      ],
    }));
  };

  const removeLineItem = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      line_items: prev.line_items.filter((_, i) => i !== idx),
    }));
  };

  /* ---- Recalculate totals from line items ---- */

  const gstType = form.gst_type ?? GST_TYPES.CGST_SGST;

  const computedSubtotal = form.line_items.reduce(
    (sum, li) => sum + Number(li.amount),
    0
  );

  const totalGst = form.line_items.reduce(
    (sum, li) => sum + Number(li.gst_amount ?? 0),
    0
  );

  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;
  form.line_items.forEach(item => {
    const itemGst = Number(item.gst_amount ?? 0);
    if (gstType === GST_TYPES.CGST_SGST) {
      cgstAmount += itemGst / 2;
      sgstAmount += itemGst / 2;
    } else {
      igstAmount += itemGst;
    }
  });

  const grossAmount = computedSubtotal + totalGst;

  const discountAmount = form.discount_type === 'PERCENTAGE'
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

  /* ---- GST breakdown by rate for summary ---- */
  const getGstBreakdown = () => {
    const breakdown: Record<number, { amount: number; gst: number }> = {};
    form.line_items.forEach(item => {
      const rate = Number(item.gst_rate ?? 0);
      if (!breakdown[rate]) {
        breakdown[rate] = { amount: 0, gst: 0 };
      }
      breakdown[rate].amount += Number(item.amount);
      breakdown[rate].gst += Number(item.gst_amount ?? 0);
    });
    return breakdown;
  };

  /* ---- Render helpers ---- */

  const EditedBadge = ({ field }: { field: string }) => {
    if (!editedFields.has(field)) return null;
    return (
      <Badge
        variant="outline"
        className="text-[10px] gap-0.5 px-1.5 py-0 bg-blue-50 text-blue-600 border-blue-200"
      >
        <Pencil className="h-2.5 w-2.5" /> Edited
      </Badge>
    );
  };

  const ConfidenceBadge = ({ field }: { field: string }) => {
    const score = form.confidence_scores?.[field];
    if (score === undefined || score >= 1.0) return null;
    const pct = Math.round(score * 100);
    const lowConfidence = score < 0.7;
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="outline"
              className={`text-[10px] gap-0.5 px-1.5 py-0 cursor-help ${
                lowConfidence 
                  ? "bg-red-50 text-red-600 border-red-200" 
                  : "bg-amber-50 text-amber-600 border-amber-200"
              }`}
            >
              <AlertTriangle className="h-2.5 w-2.5" /> {pct}%
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            Extraction confidence: {pct}% — please verify this field
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const isLowConfidence = (field: string) => {
    const score = form.confidence_scores?.[field];
    return score !== undefined && score < 0.7;
  };

  const LOW_CONFIDENCE_THRESHOLD = 0.7;
  const lowConfidenceFields = Object.entries(form.confidence_scores ?? {})
    .filter(([_, score]) => score < LOW_CONFIDENCE_THRESHOLD)
    .map(([field]) => field.replace(/_/g, ' '));


  /* ---- Vendor selection helpers ---- */

  const handlePayeeCreated = async (payeeId: string, displayName: string, gstin?: string) => {
    setSelectedVendorRelationId(payeeId);
    setForm((prev) => ({ ...prev, vendor_name: displayName, ...(gstin ? { vendor_gstin: gstin } : {}) }));
    setPayeeResolution({ payee_id: payeeId, status: 'VERIFIED', confidence: 'HIGH' });
    await refetchVendors();
    setShowVendorSelector(true);
  };

  const handleSubmit = () => {
    const corrected: ExtractedData = {
      ...form,
      subtotal: computedSubtotal,
      tax_amount: totalGst,
      sgst: gstType === GST_TYPES.CGST_SGST ? sgstAmount : 0,
      cgst: gstType === GST_TYPES.CGST_SGST ? cgstAmount : 0,
      igst: gstType === GST_TYPES.IGST ? igstAmount : 0,
      shipping: shippingAmount,
      total_amount: finalPayableAmount,
      gst_type: gstType,
      round_off: form.round_off,
      round_off_amount: roundOffAmount,
      payee_id: payeeResolution?.payee_id ?? form.payee_id,
    };
    onSubmit(corrected);
  };

  return (
    <div className="space-y-6">
      {/* Low-confidence summary alert */}
      {lowConfidenceFields.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                {lowConfidenceFields.length} field{lowConfidenceFields.length > 1 ? 's' : ''} extracted with low confidence
              </p>
              <p className="text-xs text-amber-600 mt-1">
                Fields: <span className="capitalize">{lowConfidenceFields.join(', ')}</span> — please verify these before submitting.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vendor / Supplier */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5">
              <Label className="text-base font-medium">Vendor / Supplier</Label>
              <ConfidenceBadge field="vendor_name" />
            </div>
            <div className="flex items-center gap-1.5">
              <EditedBadge field="vendor_name" />
              {payeeResolution?.status === 'VERIFIED' && (
                <Badge
                  variant="outline"
                  className="text-[10px] gap-0.5 px-1.5 py-0 bg-green-50 text-green-600 border-green-200"
                >
                  <ShieldCheck className="h-2.5 w-2.5" /> Verified Vendor
                </Badge>
              )}
            </div>
          </div>

          {/* Static vendor info from extraction */}
          <div className="space-y-1 mb-4">
            <p className="text-lg font-semibold">{form.vendor_name || <span className="text-muted-foreground italic">Not extracted</span>}</p>
            {form.vendor_gstin && (
              <p className="text-sm font-mono text-muted-foreground">{form.vendor_gstin}</p>
            )}
          </div>

          {/* Post-creation vendor selector */}
          {showVendorSelector && vendors.length > 0 && (
            <div className="mb-4">
              <Label className="text-sm mb-1.5 block">Link to vendor in directory</Label>
              <Select
                value={selectedVendorRelationId}
                onValueChange={(val) => {
                  setSelectedVendorRelationId(val);
                  const v = vendors.find(v => v.relation_id === val);
                  if (v) setForm((prev) => ({ ...prev, vendor_name: v.display_name }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor…" />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map(v => (
                    <SelectItem key={v.relation_id} value={v.relation_id}>
                      {v.display_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Vendor not found alert */}
          {payeeResolution?.status === 'NOT_FOUND' && !selectedVendorRelationId && (
            <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-amber-700 font-medium">Vendor not found in your directory.</p>
                  {(payeeResolution.suggested_data?.vendor_name || payeeResolution.suggested_data?.vendor_gstin) && (
                    <p className="text-xs text-amber-600 mt-0.5">
                      Extracted:{" "}
                      {payeeResolution.suggested_data?.vendor_name && (
                        <span className="font-medium">{payeeResolution.suggested_data.vendor_name}</span>
                      )}
                      {payeeResolution.suggested_data?.vendor_gstin && (
                        <span className="font-mono ml-1">({payeeResolution.suggested_data.vendor_gstin})</span>
                      )}
                    </p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 text-amber-700 border-amber-300 hover:bg-amber-100 h-7 text-xs"
                  onClick={() => setShowAddVendor(true)}
                >
                  Create vendor
                </Button>
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="buyer_gstin">Buyer GSTIN</Label>
                <ConfidenceBadge field="buyer_gstin" />
              </div>
              <EditedBadge field="buyer_gstin" />
            </div>
            <Input
              id="buyer_gstin"
              value={form.buyer_gstin || ""}
              onChange={(e) => updateField("buyer_gstin", e.target.value)}
              className={isLowConfidence("buyer_gstin") ? "ring-2 ring-amber-300 border-amber-300 uppercase" : "uppercase"}
              placeholder="e.g. 29ABCDE1234F2Z5"
            />
          </div>
        </CardContent>
      </Card>

      {/* Add Vendor Dialog */}
      <AddPayeeResolutionDialog
        open={showAddVendor}
        onOpenChange={setShowAddVendor}
        businessId={effectiveBusinessId}
        defaultVendorName={form.vendor_name || payeeResolution?.suggested_data?.vendor_name}
        defaultGstin={form.vendor_gstin || payeeResolution?.suggested_data?.vendor_gstin}
        onPayeeCreated={handlePayeeCreated}
      />

      {/* Invoice Details */}
      <Card>
        <CardContent className="p-6">
          <h4 className="text-base font-medium mb-4">Invoice Details</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* Invoice number */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Label htmlFor="invoice_number">Invoice Number</Label>
                  <ConfidenceBadge field="invoice_number" />
                </div>
                <EditedBadge field="invoice_number" />
              </div>
              <Input
                id="invoice_number"
                value={form.invoice_number}
                onChange={(e) => updateField("invoice_number", e.target.value)}
                className={isLowConfidence("invoice_number") ? "ring-2 ring-amber-300 border-amber-300" : ""}
              />
            </div>

            {/* PO Number */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Label htmlFor="po_number">PO Number</Label>
                  <ConfidenceBadge field="po_number" />
                </div>
                <EditedBadge field="po_number" />
              </div>
              <Input
                id="po_number"
                value={form.po_number || ""}
                onChange={(e) => updateField("po_number", e.target.value)}
                className={isLowConfidence("po_number") ? "ring-2 ring-amber-300 border-amber-300" : ""}
                placeholder="Optional"
              />
            </div>

            {/* Invoice date */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Label htmlFor="invoice_date">Invoice Date</Label>
                  <ConfidenceBadge field="invoice_date" />
                </div>
                <EditedBadge field="invoice_date" />
              </div>
              <Input
                id="invoice_date"
                type="date"
                value={form.invoice_date}
                onChange={(e) => updateField("invoice_date", e.target.value)}
                className={isLowConfidence("invoice_date") ? "ring-2 ring-amber-300 border-amber-300" : ""}
              />
            </div>

            {/* Due date */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Label htmlFor="due_date">Due Date</Label>
                  <ConfidenceBadge field="due_date" />
                </div>
                <EditedBadge field="due_date" />
              </div>
              <Input
                id="due_date"
                type="date"
                value={form.due_date}
                onChange={(e) => updateField("due_date", e.target.value)}
                className={isLowConfidence("due_date") ? "ring-2 ring-amber-300 border-amber-300" : ""}
              />
            </div>

            {/* Currency */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Label htmlFor="currency">Currency</Label>
                  <ConfidenceBadge field="currency" />
                </div>
                <EditedBadge field="currency" />
              </div>
              <Input
                id="currency"
                value={form.currency}
                onChange={(e) => updateField("currency", e.target.value)}
                className={isLowConfidence("currency") ? "ring-2 ring-amber-300 border-amber-300" : ""}
              />
            </div>

            {/* Vendor GSTIN */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Label htmlFor="vendor_gstin">Vendor GSTIN</Label>
                  <ConfidenceBadge field="vendor_gstin" />
                </div>
                <EditedBadge field="vendor_gstin" />
              </div>
              <Input
                id="vendor_gstin"
                value={form.vendor_gstin || ""}
                onChange={(e) => updateField("vendor_gstin", e.target.value)}
                className={isLowConfidence("vendor_gstin") ? "ring-2 ring-amber-300 border-amber-300 uppercase" : "uppercase"}
                placeholder="e.g. 29ABCDE1234F2Z5"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-1.5">
              <Label htmlFor="notes">Notes / Remarks</Label>
            </div>
            <Textarea
              id="notes"
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              rows={2}
              placeholder="Any additional notes…"
            />
          </div>
        </CardContent>
      </Card>

      {/* GST Configuration */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-base font-medium mb-4">GST Configuration</h3>
          <Label>GST Type</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Select how GST should be calculated for this bill
          </p>
          <RadioGroup
            value={gstType}
            onValueChange={(value: string) => updateField('gst_type', value as GSTType)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={GST_TYPES.CGST_SGST} id="review-cgst_sgst" />
              <Label htmlFor="review-cgst_sgst" className="font-normal cursor-pointer">
                CGST + SGST (Intra-state)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={GST_TYPES.IGST} id="review-igst" />
              <Label htmlFor="review-igst" className="font-normal cursor-pointer">
                IGST (Inter-state)
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-base font-medium mb-4">Line Items *</h3>

          <div className="space-y-4">
            {form.line_items.map((item, idx) => (
              <Card key={idx} className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Item {idx + 1}</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLineItem(idx)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-3">
                      <div>
                        <Label>SKU</Label>
                        <Input
                          placeholder="SKU"
                          value={item.sku || ""}
                          onChange={(e) => updateLineItem(idx, 'sku', e.target.value)}
                        />
                      </div>
                      <div className="col-span-3">
                        <Label>Description *</Label>
                        <Input
                          placeholder="Item description"
                          value={item.description}
                          onChange={(e) => updateLineItem(idx, 'description', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                      <div>
                        <Label>Quantity *</Label>
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(idx, 'quantity', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>Rate *</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => updateLineItem(idx, 'rate', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>Amount</Label>
                        <Input
                          type="number"
                          value={item.amount.toFixed(2)}
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                      <div>
                        <Label>GST Rate % *</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.gst_rate}
                          onChange={(e) => updateLineItem(idx, 'gst_rate', Number(e.target.value))}
                          placeholder="e.g. 18"
                        />
                      </div>
                      <div>
                        <Label>GST Amount</Label>
                        <Input
                          type="number"
                          value={(item.gst_amount ?? 0).toFixed(2)}
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={addLineItem}
            className="w-full mt-4"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Line Item
          </Button>
        </CardContent>
      </Card>

      {/* Bill Summary */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-base font-medium mb-4">Bill Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-medium">₹ {computedSubtotal.toFixed(2)}</span>
            </div>

            {/* GST Breakdown */}
            {gstType === GST_TYPES.CGST_SGST ? (
              <>
                {Object.entries(getGstBreakdown()).map(([rate, data]) => (
                  <div key={rate} className="text-sm space-y-1">
                    <div className="flex justify-between text-muted-foreground">
                      <span>CGST @ {Number(rate)}% (on ₹{data.amount.toFixed(2)})</span>
                      <span>₹ {(data.gst / 2).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>SGST @ {Number(rate)}% (on ₹{data.amount.toFixed(2)})</span>
                      <span>₹ {(data.gst / 2).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-medium">
                  <span>Total CGST</span>
                  <span>₹ {cgstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span>Total SGST</span>
                  <span>₹ {sgstAmount.toFixed(2)}</span>
                </div>
              </>
            ) : (
              <>
                {Object.entries(getGstBreakdown()).map(([rate, data]) => (
                  <div key={rate} className="flex justify-between text-sm text-muted-foreground">
                    <span>IGST @ {rate}% (on ₹{data.amount.toFixed(2)})</span>
                    <span>₹ {data.gst.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-medium">
                  <span>Total IGST</span>
                  <span>₹ {igstAmount.toFixed(2)}</span>
                </div>
              </>
            )}

            <Separator />

            <div className="flex justify-between text-sm font-medium">
              <span>Gross Amount (Subtotal + GST)</span>
              <span>₹ {grossAmount.toFixed(2)}</span>
            </div>

            <Separator />

            {/* Discount */}
            <div className="flex items-center gap-2 text-sm">
              <span className="flex-1">Discount</span>
              <Select
                value={form.discount_type === 'PERCENTAGE' ? 'percentage' : 'amount'}
                onValueChange={(value) =>
                  updateField('discount_type', value === 'percentage' ? 'PERCENTAGE' : 'FLAT')
                }
              >
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">%</SelectItem>
                  <SelectItem value="amount">₹</SelectItem>
                </SelectContent>
              </Select>
              <Input
                className="w-24 text-right"
                type="number"
                min="0"
                step={form.discount_type === 'PERCENTAGE' ? '1' : '0.01'}
                value={form.discount}
                onChange={(e) => updateField('discount', Number(e.target.value))}
              />
              <span className="w-24 text-right font-medium">₹ {discountAmount.toFixed(2)}</span>
            </div>

            <Separator />

            {/* Net Amount */}
            <div className="flex justify-between text-sm font-medium">
              <span>Net Amount (Gross - Discount)</span>
              <span>₹ {netAmount.toFixed(2)}</span>
            </div>

            {/* Shipping */}
            <div className="flex items-center gap-2 text-sm">
              <span className="flex-1 text-muted-foreground">Shipping</span>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">₹</span>
                <Input
                  className="w-28 text-right"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.shipping ?? 0}
                  onChange={(e) => updateField('shipping', Number(e.target.value))}
                />
              </div>
            </div>

            {/* Round Off */}
            {form.round_off && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="review-roundOff"
                    checked={form.round_off}
                    onChange={(e) => updateField('round_off', e.target.checked as any)}
                    className="rounded"
                  />
                  <Label htmlFor="review-roundOff" className="font-normal cursor-pointer">
                    Round off adjustment
                  </Label>
                </div>
                <span className="font-medium">
                  {(roundOffAmount >= 0 ? '+' : '') + roundOffAmount.toFixed(2)}
                </span>
              </div>
            )}

            {!form.round_off && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  id="review-roundOff"
                  checked={form.round_off ?? false}
                  onChange={(e) => updateField('round_off', e.target.checked as any)}
                  className="rounded"
                />
                <Label htmlFor="review-roundOff" className="font-normal cursor-pointer">
                  Apply round off
                </Label>
              </div>
            )}

            <Separator />

            {/* Final Payable Amount */}
            <div className="flex justify-between font-semibold text-lg">
              <span>Final Payable Amount</span>
              <span>₹ {finalPayableAmount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full h-12 text-base font-medium"
        size="lg"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Validating…
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Validate & Submit
          </span>
        )}
      </Button>


    </div>
  );
};

export default InvoiceReviewForm;
