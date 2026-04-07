import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import InvoiceReviewForm from "./InvoiceReviewForm";
import PurchaseOrderReviewForm from "./PurchaseOrderReviewForm";
import { type ExtractedData, type PayeeResolution, type BusinessResolution } from "./InvoiceReviewForm";

interface ExtractionReviewContainerProps {
  data: ExtractedData;
  onSubmit: (corrected: ExtractedData) => void;
  isSubmitting: boolean;
  payeeResolution?: PayeeResolution | null;
  businessResolution?: BusinessResolution | null;
  businessId?: string;
}

const ExtractionReviewContainer = ({
  data,
  onSubmit,
  isSubmitting,
  payeeResolution,
  businessResolution,
  businessId,
}: ExtractionReviewContainerProps) => {
  const [docType, setDocType] = useState<"INVOICE" | "PURCHASE_ORDER">(
    data.doc_type === "PURCHASE_ORDER" ? "PURCHASE_ORDER" : "INVOICE"
  );

  const handleSubmit = (corrected: ExtractedData) => {
    // Append doc_type to the data before submitting
    onSubmit({
      ...corrected,
      doc_type: docType,
    } as ExtractedData);
  };

  return (
    <div className="space-y-6">
      {/* Document Type Selector */}
      <Card>
        <CardContent className="p-6">
          <Label className="text-base font-medium">Select Document Type</Label>
          <p className="text-sm text-muted-foreground mb-4">
            Identify if this is an Invoice or a Purchase Order to render the correct form.
          </p>
          <RadioGroup
            value={docType}
            onValueChange={(val) => setDocType(val as "INVOICE" | "PURCHASE_ORDER")}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="INVOICE" id="review-type-invoice" />
              <Label htmlFor="review-type-invoice" className="font-normal cursor-pointer">
                Invoice
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="PURCHASE_ORDER" id="review-type-po" />
              <Label htmlFor="review-type-po" className="font-normal cursor-pointer">
                Purchase Order
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Conditional Forms */}
      {docType === "INVOICE" ? (
        <InvoiceReviewForm
          data={data}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          payeeResolution={payeeResolution}
          businessResolution={businessResolution}
          businessId={businessId}
        />
      ) : (
        <PurchaseOrderReviewForm
          data={data}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          payeeResolution={payeeResolution}
          businessResolution={businessResolution}
          businessId={businessId}
        />
      )}
    </div>
  );
};

export default ExtractionReviewContainer;
