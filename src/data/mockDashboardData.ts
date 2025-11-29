import { Transaction } from "@/types/transaction";
import { mockCalendarTransactions } from "./mockCalendarEvents";
import { startOfMonth, endOfMonth, subMonths, isWithinInterval, addDays, format } from "date-fns";

const today = new Date();

// Get current month's completed transactions
export const getCurrentMonthSpend = () => {
  const start = startOfMonth(today);
  const end = endOfMonth(today);

  return mockCalendarTransactions
    .filter(t => {
      const txDate = new Date(t.date);
      return t.status === "completed" && isWithinInterval(txDate, { start, end });
    })
    .reduce((sum, t) => sum + t.amount, 0);
};

// Get last month's completed transactions
export const getLastMonthSpend = () => {
  const lastMonth = subMonths(today, 1);
  const start = startOfMonth(lastMonth);
  const end = endOfMonth(lastMonth);

  return mockCalendarTransactions
    .filter(t => {
      const txDate = new Date(t.date);
      return t.status === "completed" && isWithinInterval(txDate, { start, end });
    })
    .reduce((sum, t) => sum + t.amount, 0);
};

// Get pending settlements (pending + pending_approval)
export const getPendingSettlements = () => {
  const pending = mockCalendarTransactions.filter(
    t => t.status === "pending" || t.status === "pending_approval"
  );

  const total = pending.reduce((sum, t) => sum + t.amount, 0);

  return {
    total,
    count: pending.length,
    transactions: pending
  };
};

// Get upcoming large payments (next 2 weeks, amount > 5000)
export const getUpcomingLargePayments = () => {
  const twoWeeksFromNow = addDays(today, 14);

  return mockCalendarTransactions
    .filter(t => {
      const txDate = new Date(t.date);
      return (
        (t.status === "upcoming" || t.status === "pending") &&
        txDate >= today &&
        txDate <= twoWeeksFromNow &&
        t.amount >= 5000
      );
    })
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);
};

// Get recent activity (last 6 transactions)
export const getRecentActivity = (): Transaction[] => {
  return [...mockCalendarTransactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);
};

// Get monthly spend for last 6 months (for chart)
export const getMonthlySpendData = () => {
  const months = [];

  for (let i = 5; i >= 0; i--) {
    const monthDate = subMonths(today, i);
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);

    const spent = mockCalendarTransactions
      .filter(t => {
        const txDate = new Date(t.date);
        return t.status === "completed" && isWithinInterval(txDate, { start, end });
      })
      .reduce((sum, t) => sum + t.amount, 0);

    months.push({
      month: format(monthDate, "MMM"),
      spent: spent
    });
  }

  return months;
};

// Get expenses grouped by credit cards (this month)
export const getCreditCardExpenses = () => {
  const start = startOfMonth(today);
  const end = endOfMonth(today);

  // Get this month's completed credit card transactions
  const creditCardTransactions = mockCalendarTransactions.filter(t => {
    const txDate = new Date(t.date);
    return (
      t.status === "completed" &&
      t.method === "credit" &&
      isWithinInterval(txDate, { start, end }) &&
      t.accountDetails?.cardProvider &&
      t.accountDetails?.cardLast4
    );
  });

  // Group by card
  const cardGroups: Record<string, number> = {};

  creditCardTransactions.forEach(t => {
    const cardKey = `${t.accountDetails?.cardProvider} ****${t.accountDetails?.cardLast4}`;
    cardGroups[cardKey] = (cardGroups[cardKey] || 0) + t.amount;
  });

  // Convert to array format for pie chart
  return Object.entries(cardGroups).map(([name, value]) => ({
    name,
    value
  }));
};
