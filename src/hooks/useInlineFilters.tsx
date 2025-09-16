import { useState, useMemo } from "react";
import { DateRange } from "react-day-picker";
import { Transaction } from "@/types/transaction";
import { subDays, startOfQuarter, isWithinInterval } from "date-fns";
import { parseTransactionDate } from "@/utils/parseTransactionDate";

export const useInlineFilters = (transactions: Transaction[] = []) => {
  // Default filters - all categories and statuses selected, last 7 days for date
  const [categoryFilter, setCategoryFilter] = useState<string[]>(["vendor", "supplier", "biller", "payroll"]);
  const [statusFilter, setStatusFilter] = useState<string[]>(["completed", "pending", "upcoming", "failed"]);
  const [dateFilter, setDateFilter] = useState<string[]>(["7days"]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [methodFilter, setMethodFilter] = useState<string[]>(["upi", "bank_transfer", "credit_card", "debit_card"]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      // Category filter
      if (categoryFilter.length > 0 && transaction.category && !categoryFilter.includes(transaction.category)) {
        return false;
      }

      // Status filter
      if (statusFilter.length > 0 && !statusFilter.includes(transaction.status)) {
        return false;
      }

      // Method filter
      if (methodFilter.length > 0 && transaction.method && !methodFilter.includes(transaction.method)) {
        return false;
      }

      // Date filter
      if (dateFilter.length > 0) {
        const parsed = parseTransactionDate(transaction.date as any);
        const transactionDate = parsed ?? new Date();
        const today = new Date();

        if (dateFilter.includes("7days")) {
          const sevenDaysAgo = subDays(today, 7);
          if (!isWithinInterval(transactionDate, { start: sevenDaysAgo, end: today })) {
            return false;
          }
        } else if (dateFilter.includes("30days")) {
          const thirtyDaysAgo = subDays(today, 30);
          if (!isWithinInterval(transactionDate, { start: thirtyDaysAgo, end: today })) {
            return false;
          }
        } else if (dateFilter.includes("quarter")) {
          const quarterStart = startOfQuarter(today);
          if (!isWithinInterval(transactionDate, { start: quarterStart, end: today })) {
            return false;
          }
        } else if (dateFilter.includes("custom") && dateRange?.from) {
          const start = dateRange.from;
          const end = dateRange.to || today;
          if (!isWithinInterval(transactionDate, { start, end })) {
            return false;
          }
        }
      }

      return true;
    });
  }, [transactions, categoryFilter, statusFilter, dateFilter, dateRange, methodFilter]);

  return {
    filteredTransactions,
    categoryFilter,
    statusFilter,
    dateFilter,
    dateRange,
    methodFilter,
    setCategoryFilter,
    setStatusFilter,
    setDateFilter,
    setDateRange,
    setMethodFilter
  };
};