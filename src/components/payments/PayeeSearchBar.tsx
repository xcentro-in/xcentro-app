
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PayeeSearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const PayeeSearchBar = ({ searchTerm, setSearchTerm }: PayeeSearchBarProps) => {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search payees..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-9"
      />
    </div>
  );
};

export default PayeeSearchBar;
