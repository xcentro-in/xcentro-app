// API response types for GET /v1/vouchers/approval-inbox

export type ApprovalAction = 'pending' | 'approved' | 'rejected' | 'request_changes';

export interface ApprovalHistoryItem {
  approval_id: string;
  requester_user_id: string;
  requester_name: string;
  approver_user_id: string;
  approver_name: string;
  action: ApprovalAction;
  remarks: string;
  created_at: string; // ISO 8601 format
}

export interface ApprovalInboxVoucher {
  voucher_id: string;
  voucher_number: string;
  invoice_number: string;
  invoice_due_date: string | null; // ISO 8601 format or null
  payee_name: string;
  total_amount: number; // Amount in paise
  voucher_status: 'draft' | 'finalized' | 'pending' | 'processed';
  current_approval_status: ApprovalAction;
  approval_history: ApprovalHistoryItem[];
}

export interface ApprovalInboxResponse {
  vouchers: ApprovalInboxVoucher[];
  total_count: number;
}

export interface ApprovalInboxFilters {
  status: ApprovalAction;
}
