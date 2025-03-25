
import { useState } from "react";
import { Transaction } from "@/types/transaction";

export interface UseTransactionTableProps {
  transactions: Transaction[];
  appliedStatusFilter: string;
  appliedMethodFilter: string;
  appliedCategoryFilter: string;
  appliedDateRange: any;
}

export const useTransactionTable = ({
  transactions,
  appliedStatusFilter,
  appliedMethodFilter,
  appliedCategoryFilter,
  appliedDateRange
}: UseTransactionTableProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle sort direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new sort field and default to descending
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Apply filters and sort to transactions
  const filteredAndSortedTransactions = transactions
    .filter(transaction => {
      // Apply search filter
      const matchesSearch = transaction.vendor.toLowerCase().includes(searchValue.toLowerCase());
      
      // Apply status filter
      const matchesStatus = appliedStatusFilter === "all" || transaction.status === appliedStatusFilter;
      
      // Apply method filter
      const matchesMethod = appliedMethodFilter === "all" || transaction.method === appliedMethodFilter;
      
      // Apply category filter - we need to check if category exists on the transaction object
      // This is a temporary fix until the Transaction type is updated to include category
      const matchesCategory = appliedCategoryFilter === "all" || 
        (transaction as any).category === appliedCategoryFilter;
      
      // Date filter would be implemented with actual dates
      // For this mock, we'll assume all transactions match the date filter
      
      return matchesSearch && matchesStatus && matchesMethod && matchesCategory;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      
      if (sortField === "vendor") {
        return sortDirection === "asc" 
          ? a.vendor.localeCompare(b.vendor)
          : b.vendor.localeCompare(a.vendor);
      }
      
      if (sortField === "amount") {
        return sortDirection === "asc" 
          ? a.amount - b.amount
          : b.amount - a.amount;
      }
      
      // For date, we'd compare actual date objects
      // This is simplified for the mock data
      if (sortField === "date") {
        return sortDirection === "asc" ? 1 : -1; // Mock implementation
      }
      
      return 0;
    });

  return {
    searchValue,
    setSearchValue,
    sortField,
    sortDirection,
    itemsPerPage,
    setItemsPerPage,
    handleSort,
    filteredAndSortedTransactions
  };
};
