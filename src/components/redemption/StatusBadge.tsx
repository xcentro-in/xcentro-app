
import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  status: string;
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  let variant: "default" | "destructive" | "outline" | "secondary" | null = null;
  
  switch(status) {
    case "Successful":
      variant = "default";
      break;
    case "Failed":
      variant = "destructive";
      break;
    case "Processing":
      variant = "secondary";
      break;
    default:
      variant = "outline";
  }
  
  return <Badge variant={variant}>{status}</Badge>;
};
