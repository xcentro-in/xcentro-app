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

interface DayProjection {
  date: string;
  balance: number;
  inflow: number;
  outflow: number;
  projected: boolean;
  shortfall: boolean;
}

const CashflowProjectionChart: React.FC = () => {
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
          {data.shortfall && (
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

          {/* Balance Lines */}
          <Line 
            type="monotone" 
            dataKey="balance" 
            stroke="#10b981" 
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 1 }}
            strokeDasharray={(d) => d.projected ? "5 5" : "0"}
          />

          {/* Inflow Lines */}
          <Line 
            type="monotone" 
            dataKey="inflow" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            strokeDasharray={(d) => d.projected ? "5 5" : "0"}
          />

          {/* Outflow Lines */}
          <Line 
            type="monotone" 
            dataKey="outflow" 
            stroke="#ef4444" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            strokeDasharray={(d) => d.projected ? "5 5" : "0"}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

function generateWindowedData(): DayProjection[] {
  const data: DayProjection[] = [];
  const today = new Date();

  // Start from 15 days ago
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 15);

  let currentBalance = 42000; // Starting balance

  for (let i = 0; i < 31; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    // Data point is projected if it's after today
    const isProjected = date > today;

    // Generate more realistic patterns
    const isPayroll = date.getDate() === 1 || date.getDate() === 15;
    const isRentDay = date.getDate() === 1;
    const isTaxDay = date.getDate() === 15;

    // Base amounts with less volatility
    let inflow = Math.floor(Math.random() * 1000) + 2000;
    let outflow = Math.floor(Math.random() * 800) + 1500;

    // Add scheduled events with realistic amounts
    if (isPayroll) outflow += 15000;
    if (isRentDay) outflow += 4000;
    if (isTaxDay) outflow += 6000;
    if (date.getDay() === 1) inflow += 8000; // Higher inflows on Mondays

    // For projected data, add mild uncertainty
    if (isProjected) {
      inflow *= (1 + (Math.random() * 0.06 - 0.03)); // ±3% variation
      outflow *= (1 + (Math.random() * 0.06 - 0.03)); // ±3% variation
    }

    // Update balance
    currentBalance = currentBalance + inflow - outflow;

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      balance: Math.round(currentBalance),
      inflow: Math.round(inflow),
      outflow: Math.round(outflow),
      projected: isProjected,
      shortfall: currentBalance < 30000 * 0.7
    });
  }

  return data;
}

export default CashflowProjectionChart;