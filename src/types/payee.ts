
export type PayeeType = "bank" | "biller" | "payroll";

export interface BasePayee {
  id: string;
  name: string;
  type: PayeeType;
  email: string;
  contactNumber: string;
  createdAt: string;
  isDefault: boolean;
}

export interface BankPayee extends BasePayee {
  type: "bank";
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  gstin?: string;
  defaultPaymentMode: "credit" | "bank";
  tags: string[];
}

export interface BillerPayee extends BasePayee {
  type: "biller";
  billerName: string;
  customerId: string;
  billingCycle: "monthly" | "quarterly" | "yearly" | "one-time";
  autoPayment: boolean;
}

export interface PayrollPayee extends BasePayee {
  type: "payroll";
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  salaryAmount: number;
  salaryType: "fixed" | "variable";
  payrollCycle: "weekly" | "bi-weekly" | "monthly" | "custom";
}

export type Payee = BankPayee | BillerPayee | PayrollPayee;
