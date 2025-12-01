import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";
import { CalendarX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface UpcomingPayment {
  id: number;
  vendor: string;
  amount: number;
  dueDate: string;
  daysRemaining: number;
}

interface UpcomingLargePaymentsCardProps {
  upcomingPayments?: UpcomingPayment[];
}

const UpcomingLargePaymentsCard = ({ upcomingPayments = [] }: UpcomingLargePaymentsCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden animate-scale-in" style={{ animationDelay: "100ms" }}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Large Payments</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        {upcomingPayments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <div className="rounded-full bg-muted/50 p-2 mb-2">
              <CalendarX className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">No upcoming large payments</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingPayments.map(payment => (
              <div key={payment.id} className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{payment.vendor}</div>
                  <div className="text-xs text-muted-foreground">Due {payment.dueDate} ({payment.daysRemaining} days)</div>
                </div>
                <div className="text-sm font-semibold">{formatCurrency(payment.amount)}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingLargePaymentsCard;