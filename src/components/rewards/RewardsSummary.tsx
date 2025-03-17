
import React, { useState, useEffect } from "react";
import { TrendingUp, Award, Gift, Share, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface RewardsSummaryProps {
  availablePoints: number;
  onRedeemClick: () => void;
}

const RewardsSummary: React.FC<RewardsSummaryProps> = ({ availablePoints, onRedeemClick }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setProgress(78), 500);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <Card className="col-span-1 md:col-span-2 animate-fade-in overflow-hidden border-none shadow-md bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <CardHeader className="pb-0 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-white to-blue-50/50 dark:from-slate-800 dark:to-blue-900/20">
        <CardTitle className="text-lg font-semibold">Current Rewards Summary</CardTitle>
        <CardDescription>
          Overview of your rewards program status
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="text-center md:text-left">
            <div className="text-sm font-medium text-muted-foreground mb-2">Available Reward Points</div>
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {availablePoints.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground mt-1">= Approx. ${(availablePoints / 100).toFixed(0)} value</div>
          </div>
          
          <div className="flex gap-4">
            <Button 
              className="h-10 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
              onClick={onRedeemClick}
            >
              Redeem Now
            </Button>
            <Button variant="outline" className="h-10 gap-1.5 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800">
              <Share className="h-4 w-4" />
              Transfer
            </Button>
          </div>
        </div>
        
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Monthly Reward Target</div>
              <div className="text-sm">{progress}% Complete</div>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <div>0 points</div>
              <div>5,000 points (Target)</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {[
              { label: "Earned This Month", value: "3,840", icon: TrendingUp, color: "text-blue-500" },
              { label: "Lifetime Earned", value: "138,570", icon: Award, color: "text-indigo-500" },
              { label: "Redeemed Value", value: "$1,140", icon: Gift, color: "text-green-500" },
            ].map((stat, i) => (
              <div key={stat.label} className="rounded-lg border p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={cn("h-4 w-4", stat.color)} />
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardsSummary;
