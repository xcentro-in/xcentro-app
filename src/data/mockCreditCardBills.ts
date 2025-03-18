
import { CreditCardBill } from "@/types/credit-card-bill";
import { addDays } from "date-fns";

// Function to get formatted date strings
const getDateString = (daysFromNow: number) => {
  return addDays(new Date(), daysFromNow).toISOString().split('T')[0];
};

export const mockCreditCardBills: CreditCardBill[] = [
  {
    id: "ccb-001",
    cardIssuer: "HDFC Bank",
    lastFourDigits: "1234",
    totalDueAmount: 50000,
    minimumDueAmount: 5000,
    dueDate: getDateString(5),
    status: "pending",
    latePaymentCharges: 900,
    interestRate: 3.5,
    statementDate: getDateString(-15),
    billPeriod: "Feb 01 - Feb 28, 2024"
  },
  {
    id: "ccb-002",
    cardIssuer: "ICICI Bank",
    lastFourDigits: "9876",
    totalDueAmount: 30000,
    minimumDueAmount: 3000,
    dueDate: getDateString(10),
    status: "pending",
    latePaymentCharges: 700,
    interestRate: 3.75,
    statementDate: getDateString(-10),
    billPeriod: "Feb 05 - Mar 04, 2024"
  },
  {
    id: "ccb-003",
    cardIssuer: "SBI Card",
    lastFourDigits: "5678",
    totalDueAmount: 40000,
    minimumDueAmount: 4000,
    dueDate: getDateString(-2),
    status: "overdue",
    latePaymentCharges: 850,
    interestRate: 3.25,
    statementDate: getDateString(-20),
    billPeriod: "Jan 25 - Feb 24, 2024"
  },
  {
    id: "ccb-004",
    cardIssuer: "Axis Bank",
    lastFourDigits: "4321",
    totalDueAmount: 25000,
    minimumDueAmount: 2500,
    dueDate: getDateString(15),
    status: "pending",
    latePaymentCharges: 600,
    interestRate: 3.35,
    statementDate: getDateString(-8),
    billPeriod: "Feb 10 - Mar 09, 2024"
  },
  {
    id: "ccb-005",
    cardIssuer: "Citibank",
    lastFourDigits: "6543",
    totalDueAmount: 75000,
    minimumDueAmount: 7500,
    dueDate: getDateString(-10),
    status: "paid",
    latePaymentCharges: 1200,
    interestRate: 3.8,
    statementDate: getDateString(-30),
    billPeriod: "Jan 15 - Feb 14, 2024",
    isPaid: true
  }
];
