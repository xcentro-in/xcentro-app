
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentInsightCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  animationDelay?: number;
  accentText?: boolean;
}

const PaymentInsightCard: React.FC<PaymentInsightCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  iconColor,
  iconBgColor,
  animationDelay = 0,
  accentText = false,
}) => {
  return (
    <Card className="animate-scale-in" style={{ animationDelay: `${animationDelay}ms` }}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className={cn("h-10 w-10 rounded-md flex items-center justify-center", iconBgColor)}>
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
        </div>
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="text-2xl font-bold mt-1">{value}</div>
        <p className={cn(
          "text-xs mt-1",
          accentText ? iconColor : "text-muted-foreground"
        )}>
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default PaymentInsightCard;
