
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TableSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

export const TableSearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Search by invoice, reference or description..." 
}: TableSearchBarProps) => {
  return (
    <div className="mb-4 relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-8"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};
