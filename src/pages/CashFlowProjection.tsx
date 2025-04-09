
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@/components/cashflow/CashflowIcons";
import CashflowStatusCard from "@/components/cashflow/CashflowStatusCard";
import CashflowProjectionChart from "@/components/cashflow/CashflowProjectionChart";
import CashflowCriticalDates from "@/components/cashflow/CashflowCriticalDates";

const CashFlowProjection = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Cash Flow Projection</h1>
            <HoverCard>
              <HoverCardTrigger>
                <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400 flex items-center gap-1 cursor-help">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  Synced with ZohoBooks
                </Badge>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-1">
                  <p className="text-sm">
                    Cash inflow and outflow synced last on {new Date().toLocaleDateString()}
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          <p className="text-muted-foreground">
            30-day forecast of your business cash position
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
            <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
            Healthy cash flow
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Status Card */}
        <CashflowStatusCard />
        
        {/* Main Projection Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">30-Day Projection</CardTitle>
            <CardDescription>
              Cash flow forecast for the next 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CashflowProjectionChart />
          </CardContent>
        </Card>
      </div>
      
      <CashflowCriticalDates />
    </div>
  );
};

export default CashFlowProjection;
