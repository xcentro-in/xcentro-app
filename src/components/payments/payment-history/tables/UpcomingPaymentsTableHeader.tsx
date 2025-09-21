import { ChevronUp, ChevronDown } from "lucide-react";

interface UpcomingPaymentsTableHeaderProps {
  sortDirection: "asc" | "desc";
  onDateSort: () => void;
}

const UpcomingPaymentsTableHeader = ({ 
  sortDirection,
  onDateSort
}: UpcomingPaymentsTableHeaderProps) => {
  return (
    <div className="grid grid-cols-[1.5fr_1fr_0.8fr_0.8fr_0.8fr] gap-4 p-4 bg-muted/50 text-sm font-medium">
      <div className="flex items-center gap-1">
        Payee Name
      </div>
      <div 
        className="flex items-center gap-1 cursor-pointer hover:text-primary"
        onClick={onDateSort}
      >
        <span>Date & Time</span>
        {sortDirection === "asc" ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </div>
      <div className="flex items-center justify-end gap-1">
        Amount
      </div>
      <div className="flex items-center justify-center gap-1">
        Category
      </div>
      <div className="flex items-center justify-center gap-1">
        Status
      </div>
    </div>
  );
};

export default UpcomingPaymentsTableHeader;