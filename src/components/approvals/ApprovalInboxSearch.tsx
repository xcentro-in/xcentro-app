
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ApprovalInboxSearchProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
}

const ApprovalInboxSearch = ({ searchValue, setSearchValue }: ApprovalInboxSearchProps) => (
  <div className="relative flex-1 sm:w-[200px]">
    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
    <Input
      type="search"
      placeholder="Search transactions..."
      className="w-full pl-9"
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
    />
  </div>
);

export default ApprovalInboxSearch;
