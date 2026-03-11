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
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

/** The editable payload returned by the extraction worker */
export interface DraftData {
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
  doc_type: VoucherDocType;
  line_items: DraftLineItem[];
}

/** Response from GET /v1/vouchers/:document_id/draft */
export interface VoucherDraftResponse {
  document_id: string;
  status: VoucherDocumentStatus;
  doc_type: VoucherDocType;
  draft_data: DraftData;
  processed_by: string;
}

/** Request body for POST /v1/vouchers/:document_id/validate */
export interface VoucherValidateRequest {
  draft_data: DraftData;
}
