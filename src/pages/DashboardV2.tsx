import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePageTitle } from "@/contexts/PageTitleContext";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import EmptyStateDashboard from "@/components/dashboard/EmptyStateDashboard";
import PendingApprovalsBanner from "@/components/dashboard/PendingApprovalsBanner";
import QuickActions from "@/components/dashboard/QuickActions";
import SpendMetricsCard from "@/components/dashboard-v2/SpendMetricsCard";
import UpcomingLargePaymentsCard from "@/components/dashboard-v2/UpcomingLargePaymentsCard";
import ActivityFeedTable from "@/components/dashboard-v2/ActivityFeedTable";
import MonthlySpendChart from "@/components/dashboard-v2/MonthlySpendChart";
import {
  getCurrentMonthSpend,
  getLastMonthSpend,
  getPendingSettlements
} from "@/data/mockDashboardData";
import { mockApprovalTransactions } from "@/data/mockApprovalTransactions";

const DashboardV2 = () => {
  const navigate = useNavigate();
  const { setTitle } = usePageTitle();
  const { user } = useAuth();

  // Check if we should show empty state
  const showEmptyState =
    user?.hasCompletedOnboarding === false ||
    (!user?.hasAddedPaymentMethod && !user?.hasAddedVendor && !user?.hasCreatedFirstPayment);

  useEffect(() => {
    const userName = user?.name?.split(' ')[0] || 'User';

    if (showEmptyState) {
      setTitle(`Let's get started, ${userName}`);
    } else {
      setTitle(`Welcome back, ${userName}`);
    }
  }, [setTitle, user, showEmptyState]);

  // Calculate metrics
  const currentMonthSpend = getCurrentMonthSpend();
  const lastMonthSpend = getLastMonthSpend();
  const pendingSettlements = getPendingSettlements();

  // Calculate percentage change
  const spendChange = lastMonthSpend > 0
    ? ((currentMonthSpend - lastMonthSpend) / lastMonthSpend) * 100
    : 0;

  // Calculate pending and urgent approval counts
  const pendingCount = mockApprovalTransactions.filter(
    t => t.status === "pending" || t.status === "urgent" || t.status === "flagged"
  ).length;

  const urgentCount = mockApprovalTransactions.filter(
    t => t.status === "urgent"
  ).length;

  // Show empty state for new users
  if (showEmptyState) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <Badge variant="outline" className="mb-2.5 px-3 py-1.5 text-xs font-medium bg-primary/5 border-primary/10 text-primary animate-fade-in">
              Getting Started
            </Badge>
            <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: "50ms" }}>
              Complete these steps to unlock your business finance dashboard
            </p>
          </div>
        </div>

        <EmptyStateDashboard />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <Badge variant="outline" className="mb-2.5 px-3 py-1.5 text-xs font-medium bg-primary/5 border-primary/10 text-primary animate-fade-in">
            Business Dashboard
          </Badge>
          <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: "50ms" }}>
            Your payment activity at a glance
          </p>
        </div>

        <div className="flex gap-3 animate-slide-down" style={{ animationDelay: "100ms" }}>
          <Button
            className="h-10 gap-2"
            onClick={() => navigate("/new-payment")}
          >
            <Plus className="h-4 w-4" />
            New Payment
          </Button>
        </div>
      </div>

      {/* Pending Approvals Banner */}
      {pendingCount > 0 && (
        <PendingApprovalsBanner pendingCount={pendingCount} urgentCount={urgentCount} />
      )}

      {/* Metrics Row: Total Spent, Pending Settlements, Upcoming Large Payments */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <SpendMetricsCard
          title="Total Spent This Month"
          value={currentMonthSpend}
          change={{
            value: spendChange,
            trend: spendChange >= 0 ? "up" : "down"
          }}
          delay={0}
        />

        <SpendMetricsCard
          title="Pending Settlements"
          value={pendingSettlements.total}
          subtitle={`${pendingSettlements.count} transaction${pendingSettlements.count !== 1 ? 's' : ''}`}
          variant="warning"
          delay={50}
        />

        <UpcomingLargePaymentsCard />
      </div>

      {/* Recent Activity Feed */}
      <ActivityFeedTable />

      {/* Monthly Spend Chart */}
      <MonthlySpendChart />

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
};

export default DashboardV2;
