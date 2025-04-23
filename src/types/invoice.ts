
export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  tax?: number;
  unitPrice?: number;
}
