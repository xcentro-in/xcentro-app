import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import InsightCard from "@/components/dashboard/InsightCard";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import RewardStatus from "@/components/dashboard/RewardStatus";
import QuickActions from "@/components/dashboard/QuickActions";
import PaymentCalendar from "@/components/dashboard/PaymentCalendar";

const insights = [
  { title: "Monthly Spend", value: "$75,493", change: 12.8, trend: "up" as const },
  { title: "Reward Points", value: "24,530", change: 8.3, trend: "up" as const },
  { title: "Expenses Tracked", value: "94%", change: 3.1, trend: "up" as const },
];

const Dashboard = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <Badge variant="outline" className="mb-2.5 px-3 py-1.5 text-xs font-medium bg-primary/5 border-primary/10 text-primary animate-fade-in">
            Business Dashboard
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight animate-slide-up">Welcome back, John</h1>
          <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: "50ms" }}>
            Here's what's happening with your business finances today
          </p>
        </div>
        
        <div className="flex gap-3 animate-slide-down" style={{ animationDelay: "100ms" }}>
          <Button variant="outline" className="h-10 gap-2">
            <Plus className="h-4 w-4" />
            Add Account
          </Button>
          <Button 
            className="h-10 gap-2"
            onClick={() => navigate("/new-payment")}
          >
            <Plus className="h-4 w-4" />
            New Payment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {insights.map((insight, index) => (
          <InsightCard
            key={insight.title}
            {...insight}
            delay={index * 50}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <RecentTransactions />
        <RewardStatus />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <QuickActions />
        <PaymentCalendar />
      </div>
    </div>
  );
};

export default Dashboard;
