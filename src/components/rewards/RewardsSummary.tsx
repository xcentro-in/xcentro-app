
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
    <Card className="col-span-1 md:col-span-2 animate-fade-in overflow-hidden">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-semibold">Current Rewards Summary</CardTitle>
        <CardDescription>
          Overview of your rewards program status
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="text-center md:text-left">
            <div className="text-sm font-medium text-muted-foreground mb-2">Available Reward Points</div>
            <div className="text-4xl font-bold">{availablePoints.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground mt-1">= Approx. ${(availablePoints / 100).toFixed(0)} value</div>
          </div>
          
          <div className="flex gap-4">
            <Button className="h-10" onClick={onRedeemClick}>Redeem Now</Button>
            <Button variant="outline" className="h-10 gap-1.5">
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
              { label: "Earned This Month", value: "3,840", icon: TrendingUp, color: "text-primary" },
              { label: "Lifetime Earned", value: "138,570", icon: Award, color: "text-purple-500" },
              { label: "Redeemed Value", value: "$1,140", icon: Gift, color: "text-green-500" },
            ].map((stat, i) => (
              <div key={stat.label} className="rounded-lg border p-4">
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
