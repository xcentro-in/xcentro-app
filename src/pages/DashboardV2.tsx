import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePageTitle } from "@/contexts/PageTitleContext";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import EmptyStateDashboard from "@/components/dashboard/EmptyStateDashboard";
import PendingApprovalsBanner from "@/components/dashboard/PendingApprovalsBanner";
import SpendMetricsCard from "@/components/dashboard-v2/SpendMetricsCard";
import OverdueBillsCard from "@/components/dashboard-v2/OverdueBillsCard";
import UpcomingLargePaymentsCard from "@/components/dashboard-v2/UpcomingLargePaymentsCard";
import ActivityFeedTable from "@/components/dashboard-v2/ActivityFeedTable";
import MonthlySpendChart from "@/components/dashboard-v2/MonthlySpendChart";
import CreditCardExpensePieChart from "@/components/dashboard-v2/CreditCardExpensePieChart";
import { useDashboard } from "@/hooks/useDashboard";
import { mockApprovalTransactions } from "@/data/mockApprovalTransactions";

const DashboardV2 = () => {
  const navigate = useNavigate();
  const { setTitle } = usePageTitle();
  const { user } = useAuth();
  const { data: dashboardData, isLoading, error } = useDashboard();

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

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-4">{error || 'Failed to load dashboard data'}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
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

      {/* Metrics Row: Total Spent, Overdue Bills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SpendMetricsCard
          title="Total Spent This Month"
          value={dashboardData.currentMonthSpend}
          change={{
            value: dashboardData.spendChange,
            trend: dashboardData.spendChange >= 0 ? "up" : "down"
          }}
          delay={0}
        />

        <OverdueBillsCard
          overdueBills={dashboardData.overdueBills}
          delay={50}
        />
      </div>

      {/* Recent Activity & Upcoming Large Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ActivityFeedTable transactions={dashboardData.recentActivity} />
        <UpcomingLargePaymentsCard payments={dashboardData.upcomingLargePayments} />
      </div>

      {/* Charts Row: Monthly Spend & Credit Card Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <MonthlySpendChart data={dashboardData.monthlySpendData} />
        <CreditCardExpensePieChart data={dashboardData.creditCardExpenses} />
      </div>
    </div>
  );
};

export default DashboardV2;
