import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GST_TYPES } from "@/constants/gstRates";
import type { ExtractedData } from "@/components/vouchers/InvoiceReviewForm";
import type { DraftFormComputed } from "./useDraftFormState";

interface BillSummaryProps {
  title?: string;
  form: ExtractedData;
  computed: DraftFormComputed;
  updateField: <K extends keyof ExtractedData>(key: K, value: ExtractedData[K]) => void;
  /** Prefix for the round-off checkbox id. */
  idPrefix?: string;
}

const BillSummary = ({
  title = "Bill Summary",
  form,
  computed,
  updateField,
  idPrefix = "review",
}: BillSummaryProps) => {
  const {
    gstType,
    computedSubtotal,
    cgstAmount,
    sgstAmount,
    igstAmount,
    grossAmount,
    discountAmount,
    netAmount,
    roundOffAmount,
    finalPayableAmount,
    gstBreakdown,
    useDocumentGst,
  } = computed;

  const roundOffId = `${idPrefix}-roundOff`;

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-base font-medium mb-4">{title}</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span className="font-medium">₹ {computedSubtotal.toFixed(2)}</span>
          </div>

          {gstType === GST_TYPES.CGST_SGST ? (
            <>
              {!useDocumentGst && Object.entries(gstBreakdown).map(([rate, data]) => (
                <div key={rate} className="text-sm space-y-1">
                  <div className="flex justify-between text-muted-foreground">
                    <span>
                      CGST @ {Number(rate)}% (on ₹{data.amount.toFixed(2)})
                    </span>
                    <span>₹ {(data.gst / 2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>
                      SGST @ {Number(rate)}% (on ₹{data.amount.toFixed(2)})
                    </span>
                    <span>₹ {(data.gst / 2).toFixed(2)}</span>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between text-sm font-medium">
                <span>Total CGST</span>
                {useDocumentGst ? (
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">₹</span>
                    <Input
                      className="w-32 text-right h-7 text-sm"
                      type="number"
                      min="0"
                      step="0.01"
                      value={(form.cgst ?? 0).toFixed(2)}
                      onChange={(e) => updateField("cgst", Number(e.target.value))}
                    />
                  </div>
                ) : (
                  <span>₹ {cgstAmount.toFixed(2)}</span>
                )}
              </div>
              <div className="flex items-center justify-between text-sm font-medium">
                <span>Total SGST</span>
                {useDocumentGst ? (
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">₹</span>
                    <Input
                      className="w-32 text-right h-7 text-sm"
                      type="number"
                      min="0"
                      step="0.01"
                      value={(form.sgst ?? 0).toFixed(2)}
                      onChange={(e) => updateField("sgst", Number(e.target.value))}
                    />
                  </div>
                ) : (
                  <span>₹ {sgstAmount.toFixed(2)}</span>
                )}
              </div>
            </>
          ) : (
            <>
              {!useDocumentGst && Object.entries(gstBreakdown).map(([rate, data]) => (
                <div
                  key={rate}
                  className="flex justify-between text-sm text-muted-foreground"
                >
                  <span>
                    IGST @ {rate}% (on ₹{data.amount.toFixed(2)})
                  </span>
                  <span>₹ {data.gst.toFixed(2)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between text-sm font-medium">
                <span>Total IGST</span>
                {useDocumentGst ? (
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">₹</span>
                    <Input
                      className="w-32 text-right h-7 text-sm"
                      type="number"
                      min="0"
                      step="0.01"
                      value={(form.igst ?? 0).toFixed(2)}
                      onChange={(e) => updateField("igst", Number(e.target.value))}
                    />
                  </div>
                ) : (
                  <span>₹ {igstAmount.toFixed(2)}</span>
                )}
              </div>
            </>
          )}

          <Separator />

          <div className="flex justify-between text-sm font-medium">
            <span>Gross Amount (Subtotal + GST)</span>
            <span>₹ {grossAmount.toFixed(2)}</span>
          </div>

          <Separator />

          <div className="flex items-center gap-2 text-sm">
            <span className="flex-1">Discount</span>
            <Select
              value={form.discount_type === "PERCENTAGE" ? "percentage" : "amount"}
              onValueChange={(value) =>
                updateField("discount_type", value === "percentage" ? "PERCENTAGE" : "FLAT")
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
              step={form.discount_type === "PERCENTAGE" ? "1" : "0.01"}
              value={form.discount}
              onChange={(e) => updateField("discount", Number(e.target.value))}
            />
            <span className="w-24 text-right font-medium">₹ {discountAmount.toFixed(2)}</span>
          </div>

          <Separator />

          <div className="flex justify-between text-sm font-medium">
            <span>Net Amount (Gross - Discount)</span>
            <span>₹ {netAmount.toFixed(2)}</span>
          </div>

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
                onChange={(e) => updateField("shipping", Number(e.target.value))}
              />
            </div>
          </div>

          {form.round_off ? (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={roundOffId}
                  checked={form.round_off}
                  onChange={(e) => updateField("round_off", e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor={roundOffId} className="font-normal cursor-pointer">
                  Round off adjustment
                </Label>
              </div>
              <span className="font-medium">
                {(roundOffAmount >= 0 ? "+" : "") + roundOffAmount.toFixed(2)}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                id={roundOffId}
                checked={form.round_off ?? false}
                onChange={(e) => updateField("round_off", e.target.checked)}
                className="rounded"
              />
              <Label htmlFor={roundOffId} className="font-normal cursor-pointer">
                Apply round off
              </Label>
            </div>
          )}

          <Separator />

          <div className="flex justify-between font-semibold text-lg">
            <span>Final Payable Amount</span>
            <span>₹ {finalPayableAmount.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BillSummary;
