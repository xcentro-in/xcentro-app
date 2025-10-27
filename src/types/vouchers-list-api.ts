// API response types for GET /v1/vouchers/list

export interface VoucherListItemAPI {
  voucherId: string;
  voucherNumber: string;
  invoiceNumber: string;
  invoiceDueDate: string | null;
  payeeName: string;
  totalAmount: number; // Amount in paise
  status: 'paid' | 'open' | 'overdue';
  voucherStatus: 'draft' | 'finalized' | 'pending' | 'processed';
  paymentDate: string | null; // ISO 8601 format or null
  approvalStatus: 'approved' | 'pending' | 'rejected' | null; // Approval status
}

export interface VoucherListResponseAPI {
  vouchers: VoucherListItemAPI[]; // Can be null when no results
  total_count: number;
  limit: number;
  offset: number;
}
