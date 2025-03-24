
import { CreditCard, BanknoteIcon } from "lucide-react";
import { PaymentMethod } from "@/types/transaction";
import { cn } from "@/lib/utils";

interface TransactionMethodBadgeProps {
  method: PaymentMethod;
}

export const TransactionMethodBadge = ({ method }: TransactionMethodBadgeProps) => {
  switch (method) {
    case "credit":
      return (
        <div className="flex items-center gap-1">
          <CreditCard className="h-3.5 w-3.5 text-primary" />
          <span>Credit Card</span>
        </div>
      );
    case "bank":
      return (
        <div className="flex items-center gap-1">
          <BanknoteIcon className="h-3.5 w-3.5 text-purple-500" />
          <span>Bank Transfer</span>
        </div>
      );
    default:
      return <span>{method}</span>;
  }
};
