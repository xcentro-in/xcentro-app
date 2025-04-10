
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const ForecastSection: React.FC = () => {
  // Forecast data for next 3 months
  const forecastData = [
    { month: 'Apr', estimate: 19500, rangeMin: 18200, rangeMax: 20800 },
    { month: 'May', estimate: 20100, rangeMin: 18700, rangeMax: 21500 },
    { month: 'Jun', estimate: 21800, rangeMin: 20000, rangeMax: 23600 },
  ];

  // Custom tooltip for the forecast chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-md border border-gray-200 dark:border-gray-700">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
            Estimate: ₹{data.estimate.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">
            Range: ₹{data.rangeMin.toLocaleString()} - ₹{data.rangeMax.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-medium">Forecast & Planning</CardTitle>
            <p className="text-sm text-muted-foreground">Brace Yourself: April GST Projection</p>
          </div>
          <Badge variant="outline" className="font-normal bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-700/30 dark:text-indigo-400">
            Next 3 Months
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(value) => `₹${(value/1000)}k`}
                tick={{ fontSize: 12 }}
                domain={['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="rangeMin" 
                stackId="1"
                stroke="none" 
                fill="#c7d2fe" 
                fillOpacity={0.5}
              />
              <Area 
                type="monotone" 
                dataKey="rangeMax" 
                stackId="1" 
                stroke="none" 
                fill="#c7d2fe" 
                fillOpacity={0.5}
              />
              <Line 
                type="monotone" 
                dataKey="estimate" 
                stroke="#6366f1" 
                strokeWidth={2}
                dot={{ r: 4, fill: "#6366f1", stroke: "white", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center gap-2 p-3 border rounded-md bg-indigo-50 border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800/30">
          <Wallet className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <div className="text-sm text-indigo-700 dark:text-indigo-300">
            Recommended cash buffer: <span className="font-medium">₹19,500</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
