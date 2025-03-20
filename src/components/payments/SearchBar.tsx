
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const SearchBar = ({ searchValue, onSearchChange }: SearchBarProps) => {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input 
        placeholder="Search payee name..." 
        className="pl-9 h-9 w-full"
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {searchValue && (
        <button 
          className="absolute right-2.5 top-2.5" 
          onClick={() => onSearchChange("")}
        >
          <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
