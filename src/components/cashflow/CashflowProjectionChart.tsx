
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
  // Sample data - in a real app, this would come from your API or state
  const today = new Date();
  const cashFlowData: DayProjection[] = generateSampleData(today);
  
  // Find the safety threshold (could be dynamic in a real app)
  const safetyThreshold = 30000;
  const warningThreshold = safetyThreshold * 0.5;
  
  // Find dates with issues
  const criticalDates = cashFlowData.filter(day => day.balance < warningThreshold);
  
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
              Inflow: {formatCurrency(data.inflow)}
            </p>
            <p className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-red-400 mr-1.5"></span>
              Outflow: {formatCurrency(data.outflow)}
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

  const chartConfig = {
    inflow: { color: "#3b82f6" },  // blue
    outflow: { color: "#ef4444" },  // red
    balance: {
      theme: {
        light: "#10b981",  // green
        dark: "#10b981"
      }
    },
    balanceWarning: {
      theme: {
        light: "#f97316",  // amber
        dark: "#f97316"
      }
    },
    balanceCritical: {
      theme: {
        light: "#ef4444",  // red
        dark: "#ef4444"
      }
    },
    projected: { color: "#9ca3af" },  // gray
    safetyThreshold: {
      theme: {
        light: "#10b981", // green
        dark: "#10b981"
      }
    },
    warningThreshold: {
      theme: {
        light: "#ef4444", // red
        dark: "#ef4444"
      }
    }
  };

  return (
    <div className="h-[350px] w-full">
      <ChartContainer config={chartConfig}>
        <LineChart data={cashFlowData} margin={{ top: 20, right: 20, left: 20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis dataKey="date" axisLine={false} tickLine={false} />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tickFormatter={value => `$${value/1000}k`} 
          />
          <ChartTooltip content={<CustomTooltip />} />
          
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
          
          {/* Inflow Line */}
          <Line 
            type="monotone" 
            dataKey="inflow" 
            name="Cash Inflow" 
            stroke="#3b82f6" 
            strokeWidth={2} 
            dot={{ r: 0 }}
            activeDot={{ r: 6, fill: "#3b82f6" }}
            strokeDasharray={(data) => data.projected ? "5 5" : "0"}
          />
          
          {/* Outflow Line */}
          <Line 
            type="monotone" 
            dataKey="outflow" 
            name="Cash Outflow" 
            stroke="#ef4444" 
            strokeWidth={2} 
            dot={{ r: 0 }}
            activeDot={{ r: 6, fill: "#ef4444" }}
            strokeDasharray={(data) => data.projected ? "5 5" : "0"}
          />
          
          {/* Balance Line */}
          <Line 
            type="monotone" 
            dataKey="balance" 
            name="Cash Balance" 
            stroke={(data) => {
              if (data.balance < warningThreshold) return "#ef4444";
              if (data.balance < safetyThreshold) return "#f97316";
              return "#10b981";
            }}
            strokeWidth={3} 
            strokeDasharray={(data) => data.projected ? "5 5" : "0"}
            dot={(data) => {
              if (data.shortfall) {
                return {
                  r: 4,
                  fill: "#ef4444",
                  stroke: "#fecaca",
                  strokeWidth: 2
                };
              }
              return { r: 0 };
            }}
            activeDot={{ r: 7, strokeWidth: 2 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

// Helper function to generate 30 days of sample data
function generateSampleData(startDate: Date): DayProjection[] {
  const data: DayProjection[] = [];
  const safetyThreshold = 30000;
  
  let currentBalance = 42560; // Starting balance
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Whether this is a projected day (future) or actual (past/today)
    const projected = date > today;
    
    // Generate some spikes for demo purposes
    const isPayroll = i % 14 === 0;
    const isRentDay = i === 1;
    const isTaxDay = i === 15;
    const isClientPaymentDay = i % 5 === 0;
    
    let inflow = Math.floor(Math.random() * 2000) + 1000;
    if (isClientPaymentDay) inflow += 15000;
    
    let outflow = Math.floor(Math.random() * 1000) + 500;
    if (isPayroll) outflow += 20000;
    if (isRentDay) outflow += 5000;
    if (isTaxDay) outflow += 8000;
    
    // Calculate new balance
    currentBalance = currentBalance + inflow - outflow;
    
    // Flag shortfalls
    const shortfall = currentBalance < safetyThreshold * 0.7;
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      balance: Math.round(currentBalance),
      inflow: inflow,
      outflow: outflow,
      projected: projected,
      shortfall: shortfall
    });
  }
  
  return data;
}

export default CashflowProjectionChart;
