// API response types for GET /v1/process_payment/list

export interface PaymentListBillAPI {
  voucherId: string;
  billId: string;
  amount: number; // Amount in paise
}

export interface PaymentListBreakdownAPI {
  bills: PaymentListBillAPI[];
  convenienceFee: number; // Fee in paise
  gstOnFee: number; // GST in paise
}

export interface PaymentListPaymentMethodAPI {
  type: 'credit' | 'bank' | 'upi' | 'bnpl' | 'other';
  last4: string;
  cardProvider?: string;
  bank?: string;
}

export interface PaymentListItemAPI {
  payoutId: string;
  date: string; // ISO 8601 format
  payees: string[];
  billCount: number;
  paymentMethod: PaymentListPaymentMethodAPI;
  totalAmount: number; // Total amount in paise
  status: 'success' | 'pending' | 'failed' | 'processing';
  breakdown: PaymentListBreakdownAPI;
}

export interface PaymentListResponseAPI {
  payments: PaymentListItemAPI[];
  total_count: number;
  limit: number;
  offset: number;
}
