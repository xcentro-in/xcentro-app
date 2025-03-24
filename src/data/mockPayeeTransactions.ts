import { Transaction } from "@/types/transaction";

// Generate a unique transaction ID
const generateTransactionId = () => {
  return `TXN-${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}`;
};

// Generate a random date within the last year
const generateRandomDate = () => {
  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);
  
  return new Date(
    oneYearAgo.getTime() + Math.random() * (now.getTime() - oneYearAgo.getTime())
  ).toISOString();
};

// Generate a random invoice number
const generateInvoiceNumber = () => {
  return `INV-${Math.floor(Math.random() * 1000)}-${Math.floor(Math.random() * 10000)}`;
};

// Generate a random amount between min and max
const generateRandomAmount = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Create mock transactions for each payee
export const mockPayeeTransactions: Record<string, Transaction[]> = {
  // Payee 1: Office Supplies Co. (Bank)
  "1": [
    {
      id: 1,
      transactionId: generateTransactionId(),
      vendor: "Office Supplies Co.",
      amount: 2500,
      status: "completed",
      date: "2023-10-20T10:30:00Z",
      method: "credit",
      type: "single",
      description: "Office furniture and supplies",
      invoice: generateInvoiceNumber(),
      fees: [
        { type: "processing", amount: 25 }
      ],
      accountDetails: {
        cardLast4: "4321",
        cardProvider: "Visa"
      }
    },
    {
      id: 2,
      transactionId: generateTransactionId(),
      vendor: "Office Supplies Co.",
      amount: 1200,
      status: "completed",
      date: "2023-11-15T14:45:00Z",
      method: "bank",
      type: "single",
      description: "Printer cartridges and paper",
      invoice: generateInvoiceNumber(),
      fees: [
        { type: "processing", amount: 10 }
      ],
      accountDetails: {
        bank: "National Bank",
        accountNumberLast4: "7890"
      }
    },
    {
      id: 3,
      transactionId: generateTransactionId(),
      vendor: "Office Supplies Co.",
      amount: 3500,
      status: "pending",
      date: "2024-04-05T09:15:00Z",
      method: "credit",
      type: "single",
      description: "Office renovations - partial payment",
      invoice: generateInvoiceNumber(),
      scheduledDate: "2024-04-10T00:00:00Z",
      accountDetails: {
        cardLast4: "4321",
        cardProvider: "Visa"
      }
    }
  ],
  
  // Payee 2: Cloud Services (Bank)
  "2": [
    {
      id: 4,
      transactionId: generateTransactionId(),
      vendor: "Cloud Services",
      amount: 499,
      status: "completed",
      date: "2024-01-05T08:00:00Z",
      method: "credit",
      type: "recurring",
      description: "Monthly cloud storage subscription",
      invoice: generateInvoiceNumber(),
      isRecurring: true,
      nextPaymentDate: "2024-05-05T08:00:00Z",
      accountDetails: {
        cardLast4: "8765",
        cardProvider: "Mastercard"
      }
    },
    {
      id: 5,
      transactionId: generateTransactionId(),
      vendor: "Cloud Services",
      amount: 499,
      status: "completed",
      date: "2024-02-05T08:00:00Z",
      method: "credit",
      type: "recurring",
      description: "Monthly cloud storage subscription",
      invoice: generateInvoiceNumber(),
      isRecurring: true,
      nextPaymentDate: "2024-05-05T08:00:00Z",
      accountDetails: {
        cardLast4: "8765",
        cardProvider: "Mastercard"
      }
    },
    {
      id: 6,
      transactionId: generateTransactionId(),
      vendor: "Cloud Services",
      amount: 499,
      status: "completed",
      date: "2024-03-05T08:00:00Z",
      method: "credit",
      type: "recurring",
      description: "Monthly cloud storage subscription",
      invoice: generateInvoiceNumber(),
      isRecurring: true,
      nextPaymentDate: "2024-05-05T08:00:00Z",
      accountDetails: {
        cardLast4: "8765",
        cardProvider: "Mastercard"
      }
    },
    {
      id: 7,
      transactionId: generateTransactionId(),
      vendor: "Cloud Services",
      amount: 499,
      status: "upcoming",
      date: "2024-05-05T08:00:00Z",
      method: "credit",
      type: "recurring",
      description: "Monthly cloud storage subscription",
      scheduledDate: "2024-05-05T08:00:00Z",
      isRecurring: true,
      nextPaymentDate: "2024-06-05T08:00:00Z",
      accountDetails: {
        cardLast4: "8765",
        cardProvider: "Mastercard"
      }
    },
    {
      id: 8,
      transactionId: generateTransactionId(),
      vendor: "Cloud Services",
      amount: 2999,
      status: "completed",
      date: "2023-12-20T11:30:00Z",
      method: "bank",
      type: "single",
      description: "Annual premium service package",
      invoice: generateInvoiceNumber(),
      fees: [
        { type: "processing", amount: 30 }
      ],
      accountDetails: {
        bank: "Global Bank",
        accountNumberLast4: "3456"
      }
    }
  ],
  
  // Payee 3: City Electric (Biller)
  "3": [
    {
      id: 9,
      transactionId: generateTransactionId(),
      vendor: "City Electric",
      amount: 850,
      status: "completed",
      date: "2024-01-10T15:20:00Z",
      method: "bank",
      type: "recurring",
      description: "January electricity bill",
      invoice: generateInvoiceNumber(),
      isRecurring: true,
      nextPaymentDate: "2024-02-10T15:20:00Z",
      accountDetails: {
        bank: "National Bank",
        accountNumberLast4: "7890"
      }
    },
    {
      id: 10,
      transactionId: generateTransactionId(),
      vendor: "City Electric",
      amount: 920,
      status: "completed",
      date: "2024-02-10T16:15:00Z",
      method: "bank",
      type: "recurring",
      description: "February electricity bill",
      invoice: generateInvoiceNumber(),
      isRecurring: true,
      nextPaymentDate: "2024-03-10T16:15:00Z",
      accountDetails: {
        bank: "National Bank",
        accountNumberLast4: "7890"
      }
    },
    {
      id: 11,
      transactionId: generateTransactionId(),
      vendor: "City Electric",
      amount: 875,
      status: "completed",
      date: "2024-03-10T14:45:00Z",
      method: "bank",
      type: "recurring",
      description: "March electricity bill",
      invoice: generateInvoiceNumber(),
      isRecurring: true,
      nextPaymentDate: "2024-04-10T14:45:00Z",
      accountDetails: {
        bank: "National Bank",
        accountNumberLast4: "7890"
      }
    },
    {
      id: 12,
      transactionId: generateTransactionId(),
      vendor: "City Electric",
      amount: 905,
      status: "pending",
      date: "2024-04-10T14:45:00Z",
      method: "bank",
      type: "recurring",
      description: "April electricity bill",
      scheduledDate: "2024-04-10T14:45:00Z",
      isRecurring: true,
      nextPaymentDate: "2024-05-10T14:45:00Z",
      accountDetails: {
        bank: "National Bank",
        accountNumberLast4: "7890"
      }
    }
  ],
  
  // Payee 4: Internet Provider (Biller)
  "4": [
    {
      id: 13,
      transactionId: generateTransactionId(),
      vendor: "Internet Provider",
      amount: 1200,
      status: "completed",
      date: "2024-01-15T09:30:00Z",
      method: "credit",
      type: "recurring",
      description: "January internet bill",
      invoice: generateInvoiceNumber(),
      isRecurring: true,
      nextPaymentDate: "2024-02-15T09:30:00Z",
      accountDetails: {
        cardLast4: "4321",
        cardProvider: "Visa"
      }
    },
    {
      id: 14,
      transactionId: generateTransactionId(),
      vendor: "Internet Provider",
      amount: 1200,
      status: "completed",
      date: "2024-02-15T10:15:00Z",
      method: "credit",
      type: "recurring",
      description: "February internet bill",
      invoice: generateInvoiceNumber(),
      isRecurring: true,
      nextPaymentDate: "2024-03-15T10:15:00Z",
      accountDetails: {
        cardLast4: "4321",
        cardProvider: "Visa"
      }
    },
    {
      id: 15,
      transactionId: generateTransactionId(),
      vendor: "Internet Provider",
      amount: 1200,
      status: "completed",
      date: "2024-03-15T11:00:00Z",
      method: "credit",
      type: "recurring",
      description: "March internet bill",
      invoice: generateInvoiceNumber(),
      isRecurring: true,
      nextPaymentDate: "2024-04-15T11:00:00Z",
      accountDetails: {
        cardLast4: "4321",
        cardProvider: "Visa"
      }
    },
    {
      id: 16,
      transactionId: generateTransactionId(),
      vendor: "Internet Provider",
      amount: 1500,
      status: "upcoming",
      date: "2024-04-15T11:00:00Z",
      method: "credit",
      type: "recurring",
      description: "April internet bill with premium package",
      scheduledDate: "2024-04-15T11:00:00Z",
      isRecurring: true,
      nextPaymentDate: "2024-05-15T11:00:00Z",
      accountDetails: {
        cardLast4: "4321",
        cardProvider: "Visa"
      }
    }
  ],
  
  // Other payees' transactions with minimal data for brevity
  "5": [
    {
      id: 17,
      transactionId: generateTransactionId(),
      vendor: "John Smith",
      amount: 5000,
      status: "completed",
      date: "2024-03-31T14:00:00Z",
      method: "bank",
      type: "single",
      description: "March salary payment",
      invoice: generateInvoiceNumber(),
      accountDetails: {
        bank: "City Bank",
        accountNumberLast4: "5678"
      }
    }
  ],
  
  "6": [
    {
      id: 18,
      transactionId: generateTransactionId(),
      vendor: "Jane Doe",
      amount: 6000,
      status: "completed",
      date: "2024-03-30T15:00:00Z",
      method: "bank",
      type: "single",
      description: "March salary payment",
      invoice: generateInvoiceNumber(),
      accountDetails: {
        bank: "National Bank",
        accountNumberLast4: "9876"
      }
    }
  ]
};

// Add a function to get transactions for a specific payee
export const getPayeeTransactions = (payeeId: string): Transaction[] => {
  return mockPayeeTransactions[payeeId] || [];
};

// Calculate total payments for a payee
export const getPayeeTotalPayments = (payeeId: string): number => {
  const transactions = getPayeeTransactions(payeeId);
  return transactions
    .filter(transaction => transaction.status === "completed")
    .reduce((total, transaction) => total + transaction.amount, 0);
};

// Get last transaction date for a payee
export const getPayeeLastTransactionDate = (payeeId: string): string | null => {
  const transactions = getPayeeTransactions(payeeId);
  if (transactions.length === 0) return null;
  
  const completedTransactions = transactions
    .filter(transaction => transaction.status === "completed")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return completedTransactions.length > 0 ? completedTransactions[0].date : null;
};
