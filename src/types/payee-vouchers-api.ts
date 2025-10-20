// API Response types for GET /v1/vouchers/payee/:payee_id

export interface VoucherAPI {
  voucher_id: string;
  invoice_number: string;
  net_amount: number; // Amount in paise
  created_at: string; // ISO date string
  status: string; // "Draft" | "success" | other statuses
  payment_method: string; // "N/A" | "Card ****1234" | "Bank ****5678" | "UPI"
  description: string;
}

export interface PaginationAPI {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface VoucherSummaryAPI {
  total_vouchers: number;
  total_amount: number; // Total amount in paise
  draft_count: number;
  completed_count: number;
}

export interface GetPayeeVouchersResponse {
  pagination: PaginationAPI;
  status: 'success' | 'error';
  summary: VoucherSummaryAPI;
  vouchers: VoucherAPI[] | null;
  message?: string;
}
