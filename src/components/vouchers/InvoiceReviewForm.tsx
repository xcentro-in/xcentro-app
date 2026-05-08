import { useState, useEffect } from "react";
import { GST_TYPES, type GSTType } from "@/constants/gstRates";
import AddPayeeResolutionDialog from "@/components/vouchers/AddPayeeResolutionDialog";
import { useVendors } from "@/hooks/useVendors";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";
import { useBusiness } from "@/contexts/BusinessContext";
import { validateVoucherDraft } from "@/schemas/voucher-draft";
import { toast } from "sonner";

import { useDraftFormState } from "@/components/vouchers/review/useDraftFormState";
import LowConfidenceAlert from "@/components/vouchers/review/LowConfidenceAlert";
import VendorCard from "@/components/vouchers/review/VendorCard";
import DocumentMetadata from "@/components/vouchers/review/DocumentMetadata";
import GSTConfiguration from "@/components/vouchers/review/GSTConfiguration";
import LineItemsEditor from "@/components/vouchers/review/LineItemsEditor";
import BillSummary from "@/components/vouchers/review/BillSummary";
import SubmitBar from "@/components/vouchers/review/SubmitBar";

/* ------------------------------------------------------------------ */
/*  Shared types — consumed by PurchaseOrderReviewForm too            */
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
  gst_amount_overridden?: boolean;
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
  isAlreadyValidated?: boolean;
}

const InvoiceReviewForm = ({
  data,
  onSubmit,
  isSubmitting,
  payeeResolution: initialPayeeResolution,
  businessId,
  isAlreadyValidated = false,
}: InvoiceReviewFormProps) => {
  const { businessId: currentBusinessId } = useCurrentBusiness();
  const { selectedBusiness } = useBusiness();
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

  useEffect(() => {
    if (!payeeResolution?.payee_id || selectedVendorRelationId || vendors.length === 0) return;
    const matched = vendors.find((v) => v.payee_id === payeeResolution.payee_id);
    if (matched) {
      setSelectedVendorRelationId(matched.relation_id);
      setForm((prev) => ({ ...prev, vendor_name: matched.display_name }));
    }
  }, [payeeResolution?.payee_id, vendors]);

  const vendorFoundByGstin = !!(
    form.vendor_gstin &&
    vendors.some(
      (v) => v.gstin && v.gstin.toUpperCase() === form.vendor_gstin!.toUpperCase(),
    )
  );

  const buyerFoundByGstin = !!(
    form.buyer_gstin &&
    selectedBusiness?.gstin &&
    form.buyer_gstin.toUpperCase() === selectedBusiness.gstin.toUpperCase()
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

    const docTypeForValidation: 'INVOICE' | 'PURCHASE_ORDER' =
      corrected.doc_type === 'PURCHASE_ORDER' ? 'PURCHASE_ORDER' : 'INVOICE';
    const result = validateVoucherDraft({ ...corrected, doc_type: docTypeForValidation });
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
        onSelectVendor={handleSelectVendor}
        onVendorGstinChange={(v) => updateField("vendor_gstin", v)}
        onBuyerGstinChange={(v) => updateField("buyer_gstin", v)}
        buyerFoundByGstin={buyerFoundByGstin}
        matchedBusinessName={selectedBusiness?.name}
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
        variant="INVOICE"
        form={form}
        editedFields={editedFields}
        confidenceScores={form.confidence_scores}
        isLowConfidence={isLowConfidence}
        updateField={updateField}
      />

      <GSTConfiguration
        value={computed.gstType}
        onChange={(v) => updateField("gst_type", v)}
        idPrefix="review"
        description="Select how GST should be calculated for this bill"
      />

      <LineItemsEditor
        items={form.line_items}
        onUpdate={updateLineItem}
        onAdd={addLineItem}
        onRemove={removeLineItem}
      />

      <BillSummary
        title="Bill Summary"
        form={form}
        computed={computed}
        updateField={updateField}
        idPrefix="review"
      />

      <SubmitBar
        isSubmitting={isSubmitting}
        isAlreadyValidated={isAlreadyValidated}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default InvoiceReviewForm;
