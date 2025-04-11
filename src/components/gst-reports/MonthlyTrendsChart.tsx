
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Info } from 'lucide-react';

export const MonthlyTrendsChart: React.FC = () => {
  // Sample data for the last 12 months
  const data = [
    { month: 'Apr', amount: 12500 },
    { month: 'May', amount: 14200 },
    { month: 'Jun', amount: 13800 },
    { month: 'Jul', amount: 15100 },
    { month: 'Aug', amount: 13900 },
    { month: 'Sep', amount: 16200 },
    { month: 'Oct', amount: 22800, note: 'Festive season spike' },
    { month: 'Nov', amount: 19500 },
    { month: 'Dec', amount: 17100 },
    { month: 'Jan', amount: 16400 },
    { month: 'Feb', amount: 15800 },
    { month: 'Mar', amount: 18200 },
  ];

  const formatCurrency = (value: number) => `₹${value.toLocaleString()}`;

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-md border border-gray-200 dark:border-gray-700">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
            {formatCurrency(data.amount)}
          </p>
          {data.note && (
            <p className="text-xs mt-1 font-medium text-amber-600 dark:text-amber-400 flex items-center">
              <Info className="h-3 w-3 mr-1" /> {data.note}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Monthly GST Payments</CardTitle>
        <p className="text-sm text-muted-foreground">Your GST payments over the last 12 months</p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(value) => `₹${(value/1000)}k`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="amount" 
                fill="#6366f1" 
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
              {/* Reference line for October spike */}
              <ReferenceLine 
                x="Oct" 
                stroke="#f59e0b" 
                strokeDasharray="3 3" 
                label={{ value: "Peak", position: "top", fill: "#f59e0b", fontSize: 12 }} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
