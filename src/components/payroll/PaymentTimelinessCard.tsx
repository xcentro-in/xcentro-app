
import React from "react";
import { AlertTriangle, BarChart3 } from "lucide-react";
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

interface PaymentTimeliness {
  month: string;
  onTime?: number;
  delayed?: number;
  predicted?: number;
}

interface PaymentTimelinessCardProps {
  paymentTimelinessData: PaymentTimeliness[];
  lastMonthDelay: number;
}

const PaymentTimelinessCard: React.FC<PaymentTimelinessCardProps> = ({
  paymentTimelinessData,
  lastMonthDelay
}) => {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Salary Payment Timeliness</CardTitle>
        <CardDescription>
          {lastMonthDelay > 0 ? 
            `You paid ${lastMonthDelay} days late last month` : 
            'All salaries were paid on time recently'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={paymentTimelinessData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis 
                label={{ value: 'Days Delayed', angle: -90, position: 'insideLeft' }} 
                allowDecimals={false}
              />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="onTime" name="On Time" fill="#4ade80" />
              <Bar dataKey="delayed" name="Days Delayed" fill="#f87171" />
              <Bar dataKey="predicted" name="Predicted" fill="#60a5fa" />
            </BarChart>
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
