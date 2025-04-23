
export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  tax?: number;
  unitPrice?: number;
}

export interface InvoiceDetails {
  id?: string;
  invoiceNumber?: string;
  vendorName?: string;
  vendorEmail?: string;
  issueDate?: Date;
  dueDate?: Date;
  items?: InvoiceItem[];
  totalAmount?: number;
  status?: 'draft' | 'pending' | 'paid' | 'overdue';
  notes?: string;
}
