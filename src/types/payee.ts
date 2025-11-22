
export type PayeeType = "vendor" | "biller" | "employee";

export interface BasePayee {
  id: string;
  name: string;
  type: PayeeType;
  email: string;
  contactNumber: string;
  createdAt: string;
  updatedAt: string;
  isDefault: boolean;
}

export interface VendorPayee extends BasePayee {
  type: "vendor";
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

export interface EmployeePayee extends BasePayee {
  type: "employee";
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  salaryAmount: number;
  salaryType: "fixed" | "variable";
  payrollCycle: "weekly" | "bi-weekly" | "monthly" | "custom";
}

export type Payee = VendorPayee | BillerPayee | EmployeePayee;
