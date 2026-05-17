import { useState } from "react";
import { GST_TYPES } from "@/constants/gstRates";
import AddPayeeResolutionDialog from "@/components/vouchers/AddPayeeResolutionDialog";
import { useVendors } from "@/hooks/useVendors";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";
import { validateVoucherDraft } from "@/schemas/voucher-draft";
import { toast } from "sonner";

import { ExtractedData, PayeeResolution, BusinessResolution } from "./InvoiceReviewForm";
import { useDraftFormState } from "@/components/vouchers/review/useDraftFormState";
import LowConfidenceAlert from "@/components/vouchers/review/LowConfidenceAlert";
import VendorCard from "@/components/vouchers/review/VendorCard";
import DocumentMetadata from "@/components/vouchers/review/DocumentMetadata";
import GSTConfiguration from "@/components/vouchers/review/GSTConfiguration";
import LineItemsEditor from "@/components/vouchers/review/LineItemsEditor";
import BillSummary from "@/components/vouchers/review/BillSummary";
import SubmitBar from "@/components/vouchers/review/SubmitBar";

interface PurchaseOrderReviewFormProps {
  data: ExtractedData;
  onSubmit: (corrected: ExtractedData) => void;
  isSubmitting: boolean;
  payeeResolution?: PayeeResolution | null;
  businessResolution?: BusinessResolution | null;
  businessId?: string;
  isAlreadyValidated?: boolean;
}

const PurchaseOrderReviewForm = ({
  data,
  onSubmit,
  isSubmitting,
  payeeResolution: initialPayeeResolution,
  businessId,
  isAlreadyValidated = false,
}: PurchaseOrderReviewFormProps) => {
  const { businessId: currentBusinessId } = useCurrentBusiness();
  const effectiveBusinessId = businessId || currentBusinessId;
  const { vendors, refetch: refetchVendors } = useVendors(effectiveBusinessId);

  const {
    form,
    setForm,
    editedFields,
    updateField,
    updateLineItem,
    addLineItem,
    removeLineItem,
    isLowConfidence,
    lowConfidenceFields,
    computed,
  } = useDraftFormState(data);

  const [payeeResolution, setPayeeResolution] = useState<PayeeResolution | null | undefined>(
    initialPayeeResolution,
  );
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [selectedVendorRelationId, setSelectedVendorRelationId] = useState("");

  const vendorFoundByGstin = !!(
    form.vendor_gstin &&
    vendors.some(
      (v) => v.gstin && v.gstin.toUpperCase() === form.vendor_gstin!.toUpperCase(),
    )
  );

  const handlePayeeCreated = async (payeeId: string, displayName: string, gstin?: string) => {
    setSelectedVendorRelationId(payeeId);
    setForm((prev) => ({
      ...prev,
      vendor_name: displayName,
      ...(gstin ? { vendor_gstin: gstin } : {}),
    }));
    setPayeeResolution({ payee_id: payeeId, status: "VERIFIED", confidence: "HIGH" });
    await refetchVendors();
  };

  const handleSelectVendor = (relationId: string, displayName: string) => {
    setSelectedVendorRelationId(relationId);
    setForm((prev) => ({ ...prev, vendor_name: displayName }));
  };

  const handleSubmit = () => {
    const {
      gstType,
      computedSubtotal,
      totalGst,
      cgstAmount,
      sgstAmount,
      igstAmount,
      shippingAmount,
      finalPayableAmount,
      roundOffAmount,
    } = computed;

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

    const result = validateVoucherDraft({ ...corrected, doc_type: "PURCHASE_ORDER" });
    if (!result.ok) {
      const first = result.errors[0];
      toast.error(first?.message ?? "Please fix the errors before submitting");
      return;
    }
    onSubmit(corrected);
  };

  return (
    <div className="space-y-6">
      <LowConfidenceAlert fields={lowConfidenceFields} />

      <VendorCard
        vendorName={form.vendor_name}
        vendorGstin={form.vendor_gstin}
        buyerGstin={form.buyer_gstin}
        confidenceScores={form.confidence_scores}
        editedFields={editedFields}
        payeeResolution={payeeResolution}
        vendors={vendors}
        selectedVendorRelationId={selectedVendorRelationId}
        vendorFoundByGstin={vendorFoundByGstin}
        headingLabel="Supplier (PO recipient)"
        onSelectVendor={handleSelectVendor}
        onBuyerGstinChange={(v) => updateField("buyer_gstin", v)}
        onRequestAddVendor={() => setShowAddVendor(true)}
        isLowConfidence={isLowConfidence}
      />

      <AddPayeeResolutionDialog
        open={showAddVendor}
        onOpenChange={setShowAddVendor}
        businessId={effectiveBusinessId}
        defaultVendorName={form.vendor_name || payeeResolution?.suggested_data?.vendor_name}
        defaultGstin={form.vendor_gstin || payeeResolution?.suggested_data?.vendor_gstin}
        onPayeeCreated={handlePayeeCreated}
      />

      <DocumentMetadata
        variant="PURCHASE_ORDER"
        form={form}
        editedFields={editedFields}
        confidenceScores={form.confidence_scores}
        isLowConfidence={isLowConfidence}
        updateField={updateField}
      />

      <GSTConfiguration
        value={computed.gstType}
        onChange={(v) => updateField("gst_type", v)}
        idPrefix="po"
        description="Select how GST should be calculated for this purchase order"
      />

      <LineItemsEditor
        items={form.line_items}
        onUpdate={updateLineItem}
        onAdd={addLineItem}
        onRemove={removeLineItem}
      />

      <BillSummary
        title="PO Summary"
        form={form}
        computed={computed}
        updateField={updateField}
        idPrefix="po"
      />

      <SubmitBar
        isSubmitting={isSubmitting}
        isAlreadyValidated={isAlreadyValidated}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default PurchaseOrderReviewForm;
