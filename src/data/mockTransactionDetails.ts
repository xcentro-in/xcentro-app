
import { Transaction } from "@/types/transaction";

export const getMockTransactionDetail = (id: string): Transaction => {
  // Find the transaction in the mock data
  const transaction = mockTransactionDetails.find(
    (t) => t.transactionId === id || t.id.toString() === id
  );

  // Return the found transaction or a default one
  return transaction || mockTransactionDetails[0];
};

export const mockTransactionDetails: Transaction[] = [
  {
    id: 1,
    transactionId: "TRX-12345",
    vendor: "Office Supplies Co.",
    amount: 2499.99,
    status: "completed",
    date: "2023-08-15T14:30:00",
    method: "credit",
    type: "single",
    initiatedBy: {
      name: "Sarah Johnson",
      role: "Finance Manager"
    },
    description: "Purchase of new office equipment and supplies",
    accountDetails: {
      cardLast4: "4321",
      cardProvider: "Visa"
    },
    fees: [
      { type: "Platform Fee (1%)", amount: 25.00, percentage: 1 },
      { type: "Payment Processing", amount: 12.50 },
      { type: "Tax", amount: 6.75 }
    ],
    invoice: "INV-2023-08-15",
    attachments: ["invoice_12345.pdf"],
    notes: "Approved office equipment purchase as per quarterly budget allocation.",
    auditTrail: [
      {
        id: "log-1",
        timestamp: "2023-08-15T10:15:00",
        action: "Transaction Initiated",
        user: {
          name: "Sarah Johnson",
          role: "Finance Manager"
        }
      },
      {
        id: "log-2",
        timestamp: "2023-08-15T11:30:00",
        action: "Transaction Approved",
        user: {
          name: "Michael Chen",
          role: "Financial Controller"
        }
      },
      {
        id: "log-3",
        timestamp: "2023-08-15T14:30:00",
        action: "Transaction Completed",
        user: {
          name: "System",
          role: "Automated"
        },
        details: "Funds transferred successfully"
      }
    ]
  },
  {
    id: 2,
    transactionId: "TRX-12346",
    vendor: "Cloud Services",
    amount: 899.00,
    status: "completed",
    date: "2023-08-14T09:15:00",
    method: "bank",
    type: "recurring",
    initiatedBy: {
      name: "Michael Chen",
      role: "IT Manager"
    },
    isRecurring: true,
    nextPaymentDate: "2023-09-14",
    description: "Monthly cloud infrastructure payment",
    accountDetails: {
      bank: "Chase Bank",
      accountNumberLast4: "5678"
    },
    fees: [
      { type: "Platform Fee (0.5%)", amount: 4.50, percentage: 0.5 },
      { type: "ACH Transfer", amount: 0.00 }
    ],
    invoice: "INV-2023-08-14",
    auditTrail: [
      {
        id: "log-1",
        timestamp: "2023-08-14T08:00:00",
        action: "Recurring Transaction Triggered",
        user: {
          name: "System",
          role: "Automated"
        }
      },
      {
        id: "log-2",
        timestamp: "2023-08-14T09:15:00",
        action: "Transaction Completed",
        user: {
          name: "System",
          role: "Automated"
        }
      }
    ]
  },
  {
    id: 3,
    transactionId: "TRX-12347",
    vendor: "Marketing Agency",
    amount: 5999.99,
    status: "pending_approval",
    date: "2023-08-12T14:20:00",
    method: "credit",
    type: "single",
    initiatedBy: {
      name: "Emily Rodriguez",
      role: "Marketing Director"
    },
    description: "Q3 marketing campaign payment",
    accountDetails: {
      cardLast4: "9876",
      cardProvider: "Mastercard"
    },
    fees: [
      { type: "Platform Fee (1%)", amount: 60.00, percentage: 1 },
      { type: "Payment Processing", amount: 29.99 }
    ],
    notes: "Awaiting approval for Q3 marketing expenses",
    auditTrail: [
      {
        id: "log-1",
        timestamp: "2023-08-12T14:20:00",
        action: "Transaction Initiated",
        user: {
          name: "Emily Rodriguez",
          role: "Marketing Director"
        }
      },
      {
        id: "log-2",
        timestamp: "2023-08-12T15:45:00",
        action: "Sent for Approval",
        user: {
          name: "System",
          role: "Automated"
        },
        details: "Sent to Financial Controller for approval due to amount exceeding $5,000"
      }
    ]
  },
  {
    id: 4,
    transactionId: "TRX-12348",
    vendor: "Rent Payment",
    amount: 8500.00,
    status: "upcoming",
    date: "2023-08-20T00:00:00",
    method: "bank",
    type: "recurring",
    initiatedBy: {
      name: "System",
      role: "Automated"
    },
    isRecurring: true,
    nextPaymentDate: "2023-09-20",
    scheduledDate: "2023-08-20",
    description: "Monthly office rent",
    accountDetails: {
      bank: "Bank of America",
      accountNumberLast4: "3214"
    },
    fees: [
      { type: "Platform Fee (0.5%)", amount: 42.50, percentage: 0.5 },
      { type: "ACH Transfer", amount: 0.00 }
    ],
    auditTrail: [
      {
        id: "log-1",
        timestamp: "2023-08-01T00:00:01",
        action: "Upcoming Payment Scheduled",
        user: {
          name: "System",
          role: "Automated"
        }
      }
    ]
  },
  {
    id: 5,
    transactionId: "TRX-12349",
    vendor: "IT Support",
    amount: 1299.50,
    status: "rejected",
    date: "2023-08-10T15:30:00",
    method: "credit",
    type: "single",
    initiatedBy: {
      name: "Jessica Lee",
      role: "IT Specialist"
    },
    approvedBy: {
      name: "David Wilson",
      role: "IT Director",
      date: "2023-08-10T17:30:00"
    },
    description: "Emergency IT support services",
    accountDetails: {
      cardLast4: "5432",
      cardProvider: "Amex"
    },
    notes: "Rejected due to insufficient documentation of emergency service need. Please resubmit with incident report.",
    auditTrail: [
      {
        id: "log-1",
        timestamp: "2023-08-10T15:30:00",
        action: "Transaction Initiated",
        user: {
          name: "Jessica Lee",
          role: "IT Specialist"
        }
      },
      {
        id: "log-2",
        timestamp: "2023-08-10T17:30:00",
        action: "Transaction Rejected",
        user: {
          name: "David Wilson",
          role: "IT Director"
        },
        details: "Insufficient documentation"
      }
    ]
  }
];
