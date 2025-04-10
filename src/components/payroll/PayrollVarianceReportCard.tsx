
import React from "react";
import { TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface SalaryTrendData {
  month: string;
  amount: number;
}

interface PayrollVarianceReportCardProps {
  salaryTrendData: SalaryTrendData[];
}

const PayrollVarianceReportCard: React.FC<PayrollVarianceReportCardProps> = ({
  salaryTrendData
}) => {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Payroll Variance Report</CardTitle>
        <CardDescription>Month-over-month changes in payroll costs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salaryTrendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis 
                tickFormatter={(value) => `₹${value / 1000}k`}
                width={80}
              />
              <RechartsTooltip 
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']} 
              />
              <Legend />
              <Bar 
                dataKey="amount" 
                name="Total Payroll" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
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
