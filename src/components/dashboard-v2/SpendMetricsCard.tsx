import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatters";

interface SpendMetricsCardProps {
  title: string;
  value: number;
  subtitle?: string;
  change?: {
    value: number;
    trend: "up" | "down";
  };
  variant?: "default" | "warning";
  delay?: number;
}

const SpendMetricsCard = ({
  title,
  value,
  subtitle,
  change,
  variant = "default",
  delay = 0
}: SpendMetricsCardProps) => {
  return (
    <Card
      className={cn(
        "overflow-hidden animate-scale-in",
        variant === "warning" && "border-amber-500/20 bg-amber-500/5"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="text-3xl font-bold">
          {formatCurrency(value)}
        </div>

        {subtitle && (
          <div className="text-xs text-muted-foreground mt-1">
            {subtitle}
          </div>
        )}

        {change && (
          <div className={cn(
            "flex items-center text-xs mt-2",
            change.trend === "up" && change.value > 0 ? "text-red-500" : "text-green-500"
          )}>
            {change.trend === "up" ? (
              <ArrowUpRight className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-1" />
            )}
            <span>{Math.abs(change.value).toFixed(1)}% from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpendMetricsCard;
