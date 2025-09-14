
import { useNavigate } from "react-router-dom";
import { Plus, ShoppingBag, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import InsightCard from "@/components/dashboard/InsightCard";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import RewardStatus from "@/components/dashboard/RewardStatus";
import QuickActions from "@/components/dashboard/QuickActions";
import DashboardCalendarWidget from "@/components/calendar/DashboardCalendarWidget";
import PendingApprovalsBanner from "@/components/dashboard/PendingApprovalsBanner";
import RecentVendorsCard from "@/components/payments/RecentVendorsCard";
import { mockApprovalTransactions } from "@/data/mockApprovalTransactions";
import { mockCalendarTransactions } from "@/data/mockCalendarEvents";
import TopExpenseCategoryCard from "@/components/dashboard/TopExpenseCategoryCard";
import UpcomingLargePaymentsCard from "@/components/dashboard/UpcomingLargePaymentsCard";
import { usePageTitle } from "@/contexts/PageTitleContext";
import { useEffect } from "react";

const insights = [
  { title: "Monthly Spend", value: 75493, change: 12.8, trend: "up" as const },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { setTitle } = usePageTitle();
  
  useEffect(() => {
    setTitle("Welcome back, Arvind");
  }, [setTitle]);
  
  // Calculate pending and urgent approval counts
  const pendingCount = mockApprovalTransactions.filter(
    t => t.status === "pending" || t.status === "urgent" || t.status === "flagged"
  ).length;
  
  const urgentCount = mockApprovalTransactions.filter(
    t => t.status === "urgent"
  ).length;
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <Badge variant="outline" className="mb-2.5 px-3 py-1.5 text-xs font-medium bg-primary/5 border-primary/10 text-primary animate-fade-in">
            Business Dashboard
          </Badge>
          <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: "50ms" }}>
            Here's what's happening with your business finances today
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

      <PendingApprovalsBanner pendingCount={pendingCount} urgentCount={urgentCount} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {insights.map((insight, index) => (
          <InsightCard
            key={insight.title}
            {...insight}
            delay={index * 50}
          />
        ))}
        <TopExpenseCategoryCard />
        <UpcomingLargePaymentsCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1">
          <RecentTransactions />
        </div>
        <div className="lg:col-span-2">
          <RewardStatus />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <QuickActions />
        <div className="col-span-1 md:col-span-1">
          <RecentVendorsCard />
        </div>
        <div className="col-span-1 md:col-span-1">
          <DashboardCalendarWidget transactions={mockCalendarTransactions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
