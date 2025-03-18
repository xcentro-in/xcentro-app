
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CARD_COLORS, formatCurrency } from "./utils/chartUtils";

interface LatePaymentChartProps {
  data: Array<{
    month: string;
    [key: string]: string | number;
  }>;
  cardNames: string[];
}

export const LatePaymentChart: React.FC<LatePaymentChartProps> = ({ data, cardNames }) => {
  const config = Object.fromEntries(
    cardNames.map((cardName, index) => [
      cardName, 
      { 
        label: cardName,
        theme: {
          light: CARD_COLORS[index % CARD_COLORS.length],
          dark: CARD_COLORS[index % CARD_COLORS.length],
        } 
      }
    ])
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Late Fee Trends (Last 6 Months)</CardTitle>
        <CardDescription>Track late payment patterns by card</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px] w-full">
        <ChartContainer config={config}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="month" 
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${value}`}
              tick={{ fontSize: 12 }}
              width={60}
            />
            <ChartTooltip 
              content={
                <ChartTooltipContent 
                  formatter={(value) => formatCurrency(value as number)} 
                />
              } 
            />
            {cardNames.map((cardName, index) => (
              <Line
                key={cardName}
                type="monotone"
                dataKey={cardName}
                stroke={CARD_COLORS[index % CARD_COLORS.length]}
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
