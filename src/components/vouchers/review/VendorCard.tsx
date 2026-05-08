import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";
import type { PayeeResolution } from "@/components/vouchers/InvoiceReviewForm";
import { ConfidenceBadge, EditedBadge } from "./FieldBadges";

interface VendorOption {
  relation_id: string;
  display_name: string;
  gstin?: string;
}

interface VendorCardProps {
  vendorName: string;
  vendorGstin?: string;
  buyerGstin?: string;
  confidenceScores?: Record<string, number>;
  editedFields: Set<string>;
  payeeResolution?: PayeeResolution | null;
  vendors: VendorOption[];
  selectedVendorRelationId: string;
  vendorFoundByGstin: boolean;
  headingLabel?: string;
  buyerFoundByGstin: boolean;
  matchedBusinessName?: string;
  onSelectVendor: (relationId: string, displayName: string) => void;
  onVendorGstinChange: (value: string) => void;
  onBuyerGstinChange: (value: string) => void;
  onRequestAddVendor: () => void;
  isLowConfidence: (field: string) => boolean;
}

const VendorCard = ({
  vendorName,
  vendorGstin,
  buyerGstin,
  confidenceScores,
  editedFields,
  payeeResolution,
  vendors,
  selectedVendorRelationId,
  vendorFoundByGstin,
  headingLabel = "Vendor / Supplier",
  buyerFoundByGstin,
  matchedBusinessName,
  onSelectVendor,
  onVendorGstinChange,
  onBuyerGstinChange,
  onRequestAddVendor,
  isLowConfidence,
}: VendorCardProps) => {
  const [showVendorSelect, setShowVendorSelect] = useState(false);

  const effectiveRelationId =
    selectedVendorRelationId ||
    (vendorFoundByGstin && vendorGstin
      ? (vendors.find((v) => v.gstin && v.gstin.toUpperCase() === vendorGstin.toUpperCase())?.relation_id ?? "")
      : "");

  const linkedVendor = effectiveRelationId
    ? vendors.find((v) => v.relation_id === effectiveRelationId)
    : null;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <Label className="text-base font-medium">{headingLabel}</Label>
            <ConfidenceBadge field="vendor_name" confidenceScores={confidenceScores} />
          </div>
          <div className="flex items-center gap-1.5">
            <EditedBadge field="vendor_name" editedFields={editedFields} />
            {payeeResolution?.status === "VERIFIED" && (
              <Badge
                variant="outline"
                className="text-[10px] gap-0.5 px-1.5 py-0 bg-green-50 text-green-600 border-green-200"
              >
                <ShieldCheck className="h-2.5 w-2.5" /> Verified Vendor
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-1 mb-4">
          <p className="text-lg font-semibold">
            {vendorName || <span className="text-muted-foreground italic">Not extracted</span>}
          </p>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Label htmlFor="vendor_gstin">Vendor GSTIN</Label>
              <ConfidenceBadge field="vendor_gstin" confidenceScores={confidenceScores} />
            </div>
            <EditedBadge field="vendor_gstin" editedFields={editedFields} />
          </div>
          <Input
            id="vendor_gstin"
            value={vendorGstin || ""}
            onChange={(e) => onVendorGstinChange(e.target.value)}
            className={isLowConfidence("vendor_gstin") ? "ring-2 ring-amber-300 border-amber-300 uppercase" : "uppercase"}
            placeholder="e.g. 29ABCDE1234F2Z5"
          />
        </div>

        {linkedVendor && !showVendorSelect ? (
          <div className="flex items-center gap-1.5 mb-4 text-sm text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
            <span>Matched to <span className="font-medium text-foreground">{linkedVendor.display_name}</span></span>
            <button
              type="button"
              className="ml-auto text-xs underline hover:text-foreground"
              onClick={() => setShowVendorSelect(true)}
            >
              Change
            </button>
          </div>
        ) : vendors.length > 0 && (
          <div className="mb-4">
            <Select
              value={effectiveRelationId}
              onValueChange={(val) => {
                const v = vendors.find((x) => x.relation_id === val);
                if (v) { onSelectVendor(val, v.display_name); setShowVendorSelect(false); }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Link to existing vendor…" />
              </SelectTrigger>
              <SelectContent>
                {vendors.map((v) => (
                  <SelectItem key={v.relation_id} value={v.relation_id}>
                    {v.display_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {payeeResolution?.status === "NOT_FOUND" &&
          !selectedVendorRelationId &&
          !vendorFoundByGstin && (
            <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-amber-700 font-medium">
                    Vendor not found in your directory.
                  </p>
                  {(payeeResolution.suggested_data?.vendor_name ||
                    payeeResolution.suggested_data?.vendor_gstin) && (
                    <p className="text-xs text-amber-600 mt-0.5">
                      Extracted:{" "}
                      {payeeResolution.suggested_data?.vendor_name && (
                        <span className="font-medium">
                          {payeeResolution.suggested_data.vendor_name}
                        </span>
                      )}
                      {payeeResolution.suggested_data?.vendor_gstin && (
                        <span className="font-mono ml-1">
                          ({payeeResolution.suggested_data.vendor_gstin})
                        </span>
                      )}
                    </p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 text-amber-700 border-amber-300 hover:bg-amber-100 h-7 text-xs"
                  onClick={onRequestAddVendor}
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
              <ConfidenceBadge field="buyer_gstin" confidenceScores={confidenceScores} />
            </div>
            <EditedBadge field="buyer_gstin" editedFields={editedFields} />
          </div>
          <Input
            id="buyer_gstin"
            value={buyerGstin || ""}
            onChange={(e) => onBuyerGstinChange(e.target.value)}
            className={
              isLowConfidence("buyer_gstin")
                ? "ring-2 ring-amber-300 border-amber-300 uppercase"
                : "uppercase"
            }
            placeholder="e.g. 29ABCDE1234F2Z5"
          />
          {buyerFoundByGstin && matchedBusinessName && (
            <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
              <span>Matched to <span className="font-medium text-foreground">{matchedBusinessName}</span></span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorCard;
