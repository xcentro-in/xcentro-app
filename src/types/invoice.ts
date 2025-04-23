
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
  amount?: number;
  invoiceDate?: Date;
  matchedVendor?: any;
  paymentInstructions?: any;
  gstDetails?: any;
}

export interface OCRProgress {
  status: 'idle' | 'processing' | 'complete' | 'error';
  progress: number;
  message?: string;
}
