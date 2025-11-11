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
  retryOfPaymentId: string | null; // ID of original payment if this is a retry
  retryCount: number; // Number indicating which retry attempt this is (0 for original)
  hasSuccessfulRetry: boolean; // Whether this payment has a successful retry
}

export interface PaymentListResponseAPI {
  payments: PaymentListItemAPI[];
  total_count: number;
  limit: number;
  offset: number;
}
