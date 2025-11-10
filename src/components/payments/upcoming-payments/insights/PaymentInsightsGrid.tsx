
import React from "react";
import { Clock, CreditCard, RefreshCw, AlertTriangle, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import PaymentInsightCard from "@/components/insights/PaymentInsightCard";
import { usePaymentInsights } from "@/hooks/usePaymentInsights";

interface PaymentInsightsGridProps {}

const PaymentInsightsGrid: React.FC<PaymentInsightsGridProps> = () => {
  const { insights, isLoading, error } = usePaymentInsights();

  // Show loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {[...Array(5)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-16 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Show error state
  if (error || !insights) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <Card className="col-span-full">
          <CardContent className="p-6 text-center">
            <div className="text-muted-foreground">
              {error || 'Unable to load payment insights'}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Helper to safely render month-to-date card with validation
  const renderMonthToDateCard = () => {
    const monthData = insights.monthToDate;

    // Validate required data for this specific card
    if (!monthData ||
        typeof monthData.scheduled !== 'number' ||
        typeof monthData.target !== 'number' ||
        monthData.scheduled < 0 ||
        monthData.target <= 0) {
      return null; // Don't render if invalid data
    }

    const progressPercentage = monthData.progressPercentage ||
                               Math.round((monthData.scheduled / monthData.target) * 100);

    return (
      <Card className="animate-scale-in" style={{ animationDelay: "200ms" }}>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <BarChart3 className="h-4 w-4 text-primary" />
                <h3 className="font-medium text-sm">Month-to-Date</h3>
              </div>
              <span className="text-xs text-muted-foreground">
                {Math.round(progressPercentage)}%
              </span>
            </div>

            <div className="text-2xl font-bold">
              ₹{Math.round(monthData.scheduled / 100000).toLocaleString()}L
            </div>

            <div className="text-xs text-muted-foreground">
              of ₹{Math.round(monthData.target / 100000)}L target
            </div>

            <Progress
              value={progressPercentage}
              className="h-2 mt-1"
            />
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {/* Each card validates its own data and renders only if valid */}

      {insights.dueNext7Days && (
        <PaymentInsightCard
          title="Due in Next 7 Days"
          value={`₹${insights.dueNext7Days.amount?.toLocaleString() || '0'}`}
          description={insights.dueNext7Days.count ? `across ${insights.dueNext7Days.count} vendors` : undefined}
          icon={Clock}
          iconColor="text-green-500"
          iconBgColor="bg-green-500/10"
          animationDelay={0}
        />
      )}

      {insights.cardFriendly && (
        <PaymentInsightCard
          title="Card-friendly Payouts"
          value={`₹${insights.cardFriendly.amount?.toLocaleString() || '0'}`}
          description={insights.cardFriendly.potentialPoints ? `Earn ${insights.cardFriendly.potentialPoints} points` : undefined}
          icon={CreditCard}
          iconColor="text-blue-500"
          iconBgColor="bg-blue-500/10"
          animationDelay={50}
          accentText={true}
        />
      )}

      {insights.recurring && (
        <PaymentInsightCard
          title="Recurring Payments"
          value={`${insights.recurring.totalCount || 0} Payments`}
          description={insights.recurring.thisWeekCount ? `${insights.recurring.thisWeekCount} auto-scheduled this week` : undefined}
          icon={RefreshCw}
          iconColor="text-purple-500"
          iconBgColor="bg-purple-500/10"
          animationDelay={100}
        />
      )}

      {insights.cashIntensive && (
        <PaymentInsightCard
          title="Cash-Intensive Week"
          value={`₹${insights.cashIntensive.amount?.toLocaleString() || '0'}`}
          description={insights.cashIntensive.recommendation}
          icon={AlertTriangle}
          iconColor="text-amber-500"
          iconBgColor="bg-amber-500/10"
          animationDelay={150}
          accentText={true}
        />
      )}

      {/* Month-to-date card with custom validation */}
      {renderMonthToDateCard()}
    </div>
  );
};

export default PaymentInsightsGrid;
