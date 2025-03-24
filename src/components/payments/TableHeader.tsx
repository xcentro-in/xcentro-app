
import { CreditCard, BanknoteIcon } from "lucide-react";
import SortIndicator from "./SortIndicator";

interface TableHeaderProps {
  sortField: string | null;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
}

const TableHeader = ({ sortField, sortDirection, onSort }: TableHeaderProps) => {
  return (
    <div className="grid grid-cols-[1.5fr_1fr_0.8fr_0.8fr_0.8fr] gap-4 p-4 bg-muted/50 text-sm font-medium">
      <div 
        className="flex items-center gap-1 cursor-pointer"
        onClick={() => onSort("vendor")}
      >
        Payee Name
        <SortIndicator field="vendor" sortField={sortField} sortDirection={sortDirection} />
      </div>
      <div 
        className="flex items-center gap-1 cursor-pointer"
        onClick={() => onSort("date")}
      >
        Date & Time
        <SortIndicator field="date" sortField={sortField} sortDirection={sortDirection} />
      </div>
      <div 
        className="flex items-center gap-1 cursor-pointer justify-end"
        onClick={() => onSort("amount")}
      >
        Amount
        <SortIndicator field="amount" sortField={sortField} sortDirection={sortDirection} />
      </div>
      <div className="text-center">Category</div>
      <div className="text-center">Status</div>
    </div>
  );
};

export default TableHeader;
