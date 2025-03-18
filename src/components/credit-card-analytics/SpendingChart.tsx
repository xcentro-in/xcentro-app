
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
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
                light: "#3b82f6", // blue-500
                dark: "#60a5fa", // blue-400
              },
            },
            "Rewards Earned": {
              label: "Rewards Earned",
              theme: {
                light: "#10b981", // emerald-500
                dark: "#34d399", // emerald-400
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
              tick={{ fontSize: 12 }}
              height={60}
              angle={-45}
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
              content={
                <ChartTooltipContent
                  formatter={(value) => formatCurrency(value)}
                />
              }
            />
            <Bar dataKey="Total Spend" radius={[4, 4, 0, 0]} maxBarSize={60} />
            <Bar dataKey="Rewards Earned" radius={[4, 4, 0, 0]} maxBarSize={60} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
