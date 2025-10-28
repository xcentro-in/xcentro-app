
export type ApprovalStatus = "pending" | "approved" | "rejected" | "request_changes";

export interface ApprovalHistoryEntry {
  approvalId: string;
  requesterUserId: string;
  requesterName: string;
  approverUserId: string;
  approverName: string;
  action: ApprovalStatus;
  remarks: string;
  createdAt: string; // ISO 8601 format
}

export interface ApprovalTransaction {
  id: string;
  payee: string;
  description: string;
  amount: number;
  date: string; // Assuming this is the transaction date
  status: ApprovalStatus;
  requestedBy: {
    name: string;
    role: string;
  };
  invoiceNumber: string;
  dueDate: string;
  category: string;
  notes?: string;
  paymentMethod: "credit" | "bank" | "wallet";
  initiatedBy: string;
  initiatorRole: string;
  requestedDate: string;
  isRead?: boolean;
  approvalHistory?: ApprovalHistoryEntry[]; // Chronological order from API
}
