
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PendingApprovalsBannerProps {
  pendingCount: number;
  urgentCount: number;
}

const PendingApprovalsBanner = ({ pendingCount, urgentCount }: PendingApprovalsBannerProps) => {
  const navigate = useNavigate();
  
  if (pendingCount === 0) return null;
  
  let variant: "default" | "urgent" | "critical" = "default";
  if (urgentCount > 0) variant = "critical";
  else if (pendingCount > 3) variant = "urgent";
  
  return (
    <Alert 
      className={cn(
        "border-l-4 animate-fade-in",
        variant === "default" && "border-l-blue-500 bg-blue-50/50",
        variant === "urgent" && "border-l-amber-500 bg-amber-50/50",
        variant === "critical" && "border-l-red-500 bg-red-50/50"
      )}
    >
      <AlertCircle className={cn(
        "h-5 w-5",
        variant === "default" && "text-blue-500",
        variant === "urgent" && "text-amber-500",
        variant === "critical" && "text-red-500"
      )} />
      <div className="flex-1">
        <AlertTitle className={cn(
          variant === "default" && "text-blue-700",
          variant === "urgent" && "text-amber-700",
          variant === "critical" && "text-red-700"
        )}>
          {urgentCount > 0 ? "Urgent Approvals Required" : "Transaction Approvals Pending"}
        </AlertTitle>
        <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <span className="font-semibold">{pendingCount}</span> 
            {pendingCount === 1 ? " transaction requires" : " transactions require"} your approval
            {urgentCount > 0 && <span className="font-medium text-red-600"> ({urgentCount} urgent)</span>}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className={cn(
              "gap-1 h-8 self-start",
              variant === "default" && "border-blue-200 bg-blue-100/50 text-blue-700 hover:bg-blue-100",
              variant === "urgent" && "border-amber-200 bg-amber-100/50 text-amber-700 hover:bg-amber-100",
              variant === "critical" && "border-red-200 bg-red-100/50 text-red-700 hover:bg-red-100",
            )}
            onClick={() => navigate("/approvals")}
          >
            View Approvals
            <ChevronRight className="h-4 w-4" />
          </Button>
        </AlertDescription>
      </div>
    </Alert>
  );
};

export default PendingApprovalsBanner;
