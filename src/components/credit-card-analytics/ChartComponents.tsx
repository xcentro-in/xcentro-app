import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LineChart,
  Line,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  TooltipProps,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Define vibrant colors for charts
export const CARD_COLORS = [
  "#3b82f6", // blue-500
  "#ef4444", // red-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
];

// Function to format currency
export const formatCurrency = (value: number | string) => {
  // Make sure the value is a number
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  // Check if value is a valid number
  if (isNaN(numValue)) return '₹0';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(numValue);
};

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
              tick={{ fontSize: 12 }}
              height={60}
              angle={-45}
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
            <Bar dataKey="Late Fees" stackId="a" radius={[0, 0, 0, 0]} maxBarSize={60} />
            <Bar dataKey="Interest Charged" stackId="a" radius={[0, 0, 0, 0]} maxBarSize={60} />
            <Bar dataKey="Other Penalties" stackId="a" radius={[4, 4, 0, 0]} maxBarSize={60} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

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

interface RewardsLeaderboardProps {
  data: Array<{
    name: string;
    value: number;
    fill: string;
  }>;
}

export const RewardsLeaderboard: React.FC<RewardsLeaderboardProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Rewards Earned Per Card</CardTitle>
        <CardDescription>Cards ranked by total rewards earned</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((card, index) => (
            <div key={card.name} className="flex items-center gap-4">
              <div className="flex-shrink-0 w-8 text-center font-bold">
                #{index + 1}
              </div>
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" 
                style={{ backgroundColor: card.fill }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
              </div>
              <div className="flex-grow">
                <div className="text-sm font-medium">{card.name}</div>
                <div className="w-full bg-muted rounded-full h-2.5 mt-1">
                  <div 
                    className="h-2.5 rounded-full" 
                    style={{ 
                      width: `${(card.value / data[0].value) * 100}%`,
                      backgroundColor: card.fill
                    }}
                  ></div>
                </div>
              </div>
              <div className="text-right font-semibold">
                {formatCurrency(card.value)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
