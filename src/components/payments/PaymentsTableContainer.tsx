
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardContent } from "@/components/ui/card";
import { Transaction } from "@/types/transaction";
import TransactionsTable from "./TransactionsTable";

interface PaymentsTableContainerProps {
  transactions: Transaction[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  sortField: string | null;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
}

const PaymentsTableContainer = ({
  transactions,
  searchValue,
  onSearchChange,
  sortField,
  sortDirection,
  onSort,
  itemsPerPage,
  onItemsPerPageChange
}: PaymentsTableContainerProps) => {
  const navigate = useNavigate();
  
  // Handle transaction row click
  const handleTransactionClick = (transactionId: number) => {
    navigate(`/payments/${transactionId}`);
  };

  return (
    <CardContent>
      <TransactionsTable 
        transactions={transactions}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={onSort}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={onItemsPerPageChange}
      />
    </CardContent>
  );
};

export default PaymentsTableContainer;
