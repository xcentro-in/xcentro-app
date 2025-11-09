import { Transaction } from '@/types/transaction';

// Simple mock payment history data for backend API simulation
export const mockPaymentHistory: Transaction[] = [
  {
    id: 1,
    transactionId: "TRX001",
    vendor: "Office Supplies Co.",
    amount: 2499.99,
    status: "completed",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    method: "credit",
    type: "single",
    category: "vendor" as any,
    description: "Monthly office supplies order"
  },
  {
    id: 2,
    transactionId: "TRX002",
    vendor: "Cloud Services",
    amount: 899.00,
    status: "completed",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    method: "bank",
    type: "single",
    category: "supplier" as any,
    description: "AWS hosting services"
  },
  {
    id: 3,
    transactionId: "TRX003",
    vendor: "Marketing Agency",
    amount: 5999.99,
    status: "pending",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    method: "credit",
    type: "single",
    category: "vendor" as any,
    description: "Digital marketing campaign"
  },
  {
    id: 4,
    transactionId: "TRX004",
    vendor: "John Smith",
    amount: 8500.00,
    status: "completed",
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    method: "bank",
    type: "single",
    category: "payroll" as any,
    description: "Monthly salary payment"
  },
  {
    id: 5,
    transactionId: "TRX005",
    vendor: "IT Support",
    amount: 1299.50,
    status: "failed",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    method: "credit",
    type: "single",
    category: "supplier" as any,
    description: "Technical support services"
  },
  {
    id: 6,
    transactionId: "TRX006",
    vendor: "Office Furniture",
    amount: 4750.25,
    status: "completed",
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    method: "bank",
    type: "single",
    category: "vendor" as any,
    description: "Ergonomic office chairs"
  },
  {
    id: 7,
    transactionId: "TRX007",
    vendor: "Internet Provider",
    amount: 499.99,
    status: "completed",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    method: "bank",
    type: "recurring",
    category: "biller" as any,
    description: "Monthly internet bill"
  },
  {
    id: 8,
    transactionId: "TRX008",
    vendor: "Legal Consultancy",
    amount: 12000.00,
    status: "completed",
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    method: "credit",
    type: "single",
    category: "vendor" as any,
    description: "Legal advisory services"
  },
  {
    id: 9,
    transactionId: "TRX009",
    vendor: "Electricity Board",
    amount: 2400.80,
    status: "completed",
    date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    method: "bank",
    type: "single",
    category: "biller" as any,
    description: "Electricity bill payment"
  },
  {
    id: 10,
    transactionId: "TRX010",
    vendor: "Software License Co.",
    amount: 15000.00,
    status: "completed",
    date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    method: "credit",
    type: "single",
    category: "vendor" as any,
    description: "Annual software licenses"
  }
];