// API response types for GET /v1/vouchers/:voucherId

export interface VoucherDetailLineItemAPI {
  description: string;
  quantity: number;
  rate: number; // In paise
  amount: number; // In paise
  hsn_code?: string;
  tax_rate?: number;
}

export interface VoucherDetailPayeeAPI {
  relation_id: string;
  payee_id: string;
  name: string; // API uses 'name' not 'payee_name'
  gstin?: string;
  pan?: string;
  type?: string;
  address?: string;
  contact_email?: string;
  contact_phone?: string;
  bank_account_masked?: string;
  account_id?: string;
  ifsc_code?: string;
  bank_name?: string;
  account_type?: string;
}

export interface VoucherDetailApprovalAPI {
  approver_id: string;
  approver_name: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  approval_date?: string; // ISO 8601
  comments?: string;
  level: number;
}

export interface VoucherDetailPaymentAPI {
  payment_id?: string;
  payment_method?: string;
  payment_status: 'pending' | 'processing' | 'completed' | 'failed';
  payment_date?: string; // ISO 8601
  utr_number?: string;
  settlement_status?: string;
  transaction_reference?: string;
}

export interface VoucherDetailAccountingAPI {
  journal_entry_id?: string;
  ledger_account?: string;
  cost_center?: string;
  department?: string;
  erp_sync_status?: 'synced' | 'pending' | 'failed' | 'not_applicable';
  erp_reference_id?: string;
  erp_sync_date?: string; // ISO 8601
}

export interface VoucherDetailAttachmentAPI {
  attachment_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number; // In bytes
  uploaded_date: string; // ISO 8601
}

export interface VoucherDetailTimelineEventAPI {
  event_id: string;
  event_type: 'created' | 'updated' | 'submitted' | 'approved' | 'rejected' | 'paid' | 'reconciled';
  event_date: string; // ISO 8601
  user_id?: string;
  user_name?: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface VoucherDetailOCRDataAPI {
  overall_confidence: number; // 0-1
  field_confidences: {
    vendor_name?: number;
    invoice_number?: number;
    amount?: number;
    due_date?: number;
    bill_date?: number;
    gstin?: number;
    items?: number;
  };
  ocr_processed_date?: string; // ISO 8601
  ocr_validation_status?: 'validated' | 'pending' | 'failed';
}

export interface VoucherDetailResponseAPI {
  voucher_id: string;
  voucher_number: string;
  voucher_date?: string | null;
  fiscal_year?: string;
  accounting_period?: string;
  voucher_type?: string;
  invoice_number: string;
  invoice_date: string | null; // ISO 8601
  invoice_due_date: string | null; // ISO 8601

  // Payee information
  payee: VoucherDetailPayeeAPI;

  // Amounts (in paise)
  gross_amount: number;
  net_amount: number;
  currency?: string;
  gst_amount: number;
  tds_amount: number;
  cgst_amount?: number;
  sgst_amount?: number;
  igst_amount?: number;

  // Line items (optional - may not be in all responses)
  line_items?: VoucherDetailLineItemAPI[];

  // Status fields (from API response)
  voucher_status: 'draft' | 'finalized' | 'posted' | 'synced';
  approval_status: 'approved' | 'pending' | 'rejected' | 'request_changes' | '' | null;
  payment_status: 'pending' | 'success' | 'failed' | 'cancelled' | null;

  // Payment terms
  payment_terms?: string;

  // Financial details (optional object)
  financial_details?: any;

  // Approval workflow (optional)
  approvals?: VoucherDetailApprovalAPI[];
  current_approval_level?: number;

  // Payment details
  payment_details?: VoucherDetailPaymentAPI;

  // Accounting
  accounting_details?: VoucherDetailAccountingAPI;

  // Attachments (may be object or array)
  attachments?: VoucherDetailAttachmentAPI[] | any;

  // Timeline
  timeline_events?: VoucherDetailTimelineEventAPI[];

  // OCR data
  ocr_data?: VoucherDetailOCRDataAPI;

  // ERP Sync
  erp_sync_status?: string;
  erp_sync_attempts?: number;

  // Metadata
  created_at?: string; // ISO 8601
  updated_at?: string; // ISO 8601
  created_by?: string;
  updated_by?: string;
}
