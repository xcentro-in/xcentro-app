
import { CreditCard, BanknoteIcon } from "lucide-react";
import { PaymentMethod } from "@/types/transaction";
import { cn } from "@/lib/utils";

interface TransactionPaymentMethodIconProps {
  method: PaymentMethod;
  className?: string;
  showBackground?: boolean;
  size?: "sm" | "md" | "lg";
}

export const TransactionPaymentMethodIcon = ({
  method,
  className,
  showBackground = true,
  size = "md"
}: TransactionPaymentMethodIconProps) => {
  const getMethodConfig = () => {
    switch (method) {
      case "credit":
        return {
          icon: CreditCard,
          bgClassName: "bg-primary/10",
          iconClassName: "text-primary"
        };
      case "bank":
        return {
          icon: BanknoteIcon,
          bgClassName: "bg-purple-500/10",
          iconClassName: "text-purple-500"
        };
    }
  };

  const { icon: Icon, bgClassName, iconClassName } = getMethodConfig();
  
  const sizeStyles = {
    sm: {
      container: "h-6 w-6",
      icon: "h-3 w-3"
    },
    md: {
      container: "h-8 w-8",
      icon: "h-4 w-4"
    },
    lg: {
      container: "h-10 w-10",
      icon: "h-5 w-5"
    }
  };

  if (showBackground) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-full",
          bgClassName,
          sizeStyles[size].container,
          className
        )}
      >
        <Icon className={cn(iconClassName, sizeStyles[size].icon)} />
      </div>
    );
  }

  return <Icon className={cn(iconClassName, sizeStyles[size].icon, className)} />;
};
