
import React from "react";
import { Clock, CreditCard, RefreshCw, AlertTriangle, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import PaymentInsightCard from "@/components/insights/PaymentInsightCard";
import { Transaction } from "@/types/transaction";
import { addDays, parseISO, isBefore, isAfter, format } from "date-fns";

interface PaymentInsightsGridProps {
  transactions: Transaction[];
}

const PaymentInsightsGrid: React.FC<PaymentInsightsGridProps> = ({ transactions }) => {
  const insightStats = {
    dueNext7Days: {
      amount: transactions
        .filter(t => {
          const txDate = parseISO(t.date);
          const next7Days = addDays(new Date(), 7);
          return isBefore(txDate, next7Days) && isAfter(txDate, new Date());
        })
        .reduce((sum, t) => sum + t.amount, 0),
      count: transactions
        .filter(t => {
          const txDate = parseISO(t.date);
          const next7Days = addDays(new Date(), 7);
          return isBefore(txDate, next7Days) && isAfter(txDate, new Date());
        }).length
    },
    cardFriendly: {
      amount: transactions
        .filter(t => t.method === 'credit' || t.vendor.toLowerCase().includes('utility'))
        .reduce((sum, t) => sum + t.amount, 0),
      potential: Math.floor(2500 + Math.random() * 1500)
    },
    recurring: {
      count: transactions.filter(t => t.isRecurring).length,
      thisWeek: transactions.filter(t => {
        const txDate = parseISO(t.date);
        const next7Days = addDays(new Date(), 7);
        return isBefore(txDate, next7Days) && t.isRecurring;
      }).length
    },
    cashIntensive: {
      amount: transactions
        .filter(t => t.amount > 25000 && t.method === 'bank')
        .reduce((sum, t) => sum + t.amount, 0),
      count: transactions.filter(t => t.amount > 25000 && t.method === 'bank').length
    },
    monthToDate: {
      scheduled: transactions
        .filter(t => t.date.startsWith(format(new Date(), 'yyyy-MM')))
        .reduce((sum, t) => sum + t.amount, 0),
      target: 1500000, // 15 lakhs target
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      <PaymentInsightCard
        title="Due in Next 7 Days"
        value={`₹${insightStats.dueNext7Days.amount.toLocaleString()}`}
        description={`across ${insightStats.dueNext7Days.count} vendors`}
        icon={Clock}
        iconColor="text-green-500"
        iconBgColor="bg-green-500/10"
        animationDelay={0}
      />
      
      <PaymentInsightCard
        title="Card-friendly Payouts"
        value={`₹${insightStats.cardFriendly.amount.toLocaleString()}`}
        description={`Earn ${insightStats.cardFriendly.potential} points`}
        icon={CreditCard}
        iconColor="text-blue-500"
        iconBgColor="bg-blue-500/10"
        animationDelay={50}
        accentText={true}
      />
      
      <PaymentInsightCard
        title="Recurring Payments"
        value={`${insightStats.recurring.count} Payments`}
        description={`${insightStats.recurring.thisWeek} auto-scheduled this week`}
        icon={RefreshCw}
        iconColor="text-purple-500"
        iconBgColor="bg-purple-500/10"
        animationDelay={100}
      />
      
      <PaymentInsightCard
        title="Cash-Intensive Week"
        value={`₹${insightStats.cashIntensive.amount.toLocaleString()}`}
        description={`Consider using card for ${Math.min(3, insightStats.cashIntensive.count)} of ${insightStats.cashIntensive.count} payouts`}
        icon={AlertTriangle}
        iconColor="text-amber-500"
        iconBgColor="bg-amber-500/10"
        animationDelay={150}
        accentText={true}
      />
      
      <Card className="animate-scale-in" style={{ animationDelay: "200ms" }}>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <BarChart3 className="h-4 w-4 text-primary" />
                <h3 className="font-medium text-sm">Month-to-Date</h3>
              </div>
              <span className="text-xs text-muted-foreground">
                {Math.round((insightStats.monthToDate.scheduled / insightStats.monthToDate.target) * 100)}%
              </span>
            </div>
            
            <div className="text-2xl font-bold">
              ₹{Math.round(insightStats.monthToDate.scheduled / 100000).toLocaleString()}L
            </div>
            
            <div className="text-xs text-muted-foreground">
              of ₹{Math.round(insightStats.monthToDate.target / 100000)}L target
            </div>
            
            <Progress
              value={(insightStats.monthToDate.scheduled / insightStats.monthToDate.target) * 100}
              className="h-2 mt-1"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentInsightsGrid;
