
import { CreditCard, BanknoteIcon } from "lucide-react";
import { PaymentMethod } from "@/types/transaction";
import { cn } from "@/lib/utils";

interface TransactionPaymentMethodProps {
  method: PaymentMethod;
  variant?: "badge" | "icon";
  className?: string;
  showBackground?: boolean;
  size?: "sm" | "md" | "lg";
}

export const TransactionPaymentMethod = ({
  method,
  variant = "badge",
  className,
  showBackground = true,
  size = "md"
}: TransactionPaymentMethodProps) => {
  const getMethodConfig = () => {
    switch (method) {
      case "credit":
        return {
          icon: CreditCard,
          bgClassName: "bg-primary/10",
          iconClassName: "text-primary",
          label: "Credit Card"
        };
      case "bank":
        return {
          icon: BanknoteIcon,
          bgClassName: "bg-purple-500/10",
          iconClassName: "text-purple-500",
          label: "Bank Transfer"
        };
    }
  };

  const { icon: Icon, bgClassName, iconClassName, label } = getMethodConfig();

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

  if (variant === "badge") {
    return (
      <div className="flex items-center gap-1">
        <Icon className={cn("h-3.5 w-3.5", iconClassName)} />
        <span>{label}</span>
      </div>
    );
  }

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
