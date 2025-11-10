// Unpaid Vouchers API Types
// API: GET /v1/vouchers/unpaid

export interface UnpaidVoucherBill {
  voucher_id: string;
  invoice_number: string;
  total_amount: number; // Amount in rupees
  due_date: string; // ISO 8601 date format
  status: 'open' | 'overdue';
  vendor_name: string;
  vendor_gstin: string;
}

export interface UnpaidVouchersResponse {
  bills: UnpaidVoucherBill[];
  total_count: number;
  limit: number;
  offset: number;
}
