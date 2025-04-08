
import { Plane, Building2, Gift, RefreshCcw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type RedemptionTypeIconProps = {
  type: string;
};

export const RedemptionTypeIcon = ({ type }: RedemptionTypeIconProps) => {
  let icon;
  
  switch(type) {
    case "Flight":
      icon = <Plane className="h-5 w-5 text-blue-500" />;
      break;
    case "Hotel":
      icon = <Building2 className="h-5 w-5 text-indigo-500" />;
      break;
    case "Gift Card":
      icon = <Gift className="h-5 w-5 text-amber-500" />;
      break;
    case "Transfer":
      icon = <RefreshCcw className="h-5 w-5 text-green-500" />;
      break;
    default:
      return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">
            {icon}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{type}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
