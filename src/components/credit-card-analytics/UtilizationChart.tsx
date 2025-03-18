
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Pie,
  PieChart,
  Cell
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface UtilizationChartProps {
  data: Array<{
    name: string;
    value: number;
    fill: string;
  }>;
}

export const UtilizationChart: React.FC<UtilizationChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Credit Utilization by Card</CardTitle>
        <CardDescription>Percentage of credit limit used</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px] w-full">
        <ChartContainer config={{}}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              label={({ name, value }) => `${name}: ${value}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.fill} 
                />
              ))}
            </Pie>
            <ChartTooltip 
              content={
                <ChartTooltipContent 
                  formatter={(value) => `${value}%`} 
                />
              } 
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
