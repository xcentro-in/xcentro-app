import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CheckCircle2,
  Pencil,
  AlertTriangle,
  Info,
  Plus,
  X,
  Send,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

export interface ExtractedLineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface ExtractedData {
  vendor_name: string;
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
  doc_type?: 'INVOICE' | 'PURCHASE_ORDER';
  line_items: ExtractedLineItem[];
}

interface InvoiceReviewFormProps {
  data: ExtractedData;
  onSubmit: (corrected: ExtractedData) => void;
  isSubmitting: boolean;
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
}: InvoiceReviewFormProps) => {
  const [form, setForm] = useState<ExtractedData>({ ...data });
  const [editedFields, setEditedFields] = useState<Set<string>>(new Set());

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

      // Recalculate amount when quantity or rate changes
      if (field === "quantity" || field === "rate") {
        item.amount = Number(item.quantity) * Number(item.rate);
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
        { description: "", quantity: 1, rate: 0, amount: 0 },
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

  const computedSubtotal = form.line_items.reduce(
    (sum, li) => sum + Number(li.amount),
    0
  );

  const discountAmount = form.discount_type === 'PERCENTAGE' 
    ? (computedSubtotal * Number(form.discount)) / 100 
    : Number(form.discount);

  const computedTotal = computedSubtotal - discountAmount + Number(form.tax_amount);

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

  /* ---- Render helpers ---- */



  const handleSubmit = () => {
    const corrected: ExtractedData = {
      ...form,
      subtotal: computedSubtotal,
      total_amount: computedTotal,
    };
    onSubmit(corrected);
  };

  return (
    <div className="space-y-6">
      {/* Header with summary */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">Review Extracted Data</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Verify the fields below and correct anything that looks off.
                Confidence scores indicate how certain the extraction was.
              </p>
            </div>
            <Badge
              variant="outline"
              className="shrink-0 text-amber-600 border-amber-300 bg-amber-50"
            >
              Pending Review
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Vendor & invoice header fields */}
      <Card>
        <CardContent className="p-6">
          <h4 className="text-base font-medium mb-4">Invoice Details</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Vendor name */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="vendor_name">Vendor / Supplier</Label>
                <EditedBadge field="vendor_name" />
              </div>
              <Input
                id="vendor_name"
                value={form.vendor_name}
                onChange={(e) => updateField("vendor_name", e.target.value)}
              />
            </div>

            {/* Invoice number */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="invoice_number">Invoice Number</Label>
                <EditedBadge field="invoice_number" />
              </div>
              <Input
                id="invoice_number"
                value={form.invoice_number}
                onChange={(e) => updateField("invoice_number", e.target.value)}
              />
            </div>

            {/* Invoice date */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="invoice_date">Invoice Date</Label>
                <EditedBadge field="invoice_date" />
              </div>
              <Input
                id="invoice_date"
                type="date"
                value={form.invoice_date}
                onChange={(e) => updateField("invoice_date", e.target.value)}
              />
            </div>

            {/* Due date */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="due_date">Due Date</Label>
                <EditedBadge field="due_date" />
              </div>
              <Input
                id="due_date"
                type="date"
                value={form.due_date}
                onChange={(e) => updateField("due_date", e.target.value)}
              />
            </div>

            {/* Currency */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="currency">Currency</Label>
                <EditedBadge field="currency" />
              </div>
              <Input
                id="currency"
                value={form.currency}
                onChange={(e) => updateField("currency", e.target.value)}
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

      {/* Line items */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-medium">Line Items</h4>
            <Button variant="outline" size="sm" onClick={addLineItem}>
              <Plus className="h-4 w-4 mr-1" /> Add Item
            </Button>
          </div>

          {form.line_items.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No line items extracted. Click "Add Item" to add one manually.
            </p>
          ) : (
            <div className="space-y-4">
              {form.line_items.map((item, idx) => (
                <Card key={idx} className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h5 className="font-medium text-sm">Item {idx + 1}</h5>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => removeLineItem(idx)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs">Description</Label>
                        <Input
                          value={item.description}
                          onChange={(e) =>
                            updateLineItem(idx, "description", e.target.value)
                          }
                          placeholder="Item description"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label className="text-xs">Qty</Label>
                          <Input
                            type="number"
                            min={0}
                            step={1}
                            value={item.quantity}
                            onChange={(e) =>
                              updateLineItem(idx, "quantity", Number(e.target.value))
                            }
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Rate</Label>
                          <Input
                            type="number"
                            min={0}
                            step={0.01}
                            value={item.rate}
                            onChange={(e) =>
                              updateLineItem(idx, "rate", Number(e.target.value))
                            }
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Amount</Label>
                          <Input
                            type="number"
                            value={item.amount.toFixed(2)}
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
          )}
        </CardContent>
      </Card>

      {/* Financial summary */}
      <Card>
        <CardContent className="p-6">
          <h4 className="text-base font-medium mb-4">Totals</h4>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium tabular-nums">
                {form.currency} {computedSubtotal.toFixed(2)}
              </span>
            </div>

            {/* Discount */}
            <div className="flex justify-between text-sm items-center">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Discount</span>
                <EditedBadge field="discount" />
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex rounded-md border text-sm overflow-hidden h-8">
                  <button
                    className={`px-2.5 ${form.discount_type === 'FLAT' ? 'bg-primary text-primary-foreground font-medium' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                    onClick={() => updateField('discount_type', 'FLAT')}
                  >
                    {form.currency}
                  </button>
                  <button
                    className={`px-2.5 ${form.discount_type === 'PERCENTAGE' ? 'bg-primary text-primary-foreground font-medium' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                    onClick={() => updateField('discount_type', 'PERCENTAGE')}
                  >
                    %
                  </button>
                </div>
                <Input
                  type="number"
                  min={0}
                  step={form.discount_type === 'PERCENTAGE' ? 1 : 0.01}
                  value={form.discount}
                  onChange={(e) =>
                    updateField("discount", Number(e.target.value))
                  }
                  className="w-32 text-right h-8"
                />
              </div>
            </div>

            {/* Tax */}
            <div className="flex justify-between text-sm items-center">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Tax / GST</span>
                <EditedBadge field="tax_amount" />
              </div>
              <Input
                type="number"
                min={0}
                step={0.01}
                value={form.tax_amount}
                onChange={(e) =>
                  updateField("tax_amount", Number(e.target.value))
                }
                className="w-32 text-right h-8"
              />
            </div>

            <Separator />

            <div className="flex justify-between text-base font-semibold">
              <span>Total Amount</span>
              <span className="tabular-nums">
                {form.currency} {computedTotal.toFixed(2)}
              </span>
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
