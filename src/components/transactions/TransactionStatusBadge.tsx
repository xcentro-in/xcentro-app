
import { Badge } from "@/components/ui/badge";
import { TransactionStatus } from "@/types/transaction";
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  HourglassIcon,
  CheckCheck,
  X,
  BanIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionStatusBadgeProps {
  status: TransactionStatus;
  className?: string;
  showText?: boolean;
  size?: "sm" | "default";
}

export const TransactionStatusBadge = ({
  status,
  className,
  showText = true,
  size = "default"
}: TransactionStatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case "completed":
        return {
          icon: CheckCircle2,
          text: "Completed",
          className: "bg-green-500/10 border-green-500/20 text-green-600"
        };
      case "pending":
        return {
          icon: Clock,
          text: "Pending",
          className: "bg-amber-500/10 border-amber-500/20 text-amber-600"
        };
      case "upcoming":
        return {
          icon: Clock,
          text: "Upcoming",
          className: "bg-blue-500/10 border-blue-500/20 text-blue-600"
        };
      case "failed":
        return {
          icon: XCircle,
          text: "Failed",
          className: "bg-red-500/10 border-red-500/20 text-red-600"
        };
      case "pending_approval":
        return {
          icon: HourglassIcon,
          text: "Pending Approval",
          className: "bg-amber-500/10 border-amber-500/20 text-amber-600"
        };
      case "approved":
        return {
          icon: CheckCheck,
          text: "Approved",
          className: "bg-green-500/10 border-green-500/20 text-green-600"
        };
      case "rejected":
        return {
          icon: X,
          text: "Rejected",
          className: "bg-red-500/10 border-red-500/20 text-red-600"
        };
      case "cancelled":
        return {
          icon: BanIcon,
          text: "Cancelled",
          className: "bg-gray-500/10 border-gray-500/20 text-gray-600"
        };
      default:
        return {
          icon: AlertCircle,
          text: status,
          className: "bg-gray-500/10 border-gray-500/20 text-gray-600"
        };
    }
  };

  const { icon: Icon, text, className: statusClassName } = getStatusConfig();
  
  const sizeStyles = size === "sm" 
    ? "text-[10px] px-1.5 py-0" 
    : "text-xs";

  return (
    <Badge
      variant="outline"
      className={cn(statusClassName, sizeStyles, className)}
    >
      <Icon className={cn("h-3 w-3 mr-1", !showText && "mr-0")} />
      {showText && text}
    </Badge>
  );
};
