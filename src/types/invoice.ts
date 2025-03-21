
import { Transaction } from "@/types/transaction";
import { Payee } from "@/types/payee";

export interface InvoiceDetails {
  invoiceNumber: string;
  vendorName: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: number;
  gstDetails?: {
    cgst?: number;
    sgst?: number;
    igst?: number;
    total: number;
  };
  paymentInstructions?: {
    bankAccount?: string;
    ifscCode?: string;
    upiId?: string;
    accountHolderName?: string;
  };
  items?: InvoiceItem[];
  notes?: string;
  status?: 'pending' | 'paid' | 'overdue' | 'processing';
  vendorId?: string | number;
  matchedVendor?: Payee | null;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  tax?: number;
}

export interface OCRProgress {
  status: 'idle' | 'processing' | 'completed' | 'failed';
  message?: string;
  progress?: number;
}

export interface PaymentSummary {
  invoiceAmount: number;
  platformFee: number;
  processingFee: number;
  gstOnFees: number;
  totalPayable: number;
  rewardPointsEarned?: number;
  rewardPointsRedeemed?: number;
  rewardPointsValue?: number;
}

export interface InvoicePaymentTransaction extends Transaction {
  invoiceNumber: string;
  vendorName: string;
  invoiceDate: string;
  dueDate: string;
  receipt?: string;
}
