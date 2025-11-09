export interface FeeBreakdown {
  base_amount: number;
  convenience_fee: number;
  convenience_fee_gst: number;
  total_fee: number;
  total_amount: number;
  convenience_fee_percent: number;
  gst_percent: number;
}

export interface PaymentSourceCard {
  source_id: string;
  source_type: 'card';
  payment_method: 'card';
  display_name: string;
  card_type: string;
  card_category: 'credit' | 'debit';
  last_four_digits: string;
  is_allowed: boolean;
  restriction_reason?: string;
  fee_breakdown?: FeeBreakdown;
}

export interface PaymentSourceBankAccount {
  source_id: string;
  source_type: 'bank_account';
  payment_method: 'net_banking' | 'upi';
  display_name: string;
  bank_name: string;
  ifsc_code: string;
  is_allowed: boolean;
  restriction_reason?: string;
  fee_breakdown?: FeeBreakdown;
}

export type PaymentSource = PaymentSourceCard | PaymentSourceBankAccount;

export interface GetPaymentSourcesRequest {
  business_id: string;
  payment_context: string;
  base_amount: number;
}

export interface GetPaymentSourcesResponse {
  data: {
    business_id: string;
    payment_context: string;
    base_amount: number;
    sources: PaymentSource[];
  };
  endpoint: string;
  message: string;
  status: string;
}
