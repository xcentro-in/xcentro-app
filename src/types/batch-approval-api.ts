// Batch Approval API Types
// API: POST /v1/vouchers/batch-approve

export interface BatchApprovalRequestBody {
  voucher_ids: string[];
  approved_by_id: string;
  remarks?: string;
}

export interface BatchApprovalResult {
  voucher_id: string;
  voucher_number: string;
  success: boolean;
  message: string;
  approval_id: string;
}

export interface BatchApprovalResponse {
  success: boolean;
  message: string;
  total_requested: number;
  total_approved: number;
  total_failed: number;
  results: BatchApprovalResult[];
}
