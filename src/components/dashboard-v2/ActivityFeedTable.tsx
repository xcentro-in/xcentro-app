import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, XCircle, AlertCircle, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { formatCompactDate } from "@/utils/dateFormatting";
import { getRecentActivity } from "@/data/mockDashboardData";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const ActivityFeedTable = () => {
  const navigate = useNavigate();
  const recentTransactions = getRecentActivity();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-600 text-xs">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Settled
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-500/10 border-amber-500/20 text-amber-600 text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Processing
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-500/10 border-red-500/20 text-red-600 text-xs">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      case "pending_approval":
        return (
          <Badge variant="outline" className="bg-blue-500/10 border-blue-500/20 text-blue-600 text-xs">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pending Approval
          </Badge>
        );
      case "upcoming":
        return (
          <Badge variant="outline" className="bg-purple-500/10 border-purple-500/20 text-purple-600 text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Upcoming
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {status}
          </Badge>
        );
    }
  };

  return (
    <Card className="animate-fade-in" style={{ animationDelay: "150ms" }}>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          <CardDescription>Latest payment transactions</CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-sm h-8 hover:bg-transparent hover:text-primary p-0"
          onClick={() => navigate('/payments')}
        >
          View All <ChevronRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Date
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                  Amount
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  onClick={() => navigate(`/payments/${transaction.id}`)}
                  className={cn(
                    "border-b last:border-0 hover:bg-muted/50 cursor-pointer transition-colors"
                  )}
                >
                  <td className="py-3 px-4 text-sm">
                    {formatCompactDate(transaction.date)}
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold text-right">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {getStatusBadge(transaction.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeedTable;
