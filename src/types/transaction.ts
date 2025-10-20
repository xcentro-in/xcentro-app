
export type TransactionStatus = 
  | 'completed' 
  | 'pending' 
  | 'upcoming'
  | 'failed'
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'cancelled';

export type PaymentMethod = 'credit' | 'bank' | 'upi' | 'bnpl';
export type TransactionType = 'single' | 'batch' | 'recurring';
export type TransactionCategory = 'vendor' | 'supplier' | 'biller' | 'payroll';

export interface TransactionAuditLog {
  id: string;
  timestamp: string;
  action: string;
  user: {
    name: string;
    role: string;
  };
  details?: string;
}

export interface TransactionFee {
  type: string;
  amount: number;
  percentage?: number;
}

export interface Transaction {
  id: number | string;
  transactionId: string;
  vendor: string;
  amount: number;
  status: TransactionStatus;
  date: string;
  method: PaymentMethod;
  type: TransactionType;
  category?: TransactionCategory;
  initiatedBy?: {
    name: string;
    role: string;
  };
  approvedBy?: {
    name: string;
    role: string;
    date?: string;
  };
  description?: string;
  scheduledDate?: string;
  isRecurring?: boolean;
  nextPaymentDate?: string;
  accountDetails?: {
    bank?: string;
    accountNumberLast4?: string;
    cardLast4?: string;
    cardProvider?: string;
  };
  fees?: TransactionFee[];
  invoice?: string;
  attachments?: string[];
  notes?: string;
  auditTrail?: TransactionAuditLog[];
}
