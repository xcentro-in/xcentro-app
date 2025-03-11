
import { PaymentMethod } from "@/types/payment-method";

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "card",
    cardholderName: "Business Account",
    lastFourDigits: "4242",
    expiryDate: "09/2025",
    cardType: "visa",
    billingAddress: "123 Business St, Suite 101, Mumbai, 400001",
    isDefault: true,
    enabledForRecurring: true,
    createdAt: "2023-06-15T10:30:00Z",
    updatedAt: "2023-06-15T10:30:00Z"
  },
  {
    id: "2",
    type: "card",
    cardholderName: "Corporate Account",
    lastFourDigits: "5678",
    expiryDate: "11/2024",
    cardType: "mastercard",
    isDefault: false,
    enabledForRecurring: false,
    createdAt: "2023-07-20T14:45:00Z",
    updatedAt: "2023-07-20T14:45:00Z"
  },
  {
    id: "3",
    type: "bank",
    accountHolderName: "PaySphere Ltd",
    bankName: "HDFC Bank",
    lastFourDigits: "9876",
    ifscCode: "HDFC0001234",
    transactionType: "neft",
    isDefault: true,
    enabledForRecurring: true,
    createdAt: "2023-05-10T09:15:00Z",
    updatedAt: "2023-08-05T11:20:00Z"
  },
  {
    id: "4",
    type: "bnpl",
    provider: "PayLater Business",
    creditLimit: 100000,
    availableCredit: 75000,
    repaymentTermDays: 30,
    autoDebitEnabled: true,
    isDefault: false,
    enabledForRecurring: false,
    createdAt: "2023-09-01T16:30:00Z",
    updatedAt: "2023-09-01T16:30:00Z"
  },
  {
    id: "5",
    type: "upi",
    upiId: "paysphere@icici",
    linkedBank: "ICICI Bank",
    isDefault: false,
    enabledForRecurring: true,
    createdAt: "2023-08-12T13:10:00Z",
    updatedAt: "2023-08-12T13:10:00Z"
  }
];
