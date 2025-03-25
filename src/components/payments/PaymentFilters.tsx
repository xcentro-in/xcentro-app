
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PaymentFiltersProps {
  searchValue: string;
  statusFilter: string;
  methodFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onMethodChange: (value: string) => void;
}

export const PaymentFilters = ({
  searchValue,
  onSearchChange,
}: PaymentFiltersProps) => {
  return (
    <div className="relative max-w-md w-full">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input 
        placeholder="Search transactions" 
        className="pl-9 h-9 w-full"
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};
