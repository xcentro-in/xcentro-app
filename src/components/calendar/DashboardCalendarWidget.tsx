
import React from "react";
import { format, isToday, isTomorrow, addDays, isThisWeek, isAfter } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types/transaction";
import { CalendarIcon, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardCalendarWidgetProps {
  transactions: Transaction[];
}

const DashboardCalendarWidget: React.FC<DashboardCalendarWidgetProps> = ({ 
  transactions 
}) => {
  const navigate = useNavigate();
  const today = new Date();
  
  // Get upcoming transactions for the next 7 days
  const upcomingTransactions = transactions
    .filter(transaction => {
      const transactionDate = transaction.scheduledDate 
        ? new Date(transaction.scheduledDate) 
        : new Date(transaction.date);
      
      return (
        (transaction.status === 'upcoming' || transaction.status === 'pending') &&
        isAfter(transactionDate, today) &&
        isThisWeek(transactionDate, { weekStartsOn: 0 })
      );
    })
    .sort((a, b) => {
      const dateA = a.scheduledDate ? new Date(a.scheduledDate) : new Date(a.date);
      const dateB = b.scheduledDate ? new Date(b.scheduledDate) : new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 4);

  const getDateLabel = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "EEE, MMM d");
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          Upcoming Payments
        </CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingTransactions.length === 0 ? (
          <div className="text-center text-muted-foreground py-6">
            <p>No upcoming payments this week</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingTransactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between p-3 rounded-md border border-border hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer"
                onClick={() => navigate(`/payments/${transaction.id}`)}
              >
                <div>
                  <div className="font-medium">{transaction.vendor}</div>
                  <div className="text-xs text-muted-foreground">
                    {getDateLabel(transaction.scheduledDate || transaction.date)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    ${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {transaction.method === 'credit' ? 'Credit Card' : 'Bank Transfer'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1 w-full mt-4 text-primary hover:text-primary hover:bg-primary/5"
          onClick={() => navigate('/payment-calendar')}
        >
          View Full Calendar <ChevronRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default DashboardCalendarWidget;
