// API response types for tab-specific voucher endpoints

// GET /v1/vouchers/:voucherId
// Returns basic info + details tab data (loaded on page load)
export interface VoucherDetailsResponseAPI {
  data: {
    // Header/Hero section
    voucher_id: string;
    voucher_number: string;
    voucher_date: string; // ISO 8601
    fiscal_year: string;
    accounting_period: string;
    voucher_type: string;
    status: 'draft' | 'finalized' | 'pending' | 'processed';

    // Payee/Vendor info
    payee: {
      relation_id: string;
      payee_id: string;
      name: string;
      gstin?: string;
      type: string; // 'vendor', 'biller', 'salary'
      bank_account_masked?: string;
      account_id?: string;
      ifsc_code?: string;
      bank_name?: string;
      account_type?: string;
    };

    // Invoice details
    invoice_number: string;
    invoice_date: string | null; // ISO 8601
    invoice_due_date: string | null; // ISO 8601

    // Amounts (all in paise)
    gross_amount: number;
    net_amount: number;
    currency: string;
    gst_amount: number;
    cgst_amount: number;
    sgst_amount: number;
    tds_amount: number;

    // Financial breakdown (Details tab)
    financial_details: {
      discount: {
        amount: number;
        type: string;
        value: number;
      };
      gst_type: string; // 'cgst_sgst' | 'igst'
      line_items: {
        amount: number; // in paise
        description: string;
        gst_amount: number; // in paise
        gst_rate: number; // percentage
        quantity: number;
        rate: number; // in paise
      }[];
      round_off: {
        amount: number;
        applied: boolean;
      };
    };

    // Additional fields
    expense_category?: string;
    description?: string;
    erp_sync_status?: string;
    erp_sync_attempts?: number;
    created_at: string; // ISO 8601
  };
  message: string;
  status: string;
}

// GET /v1/vouchers/:voucherId/activity
// Returns chronological activity timeline (merged timeline + approvals)
export interface VoucherActivityResponseAPI {
  events: {
    event_id: string;
    event_type: 'created' | 'edited' | 'approved' | 'rejected' | 'request_changes' | 'pending' | 'paid' | 'status_changed';
    event_date: string; // ISO 8601
    user_name?: string;
    description: string;
    remarks?: string;
  }[];
}

// GET /v1/vouchers/:voucherId/payment
// Returns payment information
export interface VoucherPaymentResponseAPI {
  has_payment: boolean;
  payment_details: {
    payment_id: string;
    payment_method: string;
    payment_status: 'pending' | 'processing' | 'completed' | 'failed';
    payment_date: string; // ISO 8601
    utr_number: string;
    settlement_status: string;
    transaction_reference: string;
    amount_paid: number; // in paise
  } | null;
}

// GET /v1/vouchers/:voucherId/accounting
// Returns accounting/ERP integration details
export interface VoucherAccountingResponseAPI {
  has_accounting_data: boolean;
  accounting_details: {
    journal_entry_id: string;
    ledger_account: string;
    cost_center: string;
    department: string;
    erp_sync_status: 'synced' | 'pending' | 'failed' | 'not_applicable';
    erp_reference_id: string;
    erp_sync_date: string; // ISO 8601
  } | null;
}

// GET /v1/vouchers/:voucherId/attachments
// Returns list of attachments
export interface VoucherAttachmentsResponseAPI {
  attachments: {
    attachment_id: string;
    file_name: string;
    file_url: string;
    file_type: string;
    file_size: number; // in bytes
    uploaded_date: string; // ISO 8601
  }[];
}
