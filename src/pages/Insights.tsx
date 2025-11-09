import { 
  BarChart2, 
  DollarSign, 
  CreditCard, 
  FileText, 
  Clock,
  Calendar,
  SlidersHorizontal,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

// Import refactored components

import { 
  SpendingTrend,
  CategoryBreakdown,
  TaxComplianceCard,
  CashFlowForecastCard
} from "@/components/insights/InsightsCharts";
import CustomizeViewDialog from "@/components/insights/CustomizeViewDialog";
import StatCard from "@/components/insights/StatCard";
import PaymentActivityMap from "@/components/insights/PaymentActivityMap";
import { usePageTitle } from "@/contexts/PageTitleContext";
import { useEffect } from "react";

// Mock data for charts
const spendingData = [
  { name: "Jan", amount: 35000 },
  { name: "Feb", amount: 28000 },
  { name: "Mar", amount: 32000 },
  { name: "Apr", amount: 40000 },
  { name: "May", amount: 35000 },
  { name: "Jun", amount: 42000 },
  { name: "Jul", amount: 45000 },
];

const categoryData = [
  { name: "Software", value: 25 },
  { name: "Rent", value: 20 },
  { name: "Marketing", value: 18 },
  { name: "Payroll", value: 27 },
  { name: "Travel", value: 10 },
];

const cashFlowData = [
  { name: "Today", balance: 45000 },
  { name: "Aug 20", balance: 42000 },
  { name: "Aug 25", balance: 51000 },
  { name: "Aug 30", balance: 48000 },
  { name: "Sep 5", balance: 62000 },
  { name: "Sep 10", balance: 58000 },
];

const statCards = [
  { title: "Total Spend", value: "$145,245", change: 8.2, trend: "up", icon: DollarSign, description: "vs. last month" },
  { title: "Transactions", value: "342", change: 12.5, trend: "up", icon: CreditCard, description: "vs. last month" },
  { title: "Active Vendors", value: "48", change: 2.1, trend: "up", icon: FileText, description: "vs. last month" },
  { title: "Upcoming Payments", value: "$35,400", change: -5.3, trend: "down", icon: Clock, description: "vs. last month" },
];

interface ViewOptions {
  showSpendingTrend: boolean;
  showCategoryBreakdown: boolean;
  showTaxCompliance: boolean;
  showCashFlowForecast: boolean;
  showPaymentActivityMap: boolean;
  timePeriod: string;
}

const Insights = () => {
  const { setTitle } = usePageTitle();
  const [showInsights, setShowInsights] = useState(true);
  const [customizeDialogOpen, setCustomizeDialogOpen] = useState(false);
  
  useEffect(() => {
    setTitle("Financial Insights");
  }, [setTitle]);
  const [viewOptions, setViewOptions] = useState({
    showSpendingTrend: true,
    showCategoryBreakdown: true,
    showTaxCompliance: true,
    showCashFlowForecast: true,
    showPaymentActivityMap: true,
    timePeriod: "thisMonth",
  });
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: "50ms" }}>
            Analytics and insights to optimize your business spending
          </p>
        </div>
        
        <div className="flex items-center gap-2 animate-slide-down" style={{ animationDelay: "100ms" }}>
          <Select defaultValue="thisMonth">
            <SelectTrigger className="w-[180px] h-10">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={customizeDialogOpen} onOpenChange={setCustomizeDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-10 gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Customize View
              </Button>
            </DialogTrigger>
            <CustomizeViewDialog 
              open={customizeDialogOpen} 
              onOpenChange={setCustomizeDialogOpen} 
              viewOptions={viewOptions} 
              setViewOptions={setViewOptions} 
            />
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {statCards.map((stat, index) => (
          <StatCard 
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            trend={stat.trend as "up" | "down"}
            icon={stat.icon}
            description={stat.description}
            index={index}
          />
        ))}
      </div>

      {/* Payment Activity Section */}
      {viewOptions.showPaymentActivityMap && <PaymentActivityMap />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {viewOptions.showSpendingTrend && (
          <SpendingTrend spendingData={spendingData} />
        )}
        
        {viewOptions.showCategoryBreakdown && (
          <CategoryBreakdown categoryData={categoryData} />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {viewOptions.showTaxCompliance && <TaxComplianceCard />}
        
        {viewOptions.showCashFlowForecast && (
          <CashFlowForecastCard cashFlowData={cashFlowData} />
        )}
      </div>
    </div>
  );
};

export default Insights;
