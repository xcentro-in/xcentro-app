
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

interface HiddenChargesChartProps {
  data: Array<{
    name: string;
    "Late Fees": number;
    "Interest Charged": number;
    "Other Penalties": number;
    total: number;
  }>;
}

export const HiddenChargesChart: React.FC<HiddenChargesChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Hidden Charges Breakdown</CardTitle>
        <CardDescription>Late fees, interest, and other penalties by card</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px] w-full">
        <ChartContainer
          config={{
            "Late Fees": {
              label: "Late Fees",
              theme: {
                light: "#ef4444", // red-500
                dark: "#f87171", // red-400
              },
            },
            "Interest Charged": {
              label: "Interest Charged",
              theme: {
                light: "#f59e0b", // amber-500
                dark: "#fbbf24", // amber-400
              },
            },
            "Other Penalties": {
              label: "Other Penalties",
              theme: {
                light: "#eab308", // yellow-500
                dark: "#facc15", // yellow-400
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
              tick={{ fontSize: 12, dy:10 }}
              height={60}
              angle={0}
              textAnchor="end"
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${value}`}
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
            <Bar dataKey="Late Fees" radius={[0, 0, 0, 0]} maxBarSize={60} />
            <Bar dataKey="Interest Charged" radius={[0, 0, 0, 0]} maxBarSize={60} />
            <Bar dataKey="Other Penalties" radius={[4, 4, 0, 0]} maxBarSize={60} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
