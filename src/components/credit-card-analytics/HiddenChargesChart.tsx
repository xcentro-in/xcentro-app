
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
                light: "#475569", // slate-600
                dark: "#64748b", // slate-500
              },
            },
            "Interest Charged": {
              label: "Interest Charged",
              theme: {
                light: "#0f766e", // teal-700
                dark: "#14b8a6", // teal-500
              },
            },
            "Other Penalties": {
              label: "Other Penalties",
              theme: {
                light: "#0369a1", // sky-700
                dark: "#0ea5e9", // sky-500
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
                      <div className="mt-1 pt-1 border-t">
                        <span className="text-sm font-medium">Total: {formatCurrency(payload.reduce((sum, item) => sum + item.value, 0))}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar 
              dataKey="Late Fees" 
              radius={[0, 0, 0, 0]} 
              maxBarSize={60} 
              fill="#475569"
            />
            <Bar 
              dataKey="Interest Charged" 
              radius={[0, 0, 0, 0]} 
              maxBarSize={60}
              fill="#0f766e"
            />
            <Bar 
              dataKey="Other Penalties" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={60}
              fill="#0369a1"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
