
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatters";

interface InsightCardProps {
  title: string;
  value: string;
  change: number;
  trend: "up" | "down";
  delay?: number;
}

const InsightCard = ({ title, value, change, trend, delay = 0 }: InsightCardProps) => {
  return (
    <Card className="overflow-hidden animate-scale-in" style={{ animationDelay: `${delay}ms` }}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-2xl font-bold">{formatCurrency(value)}</div>
        <div className={cn(
          "flex items-center text-xs mt-1",
          trend === "up" ? "text-green-500" : "text-red-500"
        )}>
          {trend === "up" ? (
            <ArrowUpRight className="h-3 w-3 mr-1" />
          ) : (
            <ArrowDownRight className="h-3 w-3 mr-1" />
          )}
          <span>{change}% from last month</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightCard;
