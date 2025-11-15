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
