
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ApprovalFiltersProps {
  statusFilter: string;
  amountFilter: string;
  dateFilter: string;
  onStatusChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onDateChange: (value: string) => void;
}

const ApprovalFilters = ({
  statusFilter,
  amountFilter,
  dateFilter,
  onStatusChange,
  onAmountChange,
  onDateChange
}: ApprovalFiltersProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-10 gap-2">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Filter Transactions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span>Status</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem 
                  className={statusFilter === "all" ? "bg-muted" : ""}
                  onClick={() => onStatusChange("all")}
                >
                  All Statuses
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={statusFilter === "pending" ? "bg-muted" : ""}
                  onClick={() => onStatusChange("pending")}
                >
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={statusFilter === "urgent" ? "bg-muted" : ""}
                  onClick={() => onStatusChange("urgent")}
                >
                  Urgent
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={statusFilter === "flagged" ? "bg-muted" : ""}
                  onClick={() => onStatusChange("flagged")}
                >
                  Flagged
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={statusFilter === "approved" ? "bg-muted" : ""}
                  onClick={() => onStatusChange("approved")}
                >
                  Approved
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={statusFilter === "rejected" ? "bg-muted" : ""}
                  onClick={() => onStatusChange("rejected")}
                >
                  Rejected
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={statusFilter === "changes_requested" ? "bg-muted" : ""}
                  onClick={() => onStatusChange("changes_requested")}
                >
                  Changes Requested
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span>Amount</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem 
                  className={amountFilter === "all" ? "bg-muted" : ""}
                  onClick={() => onAmountChange("all")}
                >
                  All Amounts
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={amountFilter === "under1k" ? "bg-muted" : ""}
                  onClick={() => onAmountChange("under1k")}
                >
                  Under $1,000
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={amountFilter === "1kto5k" ? "bg-muted" : ""}
                  onClick={() => onAmountChange("1kto5k")}
                >
                  $1,000 to $5,000
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={amountFilter === "over5k" ? "bg-muted" : ""}
                  onClick={() => onAmountChange("over5k")}
                >
                  Over $5,000
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span>Date</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem 
                  className={dateFilter === "all" ? "bg-muted" : ""}
                  onClick={() => onDateChange("all")}
                >
                  All Dates
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={dateFilter === "today" ? "bg-muted" : ""}
                  onClick={() => onDateChange("today")}
                >
                  Today
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={dateFilter === "yesterday" ? "bg-muted" : ""}
                  onClick={() => onDateChange("yesterday")}
                >
                  Yesterday
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={dateFilter === "this_week" ? "bg-muted" : ""}
                  onClick={() => onDateChange("this_week")}
                >
                  This Week
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={dateFilter === "older" ? "bg-muted" : ""}
                  onClick={() => onDateChange("older")}
                >
                  Older
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => {
          onStatusChange("all");
          onAmountChange("all");
          onDateChange("all");
        }}>
          Reset Filters
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ApprovalFilters;
