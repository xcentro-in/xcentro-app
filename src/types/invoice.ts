
export interface InvoiceDetails {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  totalAmount?: number;
  vendorName: string;
  vendorGst?: string;
  matchedVendor?: boolean;
  items: InvoiceItem[];
  gstDetails?: {
    cgst?: number;
    sgst?: number;
    igst?: number;
    total: number;
  };
  paymentInstructions?: {
    accountHolderName?: string;
    bankAccount?: string;
    ifscCode?: string;
    upiId?: string;
  };
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  tax?: number;
  unitPrice?: number;
}

export interface OCRProgress {
  status: 'idle' | 'processing' | 'completed' | 'error';
  message?: string;
  progress?: number;
}
