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

    // Payment status
    payment_status: 'paid' | 'unpaid';

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
// Returns chronological activity timeline
export interface VoucherActivityResponseAPI {
  voucher_id: string;
  voucher_number: string;
  activities: {
    activity_id: string;
    activity_type: string; // 'voucher_created', 'voucher_updated', 'status_changed', etc.
    user_id: string;
    user_name: string;
    action: string; // 'created', 'updated', 'approved', 'rejected', etc.
    remarks: string;
    timestamp: string; // ISO 8601
    metadata: string;
  }[];
  total_count: number;
}

// GET /v1/vouchers/:voucherId/payment
// Returns payment information
export interface VoucherPaymentResponseAPI {
  payment_id: string;
  voucher_id: string;
  voucher_number: string;
  payment_status: 'success' | 'pending' | 'failed' | 'processing';
  payment_date: string; // ISO 8601
  gateway_used: string;
  gateway_payment_id: string;
  payment_method: string; // 'card', 'upi', 'netbanking', etc.
  payment_source_type: string; // 'card', 'bank_account', etc.

  // Card-specific fields (when payment_source_type is 'card')
  card_type?: string; // 'visa', 'mastercard', 'amex', 'rupay'
  card_category?: string; // 'credit', 'debit'
  last_four_digits?: string;
  bank_name?: string;

  // Amount breakdown (all in paise)
  voucher_amount: number;
  convenience_fee: number;
  convenience_fee_rate: string; // e.g., "0.00%"
  gst_on_fee: number;
  gst_rate: string; // e.g., "18.00%"
  total_fee_amount: number;
  total_amount_paid: number;

  // Settlement details
  settlement_status: 'pending' | 'settled' | 'failed';
  settled_at: string | null; // ISO 8601
  settlement_amount: number; // in paise
  mdr_amount: number; // Merchant Discount Rate amount in paise
  mdr_rate: string; // e.g., "2.00%"
  net_settlement_amount: number; // in paise
  settlement_reference_id: string;
  settlement_utr: string;

  description: string;
  metadata: Record<string, any>;
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
