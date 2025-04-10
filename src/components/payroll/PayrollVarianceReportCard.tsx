
import React from "react";
import { TrendingUp, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  TooltipProps,
  Dot,
} from "recharts";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { formatCurrency } from "@/utils/formatters";

interface SalaryTrendData {
  month: string;
  amount: number;
}

interface PayrollVarianceReportCardProps {
  salaryTrendData: SalaryTrendData[];
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (!active || !payload || !payload.length) return null;
  
  const data = payload[0].payload;
  
  return (
    <div className="rounded-lg border border-border/50 bg-background p-3 shadow-lg">
      <div className="mb-2 flex items-center gap-1.5 border-b pb-1.5">
        <span className="font-medium">{label}</span>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-muted-foreground">Payroll amount:</span>
          <span className="font-medium">{formatCurrency(data.amount)}</span>
        </div>
      </div>
    </div>
  );
};

// Custom dot component to make dots more prominent on hover
const CustomDot = (props: any) => {
  const { cx, cy, payload, index, isAnimationActive } = props;
  const isActive = props.isActive || props.hovered === index;
  
  return (
    <Dot
      {...props}
      r={isActive ? 6 : 4}
      fill={isActive ? "#9b87f5" : "#8B5CF6"}
      stroke="#fff"
      strokeWidth={2}
    />
  );
};

const PayrollVarianceReportCard: React.FC<PayrollVarianceReportCardProps> = ({
  salaryTrendData
}) => {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Payroll Variance Report</CardTitle>
            <CardDescription>Month-over-month changes in payroll costs</CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 cursor-help text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">
                  This chart shows the trend of total payroll costs over recent months.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salaryTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis 
                tickFormatter={(value) => `₹${value / 1000}k`}
                width={80}
              />
              <RechartsTooltip content={<CustomTooltip />} cursor={false} />
              <Line 
                type="monotone" 
                dataKey="amount" 
                name="Total Payroll"
                stroke="#8B5CF6" 
                strokeWidth={2}
                activeDot={{ r: 8, fill: "#9b87f5", stroke: "#fff", strokeWidth: 2 }}
                dot={(props) => <CustomDot {...props} />}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 bg-blue-50 dark:bg-blue-950/30 rounded-md p-3 text-sm">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium mb-1">
            <TrendingUp className="h-4 w-4" />
            <span>Trend Analysis</span>
          </div>
          <p>Payroll increased by ₹10,000 this month due to annual increments.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PayrollVarianceReportCard;
