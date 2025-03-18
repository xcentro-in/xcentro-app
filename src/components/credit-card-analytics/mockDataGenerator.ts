
import { mockCreditCardBills } from "@/data/mockCreditCardBills";
import { CardData } from "./utils/chartDataHelpers";

const EXPENSE_CATEGORIES = [
  "Rent",
  "Vendors",
  "Travel",
  "Office Supplies",
  "Utilities",
  "Entertainment",
];

// Mock data generation
export const generateMockCardSpendData = (): CardData[] => {
  return mockCreditCardBills.map((bill, index) => ({
    cardName: `${bill.cardIssuer} (${bill.lastFourDigits})`,
    totalSpend: Math.floor(Math.random() * 200000) + 100000,
    rewardsEarned: Math.floor(Math.random() * 5000) + 1000,
    lateFees: Math.floor(Math.random() * 2000),
    interestCharged: Math.floor(Math.random() * 3000),
    otherPenalties: Math.floor(Math.random() * 1000),
    utilizationRate: Math.floor(Math.random() * 80) + 20,
    categories: EXPENSE_CATEGORIES.map(category => ({
      name: category,
      value: Math.floor(Math.random() * 50000) + 10000,
    })),
    latePaymentHistory: Array.from({ length: 6 }, (_, i) => ({
      month: i + 1,
      fees: Math.floor(Math.random() * 1000),
    })),
    cardIndex: index,
  }));
};
