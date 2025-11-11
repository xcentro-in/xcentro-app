export interface Payout {
  payoutId: string;
  date: string;
  payees: string[];
  billCount: number;
  paymentMethod: {
    type: 'credit' | 'bank' | 'upi' | 'bnpl' | 'other';
    cardProvider?: string;
    bank?: string;
    last4: string;
  };
  totalAmount: number;
  status: 'Completed' | 'In Progress' | 'Failed' | 'Pending';
  breakdown: {
    bills: { voucherId?: string; billId: string; amount: number }[];
    convenienceFee: number;
    gstOnFee: number;
  };
  retryOfPaymentId: string | null; // ID of original payment if this is a retry attempt
}