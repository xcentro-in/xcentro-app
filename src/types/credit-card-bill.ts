
export type CreditCardBillStatus = 'paid' | 'pending' | 'overdue';

export interface CreditCardBill {
  id: string;
  cardIssuer: string;
  lastFourDigits: string;
  totalDueAmount: number;
  minimumDueAmount: number;
  dueDate: string;
  status: CreditCardBillStatus;
  latePaymentCharges?: number;
  interestRate?: number;
  statementDate?: string;
  billPeriod?: string;
  isPaid?: boolean;
}
