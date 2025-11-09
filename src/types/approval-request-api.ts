// API response type for POST /v1/vouchers/:voucherId/request-approval

export type ApprovalAction = 'pending' | 'approved' | 'rejected' | 'request_changes';

export interface ApprovalRequestBody {
  approver_user_id: string;
  action: ApprovalAction;
  remarks?: string;
}

export interface ApprovalRequestResponse {
  success: boolean;
  message: string;
  approval_id: string;
  voucher_id: string;
  action: ApprovalAction;
  action_taken_at: string | null;
}
