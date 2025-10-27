
export type ApprovalStatus = "pending" | "approved" | "rejected" | "changes_requested";

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
  // Add more details for the full view in the panel
}
