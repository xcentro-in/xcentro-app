
import { ArrowUp, ArrowDown } from "lucide-react";

interface SortIndicatorProps {
  field: string;
  sortField: string | null;
  sortDirection: "asc" | "desc";
}

const SortIndicator = ({ field, sortField, sortDirection }: SortIndicatorProps) => {
  return (
    <>
      {sortField === field ? (
        sortDirection === "asc" ? 
        <ArrowUp className="h-3.5 w-3.5 ml-1 text-black" /> : 
        <ArrowDown className="h-3.5 w-3.5 ml-1 text-black" />
      ) : (
        <div className="flex flex-col ml-1 text-black">
          <ArrowUp className="h-2 w-2" />
          <ArrowDown className="h-2 w-2" />
        </div>
      )}
    </>
  );
};

export default SortIndicator;
