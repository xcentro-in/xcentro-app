
export type ApprovalStatus = 
  | 'pending'    // Waiting for approval
  | 'urgent'     // Needs immediate attention
  | 'flagged'    // Marked for review
  | 'approved'   // Transaction approved
  | 'rejected'   // Transaction rejected
  | 'changes_requested'; // Changes requested before approval

export type DateCategory = 'today' | 'yesterday' | 'this_week' | 'older';
export type PaymentMethod = 'bank' | 'credit';

export interface ApprovalTransaction {
  id: string;
  initiatedBy: string;
  initiatorRole: string;
  payee: string;
  amount: number;
  description: string;
  requestedDate: string;
  status: ApprovalStatus;
  dateCategory: DateCategory;
  paymentMethod: PaymentMethod;
  isRead: boolean;
  isUrgent?: boolean;
  notes?: string;
}
