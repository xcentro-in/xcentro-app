import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircleIcon, ExclamationTriangleIcon } from "./CashflowIcons";
import { CalendarDays, AlertTriangle, CheckCircle2, ArrowDown } from "lucide-react";
import {formatCurrency} from "@/utils/formatters"

interface CriticalDate {
  date: string;
  balance: number;
  reason: string;
  isCritical: boolean;
  amount?: number;
  relatedTo?: string;
}

const CashflowCriticalDates: React.FC = () => {
  // In a real app, this would come from your API or calculations
  const criticalDates: CriticalDate[] = [
    {
      date: "April 15, 2025",
      balance: 18500,
      reason: "Tax payment due",
      isCritical: true,
      amount: 8000,
      relatedTo: "Quarterly taxes"
    },
    {
      date: "April 17, 2025",
      balance: 12200,
      reason: "Payroll processing",
      isCritical: true,
      amount: 20000,
      relatedTo: "Staff salaries"
    },
    {
      date: "April 22, 2025",
      balance: 27500,
      reason: "Major client payment expected",
      isCritical: false,
      amount: 15000,
      relatedTo: "Project completion"
    },
    {
      date: "May 1, 2025",
      balance: 32500,
      reason: "Office rent payment",
      isCritical: false,
      amount: 5000,
      relatedTo: "Monthly fixed expense"
    }
  ];
  
  const safetyThreshold = 30000;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Important Cash Flow Dates</CardTitle>
            <CardDescription>
              Upcoming events that will impact your cash position
            </CardDescription>
          </div>
          <CalendarDays className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {criticalDates.map((item, index) => (
            <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
              {item.isCritical ? (
                <div className="h-8 w-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center dark:bg-red-900/30 dark:text-red-400">
                  <AlertTriangle className="h-4 w-4" />
                </div>
              ) : (
                <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center dark:bg-green-900/30 dark:text-green-400">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{item.date}</h4>
                  <span className={`font-medium ${
                    item.balance < safetyThreshold * 0.5 
                      ? "text-red-600 dark:text-red-400" 
                      : item.balance < safetyThreshold 
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-green-600 dark:text-green-400"
                  }`}>
                    {formatCurrency(item.balance)}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground mt-0.5">{item.reason}</p>
                
                <div className="mt-2 flex items-center gap-1.5">
                  {item.amount && (
                    <span className={`text-xs ${
                      item.isCritical
                        ? "bg-red-50 text-red-700 border border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30"
                        : "bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30"
                    } px-2 py-0.5 rounded-full`}>
                      {item.isCritical ? "-" : "+"}{formatCurrency(item.amount)}
                    </span>
                  )}
                  
                  {item.relatedTo && (
                    <span className="text-xs text-muted-foreground">
                      {item.relatedTo}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CashflowCriticalDates;
