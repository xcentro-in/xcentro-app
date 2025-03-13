
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
    status: "urgent",
    dateCategory: "today",
    paymentMethod: "credit",
    isRead: false,
    isUrgent: true,
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
    dateCategory: "today",
    paymentMethod: "bank",
    isRead: false
  },
  {
    id: "TRX-12347",
    initiatedBy: "Emily Rodriguez",
    initiatorRole: "Finance Manager",
    payee: "Marketing Agency",
    amount: 5999.99,
    description: "Q3 marketing campaign payment",
    requestedDate: "2023-08-14T14:20:00",
    status: "flagged",
    dateCategory: "yesterday",
    paymentMethod: "credit",
    isRead: true,
    notes: "Amount exceeds usual marketing payment. Need verification of campaign scope."
  },
  {
    id: "TRX-12348",
    initiatedBy: "Alex Thompson",
    initiatorRole: "Basic User",
    payee: "Rent Payment",
    amount: 8500.00,
    description: "Monthly office rent",
    requestedDate: "2023-08-14T11:45:00",
    status: "pending",
    dateCategory: "yesterday",
    paymentMethod: "bank",
    isRead: true
  },
  {
    id: "TRX-12349",
    initiatedBy: "Jessica Lee",
    initiatorRole: "Accountant",
    payee: "IT Support",
    amount: 1299.50,
    description: "Monthly IT maintenance contract",
    requestedDate: "2023-08-10T15:30:00",
    status: "approved",
    dateCategory: "this_week",
    paymentMethod: "credit",
    isRead: true
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
    dateCategory: "this_week",
    paymentMethod: "bank",
    isRead: true,
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
    status: "changes_requested",
    dateCategory: "older",
    paymentMethod: "bank",
    isRead: true,
    notes: "Please confirm if this includes the upgraded bandwidth package."
  },
  {
    id: "TRX-12352",
    initiatedBy: "Michael Chen",
    initiatorRole: "Accountant",
    payee: "Employee Benefits",
    amount: 3250.00,
    description: "Quarterly employee health insurance payment",
    requestedDate: "2023-08-05T14:20:00",
    status: "approved",
    dateCategory: "older",
    paymentMethod: "credit",
    isRead: true
  }
];
