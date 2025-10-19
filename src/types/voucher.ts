export interface CreateVoucherDraftRequest {
  business_id: string;
  user_id: string;
  relation_id: string; // Payee ID
  invoice_number?: string;
  gross_amount: number;
  description?: string;
  voucher_date?: string; // ISO date string, placeholder for now
  payment_type?: 'now' | 'later' | 'recurring';
  scheduled_date?: string; // ISO date string for scheduled payments
  frequency?: string; // For recurring payments
}

export interface VoucherDraftResponse {
  voucher_id: string;
  voucher_number: string;
  voucher_date: string;
  fiscal_year: string;
  accounting_period: string;
  status: string;
  erp_sync_status: string;
  message: string;
}

export interface GetVoucherDraftResponse {
  data: VoucherDraftResponse;
  message: string;
  status: string;
}

export interface UpdateVoucherRequest {
  relation_id?: string; // Payee ID
  invoice_number?: string;
  gross_amount?: number;
  description?: string;
  payment_type?: 'now' | 'later' | 'recurring';
  scheduled_date?: string; // ISO date string for scheduled payments
  frequency?: string; // For recurring payments
}
