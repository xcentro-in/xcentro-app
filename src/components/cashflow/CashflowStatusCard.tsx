
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, AlertTriangle } from "lucide-react";
import {formatCurrency} from "@/utils/formatters"

const CashflowStatusCard: React.FC = () => {
  // This would normally come from your data source
  const currentBalance = 42560.75;
  const safetyThreshold = 30000;
  const projectedMinimum = 28450.25;
  const changePercentage = 4.2;
  
  // Determine status based on balance vs threshold
  const isSafe = currentBalance >= safetyThreshold;
  const isWarning = !isSafe && currentBalance >= safetyThreshold * 0.5;
  const isCritical = currentBalance < safetyThreshold * 0.5;
  const willHitCritical = projectedMinimum < safetyThreshold * 0.5;
  
  const statusColor = isSafe ? "text-green-600" : isWarning ? "text-amber-500" : "text-red-500";
  const bgColor = isSafe ? "bg-green-50" : isWarning ? "bg-amber-50" : "bg-red-50";
  const darkBgColor = isSafe ? "dark:bg-green-950/20" : isWarning ? "dark:bg-amber-950/20" : "dark:bg-red-950/20";
  const borderColor = isSafe ? "border-green-100" : isWarning ? "border-amber-100" : "border-red-100";
  const darkBorderColor = isSafe ? "dark:border-green-900/20" : isWarning ? "dark:border-amber-900/20" : "dark:border-red-900/20";
  
  return (
    <Card className={`${bgColor} ${darkBgColor} ${borderColor} ${darkBorderColor}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Current Cash Position</CardTitle>
        <CardDescription>
          Available balance across all accounts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className={`text-3xl font-bold ${statusColor}`}>
              {formatCurrency(currentBalance)}
            </div>
            <div className="flex items-center mt-1 text-sm">
              {changePercentage >= 0 ? (
                <>
                  <ArrowUp className="h-3 w-3 mr-1 text-green-500" />
                  <span className="text-green-600">+{changePercentage}% from last month</span>
                </>
              ) : (
                <>
                  <ArrowDown className="h-3 w-3 mr-1 text-red-500" />
                  <span className="text-red-600">{changePercentage}% from last month</span>
                </>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Safety Threshold</div>
              <div className="font-medium">{formatCurrency(safetyThreshold)}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Projected Minimum</div>
              <div className="font-medium flex items-center">
                {formatCurrency(projectedMinimum)}
                {willHitCritical && (
                  <AlertTriangle className="h-4 w-4 ml-1 text-amber-500" />
                )}
              </div>
            </div>
          </div>
          
          {willHitCritical && (
            <div className="mt-4 p-2 rounded-md bg-amber-100 border border-amber-200 text-amber-800 text-sm dark:bg-amber-950/30 dark:border-amber-900/30 dark:text-amber-400">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                <span>Your balance may fall below safety threshold within 30 days</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CashflowStatusCard;
