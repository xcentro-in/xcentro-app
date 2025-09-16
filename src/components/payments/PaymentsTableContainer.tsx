
import { CardContent } from "@/components/ui/card";
import { Transaction } from "@/types/transaction";
import TransactionsTable from "./TransactionsTable";

interface PaymentsTableContainerProps {
  transactions: Transaction[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
}

const PaymentsTableContainer = ({
  transactions,
  searchValue,
  onSearchChange,
  itemsPerPage,
  onItemsPerPageChange
}: PaymentsTableContainerProps) => {
  return (
    <CardContent className="p-6">
      <TransactionsTable 
        transactions={transactions}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={onItemsPerPageChange}
      />
    </CardContent>
  );
};

export default PaymentsTableContainer;
