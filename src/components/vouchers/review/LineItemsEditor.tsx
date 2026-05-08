import { memo, useCallback, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import type { ExtractedLineItem } from "@/components/vouchers/InvoiceReviewForm";

interface LineItemRowProps {
  idx: number;
  item: ExtractedLineItem;
  onUpdate: (idx: number, field: keyof ExtractedLineItem, value: string | number) => void;
  onRemove: (idx: number) => void;
  firstInputRef?: React.Ref<HTMLInputElement>;
}

const LineItemRow = memo(({ idx, item, onUpdate, onRemove, firstInputRef }: LineItemRowProps) => {
  const handleRemove = useCallback(() => onRemove(idx), [idx, onRemove]);

  return (
    <Card className="bg-muted/30">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium">Item {idx + 1}</h4>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            aria-label={`Remove item ${idx + 1}`}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-3">
            <div>
              <Label>SKU</Label>
              <Input
                ref={firstInputRef}
                placeholder="SKU"
                value={item.sku || ""}
                onChange={(e) => onUpdate(idx, "sku", e.target.value)}
              />
            </div>
            <div className="col-span-3">
              <Label>Description *</Label>
              <Input
                placeholder="Item description"
                value={item.description}
                onChange={(e) => onUpdate(idx, "description", e.target.value)}
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
                onChange={(e) => onUpdate(idx, "quantity", Number(e.target.value))}
              />
            </div>
            <div>
              <Label>Rate *</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={item.rate}
                onChange={(e) => onUpdate(idx, "rate", Number(e.target.value))}
              />
            </div>
            <div>
              <Label>Amount</Label>
              <Input type="number" value={item.amount.toFixed(2)} readOnly className="bg-muted" />
            </div>
            <div>
              <Label>GST Rate %</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={item.gst_rate}
                onChange={(e) => onUpdate(idx, "gst_rate", Number(e.target.value))}
                placeholder="e.g. 18"
                className={item.gst_amount_overridden ? "opacity-40" : ""}
              />
            </div>
            <div>
              <Label>GST Amount</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={(item.gst_amount ?? 0).toFixed(2)}
                onChange={(e) => onUpdate(idx, "gst_amount", Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
LineItemRow.displayName = "LineItemRow";

interface LineItemsEditorProps {
  items: ExtractedLineItem[];
  onUpdate: (idx: number, field: keyof ExtractedLineItem, value: string | number) => void;
  onAdd: () => void;
  onRemove: (idx: number) => void;
  title?: string;
}

const LineItemsEditor = ({
  items,
  onUpdate,
  onAdd,
  onRemove,
  title = "Line Items *",
}: LineItemsEditorProps) => {
  const prevLen = useRef(items.length);
  const newRowRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (items.length > prevLen.current && newRowRef.current) {
      newRowRef.current.focus();
    }
    prevLen.current = items.length;
  }, [items.length]);

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-base font-medium mb-4">{title}</h3>
        <div className="space-y-4">
          {items.map((item, idx) => (
            <LineItemRow
              key={idx}
              idx={idx}
              item={item}
              onUpdate={onUpdate}
              onRemove={onRemove}
              firstInputRef={idx === items.length - 1 ? newRowRef : undefined}
            />
          ))}
        </div>
        <Button variant="outline" onClick={onAdd} className="w-full mt-4">
          <Plus className="h-4 w-4 mr-2" />
          Add Line Item
        </Button>
      </CardContent>
    </Card>
  );
};

export default LineItemsEditor;
