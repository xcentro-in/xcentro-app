
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, ChevronRight } from "lucide-react";

interface PendingApprovalsBannerProps {
  pendingCount: number;
}

const PendingApprovalsBanner = ({ pendingCount }: PendingApprovalsBannerProps) => {
  const navigate = useNavigate();

  if (pendingCount === 0) return null;

  return (
    <Alert className="border-l-4 border-l-blue-500 bg-blue-50/50 animate-fade-in">
      <AlertCircle className="h-5 w-5 text-blue-500" />
      <div className="flex-1">
        <AlertTitle className="text-blue-700">
          Approvals Pending
        </AlertTitle>
        <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <span className="font-semibold">{pendingCount}</span>
            {pendingCount === 1 ? " approval pending" : " approvals pending"}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1 h-8 self-start border-blue-200 bg-blue-100/50 text-blue-700 hover:bg-blue-100"
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
