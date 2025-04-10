import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

interface HiddenChargesChartProps {
  data?: {
    month: string;
    amount: number;
  }[];
}

const defaultData = [
  {
    month: "Jan",
    amount: 1200,
  },
  {
    month: "Feb",
    amount: 900,
  },
  {
    month: "Mar",
    amount: 1500,
  },
  {
    month: "Apr",
    amount: 800,
  },
  {
    month: "May",
    amount: 1700,
  },
  {
    month: "Jun",
    amount: 1300,
  },
];

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-md shadow-sm p-2 text-xs">
        <p className="font-medium">{`${label}`}</p>
        <p className="text-primary">{`₹${Number(payload[0].value).toLocaleString()}`}</p>
      </div>
    );
  }

  return null;
};

const HiddenChargesChart = ({ data = defaultData }: HiddenChargesChartProps) => {
  // Calculate total hidden charges
  const totalCharges = data.reduce((total, item) => total + item.amount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Hidden Charges</CardTitle>
        <CardDescription>
          Non-purchase charges on your credit cards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-2xl font-bold">₹{totalCharges.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Total hidden charges</p>
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 5,
                left: 5,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `₹${Number(value).toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="amount" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default HiddenChargesChart;
