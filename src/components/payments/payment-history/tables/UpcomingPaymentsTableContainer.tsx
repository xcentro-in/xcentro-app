import { CardContent } from "@/components/ui/card";
import { Transaction } from "@/types/transaction";
import UpcomingPaymentsTable from "./UpcomingPaymentsTable";

interface UpcomingPaymentsTableContainerProps {
  transactions: Transaction[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
}

const UpcomingPaymentsTableContainer = ({
  transactions,
  searchValue,
  onSearchChange,
  itemsPerPage,
  onItemsPerPageChange
}: UpcomingPaymentsTableContainerProps) => {
  return (
    <CardContent className="p-6">
      <UpcomingPaymentsTable 
        transactions={transactions}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={onItemsPerPageChange}
      />
    </CardContent>
  );
};

export default UpcomingPaymentsTableContainer;