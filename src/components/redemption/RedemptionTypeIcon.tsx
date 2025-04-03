
import { Plane, Building2, Gift, RefreshCcw } from "lucide-react";

type RedemptionTypeIconProps = {
  type: string;
};

export const RedemptionTypeIcon = ({ type }: RedemptionTypeIconProps) => {
  switch(type) {
    case "Flight":
      return <Plane className="h-5 w-5 text-blue-500" />;
    case "Hotel":
      return <Building2 className="h-5 w-5 text-indigo-500" />;
    case "Gift Card":
      return <Gift className="h-5 w-5 text-amber-500" />;
    case "Transfer":
      return <RefreshCcw className="h-5 w-5 text-green-500" />;
    default:
      return null;
  }
};
