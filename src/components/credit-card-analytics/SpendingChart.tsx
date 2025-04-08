
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCurrency } from "./utils/chartUtils";

interface SpendingChartProps {
  data: Array<{
    name: string;
    "Total Spend": number;
    "Rewards Earned": number;
  }>;
}

export const SpendingChart: React.FC<SpendingChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Total Spend Per Card</CardTitle>
        <CardDescription>Compare spending across all credit cards</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px] w-full">
        <ChartContainer
          config={{
            "Total Spend": {
              label: "Total Spend",
              theme: {
                light: "#334155", // slate-700
                dark: "#64748b", // slate-500
              },
            },
            "Rewards Earned": {
              label: "Rewards Earned",
              theme: {
                light: "#0f766e", // teal-700
                dark: "#14b8a6", // teal-500
              },
            },
          }}
        >
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, dy: 10 }}
              height={60}
              angle={0}
              textAnchor="end"
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${value/1000}k`}
              tick={{ fontSize: 12 }}
              width={80}
            />
            <ChartTooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow border">
                      <p className="font-medium mb-1">{label}</p>
                      {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                          <span className="text-sm">{entry.name}: {formatCurrency(entry.value)}</span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar dataKey="Total Spend" radius={[4, 4, 0, 0]} maxBarSize={60} />
            <Bar dataKey="Rewards Earned" radius={[4, 4, 0, 0]} maxBarSize={60} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
