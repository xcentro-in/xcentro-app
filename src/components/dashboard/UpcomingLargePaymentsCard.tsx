import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formatCurrency = (amount) => {
  // Assumes amount is a number.  Error handling could be added.
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(amount.replace(/[^0-9.]/g, '')));
};

const UpcomingLargePaymentsCard = () => {
  // This would typically be data fetched from an API
  const upcomingPayments = [
    {
      id: 1,
      vendor: "Office Rent",
      amount: "$8,500",
      dueDate: "Aug 15",
      daysRemaining: 3
    },
    {
      id: 2,
      vendor: "Cloud Infrastructure",
      amount: "$2,450",
      dueDate: "Aug 18",
      daysRemaining: 6
    }
  ];

  return (
    <Card className="overflow-hidden animate-scale-in" style={{ animationDelay: "100ms" }}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Large Payments</CardTitle>
      </CardHeader>
      <CardContent className="pb-2 space-y-3">
        {upcomingPayments.map(payment => (
          <div key={payment.id} className="flex justify-between items-center">
            <div>
              <div className="font-medium">{payment.vendor}</div>
              <div className="text-xs text-muted-foreground">Due {payment.dueDate} ({payment.daysRemaining} days)</div>
            </div>
            <div className="text-sm font-semibold">{formatCurrency(payment.amount)}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default UpcomingLargePaymentsCard;