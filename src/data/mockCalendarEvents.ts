
import { Transaction } from "@/types/transaction";
import { addDays, subDays, format } from "date-fns";

// Generate dates relative to today
const today = new Date();
// Use ISO format for backend storage - this is appropriate for calendar data
const formatDate = (date: Date) => format(date, "yyyy-MM-dd'T'HH:mm:ss");

export const mockCalendarTransactions: Transaction[] = [
  // Recurring payments (Monthly)
  {
    id: "cal-1",
    transactionId: "REC-001",
    vendor: "Office Rent",
    amount: 8500.00,
    status: "upcoming",
    date: formatDate(addDays(today, 5)),
    method: "bank",
    type: "recurring",
    isRecurring: true,
    nextPaymentDate: formatDate(addDays(today, 35)),
    scheduledDate: formatDate(addDays(today, 5)),
    description: "Monthly office rent payment"
  },
  {
    id: "cal-2",
    transactionId: "REC-002",
    vendor: "Cloud Services",
    amount: 2450.00,
    status: "upcoming",
    date: formatDate(addDays(today, 8)),
    method: "credit",
    type: "recurring",
    isRecurring: true,
    nextPaymentDate: formatDate(addDays(today, 38)),
    scheduledDate: formatDate(addDays(today, 8)),
    description: "Monthly cloud infrastructure services"
  },
  {
    id: "cal-3",
    transactionId: "REC-003",
    vendor: "Team Salaries",
    amount: 24500.00,
    status: "upcoming",
    date: formatDate(addDays(today, 15)),
    method: "bank",
    type: "recurring",
    isRecurring: true,
    nextPaymentDate: formatDate(addDays(today, 45)),
    scheduledDate: formatDate(addDays(today, 15)),
    description: "Monthly team salaries payment"
  },
  
  // Recently completed transactions
  {
    id: "cal-4",
    transactionId: "COMP-001",
    vendor: "Office Supplies Co.",
    amount: 2499.99,
    status: "completed",
    date: formatDate(subDays(today, 2)),
    method: "credit",
    type: "single",
    description: "Office supplies purchase",
    accountDetails: {
      cardLast4: "4532",
      cardProvider: "Visa"
    }
  },
  {
    id: "cal-5",
    transactionId: "COMP-002",
    vendor: "Marketing Agency",
    amount: 5999.99,
    status: "completed",
    date: formatDate(subDays(today, 5)),
    method: "bank",
    type: "single",
    description: "Q3 marketing campaign payment"
  },
  {
    id: "cal-13",
    transactionId: "COMP-003",
    vendor: "AWS Services",
    amount: 4850.00,
    status: "completed",
    date: formatDate(subDays(today, 3)),
    method: "credit",
    type: "single",
    description: "Cloud hosting monthly bill",
    accountDetails: {
      cardLast4: "8976",
      cardProvider: "Mastercard"
    }
  },
  {
    id: "cal-14",
    transactionId: "COMP-004",
    vendor: "Adobe Creative Cloud",
    amount: 3299.00,
    status: "completed",
    date: formatDate(subDays(today, 7)),
    method: "credit",
    type: "single",
    description: "Team subscription renewal",
    accountDetails: {
      cardLast4: "4532",
      cardProvider: "Visa"
    }
  },
  {
    id: "cal-15",
    transactionId: "COMP-005",
    vendor: "Google Workspace",
    amount: 1899.00,
    status: "completed",
    date: formatDate(subDays(today, 10)),
    method: "credit",
    type: "single",
    description: "Monthly workspace subscription",
    accountDetails: {
      cardLast4: "2341",
      cardProvider: "American Express"
    }
  },
  {
    id: "cal-16",
    transactionId: "COMP-006",
    vendor: "LinkedIn Ads",
    amount: 6500.00,
    status: "completed",
    date: formatDate(subDays(today, 8)),
    method: "credit",
    type: "single",
    description: "Marketing campaign spend",
    accountDetails: {
      cardLast4: "8976",
      cardProvider: "Mastercard"
    }
  },
  {
    id: "cal-17",
    transactionId: "COMP-007",
    vendor: "Salesforce",
    amount: 8750.00,
    status: "completed",
    date: formatDate(subDays(today, 12)),
    method: "credit",
    type: "single",
    description: "CRM platform monthly fee",
    accountDetails: {
      cardLast4: "5678",
      cardProvider: "Visa"
    }
  },
  {
    id: "cal-18",
    transactionId: "COMP-008",
    vendor: "Slack",
    amount: 950.00,
    status: "completed",
    date: formatDate(subDays(today, 1)),
    method: "credit",
    type: "single",
    description: "Team communication platform",
    accountDetails: {
      cardLast4: "2341",
      cardProvider: "American Express"
    }
  },
  
  // Pending approval
  {
    id: "cal-6",
    transactionId: "PEND-001",
    vendor: "Software Licenses",
    amount: 3750.00,
    status: "pending_approval",
    date: formatDate(today),
    method: "credit",
    type: "single",
    description: "Annual software license renewal",
    initiatedBy: {
      name: "Michael Chen",
      role: "IT Manager"
    }
  },
  
  // Scheduled single payments
  {
    id: "cal-7",
    transactionId: "SCH-001",
    vendor: "Conference Registration",
    amount: 1299.00,
    status: "upcoming",
    date: formatDate(addDays(today, 10)),
    method: "credit",
    type: "single",
    scheduledDate: formatDate(addDays(today, 10)),
    description: "Industry conference registration fee"
  },
  
  // Today's transactions
  {
    id: "cal-8",
    transactionId: "TODAY-001",
    vendor: "Catering Service",
    amount: 850.00,
    status: "pending",
    date: formatDate(today),
    method: "credit",
    type: "single",
    description: "Office lunch service"
  },
  {
    id: "cal-9",
    transactionId: "TODAY-002",
    vendor: "Internet Provider",
    amount: 499.99,
    status: "completed",
    date: formatDate(today),
    method: "bank",
    type: "recurring",
    isRecurring: true,
    nextPaymentDate: formatDate(addDays(today, 30)),
    description: "Monthly internet service payment"
  },
  
  // Same day multiple events
  {
    id: "cal-10",
    transactionId: "MULTI-001",
    vendor: "Office Cleaning",
    amount: 350.00,
    status: "upcoming",
    date: formatDate(addDays(today, 12)),
    method: "bank",
    type: "single",
    scheduledDate: formatDate(addDays(today, 12)),
    description: "Office deep cleaning service"
  },
  {
    id: "cal-11",
    transactionId: "MULTI-002",
    vendor: "IT Support",
    amount: 1500.00,
    status: "upcoming",
    date: formatDate(addDays(today, 12)),
    method: "credit",
    type: "single",
    scheduledDate: formatDate(addDays(today, 12)),
    description: "Monthly IT support service"
  },
  {
    id: "cal-12",
    transactionId: "MULTI-003",
    vendor: "Client Meeting Expenses",
    amount: 450.00,
    status: "pending_approval",
    date: formatDate(addDays(today, 12)),
    method: "credit",
    type: "single",
    description: "Client meeting venue and refreshments",
    initiatedBy: {
      name: "Emily Rodriguez",
      role: "Marketing Director"
    }
  }
];
