
export interface InvoiceDetails {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  vendorName: string;
  vendorGst?: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface OCRProgress {
  status: 'idle' | 'processing' | 'completed' | 'error';
  message?: string;
  progress?: number;
}
