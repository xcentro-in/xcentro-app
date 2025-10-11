
export type PaymentMethodType = "card" | "bank" | "bnpl" | "upi";

export interface BasePaymentMethod {
  id: string;
  type: PaymentMethodType;
  isDefault: boolean;
  enabledForRecurring: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CardPaymentMethod extends BasePaymentMethod {
  type: "card";
  cardholderName: string;
  lastFourDigits: string;
  expiryDate: string;
  cardType: "visa" | "mastercard" | "amex" | "dinersclub" | "rupay";
}

export interface BankPaymentMethod extends BasePaymentMethod {
  type: "bank";
  accountHolderName: string;
  bankName: string;
  lastFourDigits: string;
  ifscCode: string;
}

export interface BnplPaymentMethod extends BasePaymentMethod {
  type: "bnpl";
  provider: string;
  creditLimit: number;
  availableCredit: number;
  repaymentTermDays: 30 | 45 | 60;
  autoDebitEnabled: boolean;
}

export interface UpiPaymentMethod extends BasePaymentMethod {
  type: "upi";
  upiId: string;
  linkedBank?: string;
}

export type PaymentMethod = CardPaymentMethod | BankPaymentMethod | BnplPaymentMethod | UpiPaymentMethod;
