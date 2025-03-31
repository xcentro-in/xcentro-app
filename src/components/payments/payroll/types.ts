
export interface Employee {
  id: string;
  name: string;
  email: string;
  accountNumber: string;
  bankName: string;
  salaryAmount: number;
  contactNumber: string;
}

export type PayrollEntryMethod = "manual" | "bulk" | "existing" | null;

export type PayrollStep = 'selection' | 'details' | 'payment' | 'review';
