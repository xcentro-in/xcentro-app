
import { ApprovalTransaction } from "@/types/approval";

export const mockApprovalTransactions: ApprovalTransaction[] = [
  {
    id: "TRX-12345",
    initiatedBy: "Sarah Johnson",
    initiatorRole: "Finance Manager",
    payee: "Office Supplies Co.",
    amount: 2499.99,
    description: "Purchase of new office equipment and supplies",
    requestedDate: "2023-08-15T10:30:00",
    status: "pending",
    date: "2023-08-15",
    paymentMethod: "credit",
    isRead: false,
    invoiceNumber: "INV-2023-001",
    dueDate: "2023-08-25",
    category: "Office Supplies",
    requestedBy: {
      name: "Sarah Johnson",
      role: "Finance Manager"
    },
    notes: "This vendor requires payment within 24 hours to maintain our account status."
  },
  {
    id: "TRX-12346",
    initiatedBy: "Michael Chen",
    initiatorRole: "Accountant",
    payee: "Cloud Services",
    amount: 899.00,
    description: "Monthly cloud infrastructure payment",
    requestedDate: "2023-08-15T09:15:00",
    status: "pending",
    date: "2023-08-15",
    paymentMethod: "bank",
    isRead: false,
    invoiceNumber: "INV-2023-002",
    dueDate: "2023-08-20",
    category: "IT Services",
    requestedBy: {
      name: "Michael Chen",
      role: "Accountant"
    }
  },
  {
    id: "TRX-12347",
    initiatedBy: "Emily Rodriguez",
    initiatorRole: "Finance Manager",
    payee: "Marketing Agency",
    amount: 5999.99,
    description: "Q3 marketing campaign payment",
    requestedDate: "2023-08-14T14:20:00",
    status: "request_changes",
    date: "2023-08-14",
    paymentMethod: "credit",
    isRead: true,
    invoiceNumber: "INV-2023-003",
    dueDate: "2023-08-28",
    category: "Marketing",
    requestedBy: {
      name: "Emily Rodriguez",
      role: "Finance Manager"
    },
    notes: "Amount exceeds usual marketing payment. Need verification of campaign scope."
  },
  {
    id: "TRX-12348",
    initiatedBy: "Alex Thompson",
    initiatorRole: "Accountant",
    payee: "Rent Payment",
    amount: 8500.00,
    description: "Monthly office rent",
    requestedDate: "2023-08-14T11:45:00",
    status: "pending",
    date: "2023-08-14",
    paymentMethod: "bank",
    isRead: true,
    invoiceNumber: "INV-2023-004",
    dueDate: "2023-08-31",
    category: "Office Expenses",
    requestedBy: {
      name: "Alex Thompson",
      role: "Accountant"
    }
  },
  {
    id: "TRX-12349",
    initiatedBy: "Jessica Lee",
    initiatorRole: "Accountant",
    payee: "IT Support",
    amount: 1299.50,
    description: "Monthly IT maintenance contract",
    requestedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    status: "approved",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentMethod: "credit",
    isRead: true,
    invoiceNumber: "INV-2023-005",
    dueDate: "2023-08-18",
    category: "IT Services",
    requestedBy: {
      name: "Jessica Lee",
      role: "Accountant"
    }
  },
  {
    id: "TRX-12350",
    initiatedBy: "David Wilson",
    initiatorRole: "Finance Manager",
    payee: "Office Furniture",
    amount: 4750.25,
    description: "New ergonomic chairs for the office",
    requestedDate: "2023-08-10T10:15:00",
    status: "rejected",
    date: "2023-08-10",
    paymentMethod: "bank",
    isRead: true,
    invoiceNumber: "INV-2023-006",
    dueDate: "2023-08-22",
    category: "Office Furniture",
    requestedBy: {
      name: "David Wilson",
      role: "Finance Manager"
    },
    notes: "Need to request additional quotes before approving this purchase."
  },
  {
    id: "TRX-12351",
    initiatedBy: "Sarah Johnson",
    initiatorRole: "Finance Manager",
    payee: "Internet Provider",
    amount: 499.99,
    description: "Monthly internet service payment",
    requestedDate: "2023-08-05T09:30:00",
    status: "request_changes",
    date: "2023-08-05",
    paymentMethod: "bank",
    isRead: true,
    invoiceNumber: "INV-2023-007",
    dueDate: "2023-08-15",
    category: "Utilities",
    requestedBy: {
      name: "Sarah Johnson",
      role: "Finance Manager"
    },
    notes: "Please confirm if this includes the upgraded bandwidth package."
  },
  {
    id: "TRX-12352",
    initiatedBy: "Michael Chen",
    initiatorRole: "Accountant",
    payee: "Employee Benefits",
    amount: 3250.00,
    description: "Quarterly employee health insurance payment",
    requestedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    status: "approved",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentMethod: "credit",
    isRead: true,
    invoiceNumber: "INV-2023-008",
    dueDate: "2023-08-20",
    category: "Employee Benefits",
    requestedBy: {
      name: "Michael Chen",
      role: "Accountant"
    }
  },
  {
    id: "TRX-12353",
    initiatedBy: "Emily Rodriguez",
    initiatorRole: "Finance Manager",
    payee: "Cleaning Services",
    amount: 750.00,
    description: "Monthly office cleaning",
    requestedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago (beyond 7 days)
    status: "approved",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentMethod: "bank",
    isRead: true,
    invoiceNumber: "INV-2023-009",
    dueDate: "2023-08-10",
    category: "Office Maintenance",
    requestedBy: {
      name: "Emily Rodriguez",
      role: "Finance Manager"
    }
  }
];
