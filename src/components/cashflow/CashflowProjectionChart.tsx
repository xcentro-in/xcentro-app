import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer
} from "recharts";
import { CheckCircleIcon, ExclamationTriangleIcon } from "./CashflowIcons";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface DayProjection {
  date: string;
  balance: number;
  inflow: number;
  outflow: number;
  projected: boolean;
  shortfall: boolean;
}

const CashflowProjectionChart: React.FC = () => {
  // Generate data for 30-day window (15 days past + today + 14 days future)
  const cashFlowData: DayProjection[] = generateWindowedData();

  const safetyThreshold = 30000;
  const warningThreshold = safetyThreshold * 0.5;

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isProjected = data.projected;
      const isShortfall = data.shortfall;

      return (
        <div className="rounded-lg border bg-background p-2 shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            {isProjected ? "Projected " : ""}Balance: <span className={`font-medium ${data.balance < warningThreshold ? "text-red-500" : data.balance < safetyThreshold ? "text-amber-500" : "text-green-500"}`}>
              {formatCurrency(data.balance)}
            </span>
          </p>
          <div className="mt-1 space-y-1 text-xs">
            <p className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-blue-500 mr-1.5"></span>
              {isProjected ? "Projected " : ""}Inflow: {formatCurrency(data.inflow)}
            </p>
            <p className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-red-400 mr-1.5"></span>
              {isProjected ? "Projected " : ""}Outflow: {formatCurrency(data.outflow)}
            </p>
          </div>
          {isShortfall && (
            <div className="mt-1.5 text-xs text-amber-500 flex items-center">
              <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
              Potential cash shortfall
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Split data for actual and projected lines
  const actualData = cashFlowData.filter(day => !day.projected);
  const projectedData = cashFlowData.filter(day => day.projected);

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer>
        <LineChart data={cashFlowData} margin={{ top: 20, right: 20, bottom: 10, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tickFormatter={value => `$${value/1000}k`}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Safety Threshold Line */}
          <ReferenceLine 
            y={safetyThreshold} 
            stroke="#10b981" 
            strokeDasharray="3 3" 
            label={{ 
              value: "Safety Threshold", 
              position: "insideTopRight",
              style: { fill: "#10b981", fontSize: 12 }
            }} 
          />

          {/* Warning Threshold Line */}
          <ReferenceLine 
            y={warningThreshold} 
            stroke="#ef4444" 
            strokeDasharray="3 3" 
            label={{ 
              value: "Critical Level", 
              position: "insideBottomRight",
              style: { fill: "#ef4444", fontSize: 12 }
            }} 
          />

          {/* Actual Balance Line */}
          <Line 
            type="monotone" 
            dataKey="balance" 
            data={actualData}
            stroke="#10b981" 
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 1 }}
          />

          {/* Projected Balance Line */}
          <Line 
            type="monotone" 
            dataKey="balance" 
            data={projectedData}
            stroke="#10b981" 
            strokeWidth={2.5}
            strokeDasharray="5 5"
            dot={false}
            activeDot={{ r: 6, strokeWidth: 1 }}
          />

          {/* Actual Inflow Line */}
          <Line 
            type="monotone" 
            dataKey="inflow" 
            data={actualData}
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />

          {/* Projected Inflow Line */}
          <Line 
            type="monotone" 
            dataKey="inflow" 
            data={projectedData}
            stroke="#3b82f6" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            activeDot={{ r: 4 }}
          />

          {/* Actual Outflow Line */}
          <Line 
            type="monotone" 
            dataKey="outflow" 
            data={actualData}
            stroke="#ef4444" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />

          {/* Projected Outflow Line */}
          <Line 
            type="monotone" 
            dataKey="outflow" 
            data={projectedData}
            stroke="#ef4444" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Helper function to generate 30-day window data
function generateWindowedData(): DayProjection[] {
  const data: DayProjection[] = [];
  const safetyThreshold = 30000;

  let currentBalance = 42560; // Starting balance
  const today = new Date();

  // Start from 15 days ago
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 15);

  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    // Data point is projected if it's after today
    const projected = date > today;

    // Generate some realistic patterns
    const isPayroll = i % 14 === 0;
    const isRentDay = date.getDate() === 1;
    const isTaxDay = date.getDate() === 15;
    const isClientPaymentDay = i % 5 === 0;

    // Base amounts
    let inflow = Math.floor(Math.random() * 2000) + 1000;
    let outflow = Math.floor(Math.random() * 1000) + 500;

    // Add scheduled events
    if (isClientPaymentDay) inflow += 15000;
    if (isPayroll) outflow += 20000;
    if (isRentDay) outflow += 5000;
    if (isTaxDay) outflow += 8000;

    // For projected data, add some uncertainty
    if (projected) {
      inflow *= (1 + (Math.random() * 0.1 - 0.05)); // ±5% variation
      outflow *= (1 + (Math.random() * 0.1 - 0.05)); // ±5% variation
    }

    // Update balance
    currentBalance = currentBalance + inflow - outflow;

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      balance: Math.round(currentBalance),
      inflow: Math.round(inflow),
      outflow: Math.round(outflow),
      projected: projected,
      shortfall: currentBalance < safetyThreshold * 0.7
    });
  }

  return data;
}

export default CashflowProjectionChart;