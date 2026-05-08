/**
 * Types for the voucher document extraction & HITL review flow.
 *
 * These map 1:1 to the Go backend API contracts for:
 *   GET  /v1/vouchers/:document_id/status
 *   GET  /v1/vouchers/:document_id/draft
 *   POST /v1/vouchers/:document_id/validate
 */

export type VoucherDocumentStatus =
  | 'QUEUED'
  | 'OCR_PROCESSING'
  | 'PENDING_LLM'
  | 'LLM_PROCESSING'
  | 'REVIEW_REQUIRED'
  | 'VALIDATED'
  | 'FAILED';

export type VoucherDocType = 'INVOICE' | 'PURCHASE_ORDER';

/** Response from GET /v1/vouchers/:document_id/status */
export interface VoucherStatusResponse {
  status: VoucherDocumentStatus;
}

/** A single line item inside the extracted draft */
export interface DraftLineItem {
  sku?: string;
  description: string;
  quantity: number;
  qty_received?: number;
  rate: number;
  amount: number;
  gst_rate?: number;
  gst_amount?: number;
}

/** The editable payload returned by the extraction worker */
export interface DraftData {
  vendor_name: string;
  vendor_gstin?: string;
  buyer_gstin?: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  currency: string;
  subtotal: number;
  tax_amount: number;
  discount: number;
  discount_type: 'FLAT' | 'PERCENTAGE';
  total_amount: number;
  net_amount?: number;
  po_number?: string;
  notes: string;
  doc_type: VoucherDocType;
  line_items: DraftLineItem[];
  sgst?: number;
  cgst?: number;
  igst?: number;
  gst_type?: 'cgst_sgst' | 'igst';
  shipping?: number;
  round_off?: boolean;
  round_off_amount?: number;
  payee_id?: string | null;
  confidence_scores?: Record<string, number>;
  /** Optional single document-level GST rate (%) used when line items lack individual rates */
  gst_rate?: number;
}

/** Payee resolution hint returned alongside the draft */
export interface PayeeResolutionHint {
  payee_id: string | null;
  status: 'VERIFIED' | 'NOT_FOUND';
  confidence: 'HIGH' | 'LOW';
  matched_via?: 'gstin' | 'name_fuzzy';
  suggested_data?: {
    legal_name?: string;
    gst_status?: string;
    vendor_gstin?: string;
  };
}

/** Business resolution hint returned alongside the draft */
export interface BusinessResolutionHint {
  business_id: string | null;
  resolved_via: 'header' | 'gstin_match' | 'unresolved';
}

/** Inner data object from GET /v1/vouchers/:document_id/draft */
export interface VoucherDraftData {
  document_id: string;
  doc_type: VoucherDocType;
  document_status: VoucherDocumentStatus;
  draft_data: DraftData;
  validated_data: DraftData | null;
  processed_by: string;
  payee_resolution?: PayeeResolutionHint;
  business_resolution?: BusinessResolutionHint;
}

/** Response from GET /v1/vouchers/:document_id/draft */
export interface VoucherDraftResponse {
  status: 'success' | 'error';
  data: VoucherDraftData;
}

/** Response from GET /v1/vouchers/:document_id/status */
export interface VoucherStatusDataResponse {
  status: 'success' | 'error';
  data: {
    document_status: VoucherDocumentStatus;
  };
}

/** Request body for POST /v1/vouchers/:document_id/validate */
export interface VoucherValidateRequest {
  draft_data: DraftData;
}

/** Response from POST /v1/vouchers/:document_id/upload */
export interface VoucherUploadResponse {
  status: 'success' | 'error';
  data: {
    document_id: string;
    s3_path: string;
    status: VoucherDocumentStatus;
    message?: string;
    is_duplicate?: boolean;
  };
}

/** Response from GET /v1/vouchers/:document_id/url (presigned) */
export interface VoucherDocumentUrlResponse {
  status: 'success' | 'error';
  data: {
    url: string;
    expires_in_seconds?: number;
  };
}

/** Response from POST /v1/payees/vendors/quick-create */
export interface QuickCreateVendorResponse {
  status: 'success' | 'error';
  data: {
    payee_id: string;
    business_id: string;
    account_id?: string | null;
    gstin?: string;
    legal_name?: string;
  };
}

/** Row in the documents list returned by GET /v1/vouchers/documents */
export interface VoucherDocumentListItem {
  id: string;
  file_name?: string;
  s3_path?: string;
  status: VoucherDocumentStatus;
  uploaded_at: string;
  doc_type?: VoucherDocType | null;
}
