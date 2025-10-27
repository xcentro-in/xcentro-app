
export type ApprovalStatus = "pending" | "approved" | "rejected" | "request_changes";

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
  // Add more details for the full view in the panel
}
