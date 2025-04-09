
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@/components/cashflow/CashflowIcons";
import CashflowStatusCard from "@/components/cashflow/CashflowStatusCard";
import CashflowProjectionChart from "@/components/cashflow/CashflowProjectionChart";
import CashflowCriticalDates from "@/components/cashflow/CashflowCriticalDates";

const CashFlowProjection = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cash Flow Projection</h1>
          <p className="text-muted-foreground mt-1">
            30-day forecast of your business cash position
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
            <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
            Healthy cash flow
          </Badge>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Synced with ZohoBooks
                <Info className="h-4 w-4" />
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              Cash inflow and outflow synced last on {new Date().toLocaleDateString()}
            </TooltipContent>
          </Tooltip>
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
