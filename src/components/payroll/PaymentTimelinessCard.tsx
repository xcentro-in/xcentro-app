
import React, { useMemo } from "react";
import { AlertTriangle, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip as RechartsTooltip,
  TooltipProps,
} from "recharts";
import { formatCurrency } from "@/utils/formatters";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface PaymentTimeliness {
  month: string;
  paymentDate?: number;
  amount?: number;
  onTime?: number;
  delayed?: number;
  predicted?: number;
}

interface PaymentTimelinessCardProps {
  paymentTimelinessData: PaymentTimeliness[];
  lastMonthDelay: number;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (!active || !payload || !payload.length) return null;
  
  const data = payload[0].payload;
  const isPredicted = Boolean(data.predicted !== undefined);

  return (
    <div className="rounded-lg border border-border/50 bg-background p-3 shadow-lg">
      <div className="mb-2 flex items-center gap-1.5 border-b pb-1.5">
        <span className="font-medium">{label}</span>
        {isPredicted && (
          <span className="ml-1.5 rounded-full bg-blue-100 px-1.5 py-0.5 text-xs text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
            Predicted
          </span>
        )}
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-muted-foreground">Payment Date:</span>
          <span className="font-medium">{data.paymentDate} of month</span>
        </div>
        {data.amount !== undefined && (
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">Amount:</span>
            <span className="font-medium">{formatCurrency(data.amount)}</span>
          </div>
        )}
        {data.delayed !== undefined && (
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">Delay:</span>
            <span className="font-medium text-red-500">{data.delayed} days</span>
          </div>
        )}
        {data.onTime !== undefined && !data.delayed && (
          <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
            Payment was on time
          </div>
        )}
      </div>
    </div>
  );
};

const PaymentTimelinessCard: React.FC<PaymentTimelinessCardProps> = ({
  paymentTimelinessData,
  lastMonthDelay
}) => {
  // Calculate the average payment date for the trend line
  const averagePaymentDate = useMemo(() => {
    const validDates = paymentTimelinessData
      .filter(item => item.paymentDate !== undefined)
      .map(item => item.paymentDate as number);
    
    return validDates.length ? 
      Math.round(validDates.reduce((sum, date) => sum + date, 0) / validDates.length) : 25;
  }, [paymentTimelinessData]);

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Salary Payment Timeliness</CardTitle>
        <CardDescription className="flex items-center gap-2">
          {lastMonthDelay > 0 ? 
            `You paid ${lastMonthDelay} days late last month` : 
            'All salaries were paid on time recently'}
            
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 cursor-help text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">
                  This chart shows the date of each month when salaries were paid. 
                  The dotted line shows the ideal payment date based on your history.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={paymentTimelinessData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis 
                domain={[20, 30]} 
                label={{ 
                  value: 'Day of Month', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }} 
                allowDecimals={false}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              
              {/* Trend line for ideal payment date */}
              <ReferenceLine 
                y={averagePaymentDate} 
                stroke="#8B5CF6" 
                strokeDasharray="3 3" 
                label={{ 
                  value: `Ideal Payment (Day ${averagePaymentDate})`, 
                  position: 'insideBottomRight',
                  fill: '#8B5CF6',
                  fontSize: 12
                }} 
              />
              
              {/* Actual Payment Line */}
              <Line
                type="monotone"
                dataKey="paymentDate"
                stroke="#4ade80"
                activeDot={{ r: 8, fill: "#4ade80", stroke: "#fff", strokeWidth: 2 }}
                strokeWidth={2}
                dot={{ r: 4, fill: "#4ade80", stroke: "#fff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {lastMonthDelay > 0 && (
          <div className="mt-4 bg-amber-50 dark:bg-amber-950/30 rounded-md p-3 text-sm">
            <div className="flex gap-2 items-center text-amber-600 dark:text-amber-400 font-medium mb-1">
              <AlertTriangle className="h-4 w-4" />
              <span>Risk Alert</span>
            </div>
            <p>Consider using auto-scheduled card payments to avoid delays.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentTimelinessCard;
