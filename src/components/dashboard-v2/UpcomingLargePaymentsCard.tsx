import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { formatCompactDate } from "@/utils/dateFormatting";
import { cn } from "@/lib/utils";

interface UpcomingLargePaymentsCardProps {
  payments: Array<{
    id: string;
    vendor: string;
    amount: number;
    date: string;
  }>;
}

const UpcomingLargePaymentsCard = ({ payments }: UpcomingLargePaymentsCardProps) => {
  const upcomingPayments = payments;

  return (
    <Card className="overflow-hidden animate-scale-in" style={{ animationDelay: "100ms" }}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Upcoming Large Payments
        </CardTitle>
        <CardDescription className="text-xs">
          Next 2 weeks
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        {upcomingPayments.length === 0 ? (
          <div className="text-sm text-muted-foreground py-4 text-center">
            No large payments upcoming
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingPayments.map((payment, index) => (
              <div
                key={payment.id}
                className={cn(
                  "flex items-center justify-between pb-3",
                  index < upcomingPayments.length - 1 && "border-b"
                )}
              >
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {payment.vendor}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatCompactDate(payment.date)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm">
                    {formatCurrency(payment.amount)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingLargePaymentsCard;
