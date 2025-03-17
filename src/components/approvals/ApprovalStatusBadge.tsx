
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  X, 
  Flag, 
  PenLine, 
  AlertTriangle, 
  Clock 
} from "lucide-react";

interface ApprovalStatusBadgeProps {
  status: string;
}

const ApprovalStatusBadge = ({ status }: ApprovalStatusBadgeProps) => {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="bg-blue-500/10 border-blue-500/20 text-blue-600 text-xs">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    case "urgent":
      return (
        <Badge variant="outline" className="bg-red-500/10 border-red-500/20 text-red-600 text-xs">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Urgent
        </Badge>
      );
    case "flagged":
      return (
        <Badge variant="outline" className="bg-amber-500/10 border-amber-500/20 text-amber-600 text-xs">
          <Flag className="h-3 w-3 mr-1" />
          Flagged
        </Badge>
      );
    case "approved":
      return (
        <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-600 text-xs">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="outline" className="bg-red-500/10 border-red-500/20 text-red-600 text-xs">
          <X className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      );
    case "changes_requested":
      return (
        <Badge variant="outline" className="bg-amber-500/10 border-amber-500/20 text-amber-600 text-xs">
          <PenLine className="h-3 w-3 mr-1" />
          Changes Requested
        </Badge>
      );
    default:
      return null;
  }
};

export default ApprovalStatusBadge;
