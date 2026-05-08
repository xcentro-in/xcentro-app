import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ExtractedData } from "@/components/vouchers/InvoiceReviewForm";
import { ConfidenceBadge, EditedBadge } from "./FieldBadges";

type Variant = "INVOICE" | "PURCHASE_ORDER";

interface DocumentMetadataProps {
  variant: Variant;
  form: ExtractedData;
  editedFields: Set<string>;
  confidenceScores?: Record<string, number>;
  isLowConfidence: (field: string) => boolean;
  updateField: <K extends keyof ExtractedData>(key: K, value: ExtractedData[K]) => void;
}

const inputClass = (low: boolean, extra = "") =>
  `${low ? "ring-2 ring-amber-300 border-amber-300 " : ""}${extra}`.trim();

interface FieldProps {
  id: string;
  label: string;
  field: string;
  editedFields: Set<string>;
  confidenceScores?: Record<string, number>;
  children: React.ReactNode;
}

const Field = ({ id, label, field, editedFields, confidenceScores, children }: FieldProps) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <div className="flex items-center gap-1.5">
        <Label htmlFor={id}>{label}</Label>
        <ConfidenceBadge field={field} confidenceScores={confidenceScores} />
      </div>
      <EditedBadge field={field} editedFields={editedFields} />
    </div>
    {children}
  </div>
);

const DocumentMetadata = ({
  variant,
  form,
  editedFields,
  confidenceScores,
  isLowConfidence,
  updateField,
}: DocumentMetadataProps) => {
  const isPO = variant === "PURCHASE_ORDER";

  return (
    <Card>
      <CardContent className="p-6">
        <h4 className="text-base font-medium mb-4">{isPO ? "PO Details" : "Invoice Details"}</h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {!isPO && (
            <Field
              id="invoice_number"
              label="Invoice Number"
              field="invoice_number"
              editedFields={editedFields}
              confidenceScores={confidenceScores}
            >
              <Input
                id="invoice_number"
                value={form.invoice_number}
                onChange={(e) => updateField("invoice_number", e.target.value)}
                className={inputClass(isLowConfidence("invoice_number"))}
              />
            </Field>
          )}

          <Field
            id="po_number"
            label="PO Number"
            field="po_number"
            editedFields={editedFields}
            confidenceScores={confidenceScores}
          >
            <Input
              id="po_number"
              value={form.po_number || ""}
              onChange={(e) => updateField("po_number", e.target.value)}
              className={inputClass(isLowConfidence("po_number"))}
              placeholder={isPO ? undefined : "Optional"}
            />
          </Field>

          <Field
            id="invoice_date"
            label={isPO ? "PO Date" : "Invoice Date"}
            field="invoice_date"
            editedFields={editedFields}
            confidenceScores={confidenceScores}
          >
            <Input
              id="invoice_date"
              type="date"
              value={form.invoice_date}
              onChange={(e) => updateField("invoice_date", e.target.value)}
              className={inputClass(isLowConfidence("invoice_date"))}
            />
          </Field>

          {!isPO && (
            <Field
              id="due_date"
              label="Due Date"
              field="due_date"
              editedFields={editedFields}
              confidenceScores={confidenceScores}
            >
              <Input
                id="due_date"
                type="date"
                value={form.due_date}
                onChange={(e) => updateField("due_date", e.target.value)}
                className={inputClass(isLowConfidence("due_date"))}
              />
            </Field>
          )}

          <Field
            id="currency"
            label="Currency"
            field="currency"
            editedFields={editedFields}
            confidenceScores={confidenceScores}
          >
            <Input
              id="currency"
              value={form.currency}
              onChange={(e) => updateField("currency", e.target.value)}
              className={inputClass(isLowConfidence("currency"))}
            />
          </Field>

        </div>

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
  );
};

export default DocumentMetadata;
