export type PaymentStatus = 'success' | 'pending' | 'failed' | 'processing';
export type PaymentMethodType = 'token_card' | 'card' | 'upi' | 'netbanking';
export type PayeeType = 'employee' | 'vendor' | 'supplier' | 'contractor';

export interface PaymentSource {
  source_type: string;
  last_four_digits: string;
  bank_name: string;
  card_type: string;
  card_category: string;
}

export interface Bill {
  voucher_id: string;
  invoice_number: string;
  payee_name: string;
  payee_type: PayeeType;
  relation_id: string;
  amount: number;
}

export interface ActivityLog {
  action: string;
  actor_name: string;
  timestamp: string;
}

export interface PaymentDetails {
  payment_id: string;
  status: PaymentStatus;
  net_amount: number;
  service_charge: number;
  service_charge_gst: number;
  total_amount: number;
  currency: string;
  payment_method: PaymentMethodType;
  description: string;
  payment_source: PaymentSource;
  bills: Bill[];
  activity: ActivityLog[];
  created_at: string;
}

export interface PaymentDetailsResponse {
  data: PaymentDetails;
  message: string;
  status: string;
}

// Invoice types for GST-compliant invoice generation
export type InvoiceIRNStatus = 'pending' | 'irn_generated' | 'failed' | 'cancelled';
export type InvoiceFilingStatus = 'not_filed' | 'filed' | 'failed';

export interface Invoice {
  invoice_id: number;
  payment_id: string;
  invoice_number: string;
  gstin_supplier: string;
  gstin_recipient: string;
  invoice_date: string;
  irn?: string;
  irn_ack_no?: string;
  irn_ack_date?: string;
  irn_status: InvoiceIRNStatus;
  qr_code?: string;
  filing_status: InvoiceFilingStatus;
  description: string;
  sac_code: string;
  taxable_value: number;
  gst_rate: number;
  gst_amount: number;
  total_amount: number;
  created_at: string;
  updated_at: string;
}
