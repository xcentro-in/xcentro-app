import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Filter, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/utils/formatters"

// Define improved color palette for charts
const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#F97316", "#10B981"];
const CHART_COLORS = {
  primary: "#6366F1",
  secondary: "#8B5CF6",
  tertiary: "#EC4899",
  success: "#10B981",
  warning: "#F97316",
  danger: "#EF4444",
  info: "#0EA5E9"
};
interface SpendingTrendProps {
  spendingData: Array<{
    name: string;
    amount: number;
  }>;
}
export const SpendingTrend: React.FC<SpendingTrendProps> = ({
  spendingData
}) => {
  return <Card className="col-span-1 md:col-span-2 animate-fade-in" style={{
    animationDelay: "150ms"
  }}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="text-lg font-semibold">Spending Trend</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={spendingData} margin={{
            top: 20,
            right: 20,
            left: 20,
            bottom: 10
          }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={value => `$${value / 1000}k`} />
              <Tooltip formatter={value => [`$${value.toLocaleString()}`, "Amount"]} contentStyle={{
              borderRadius: "0.5rem",
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            }} />
              <Bar dataKey="amount" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col xs:flex-row gap-2 items-center justify-center">
          <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary">
            <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
            16.2% increase from previous period
          </Badge>
          <Badge variant="outline" className="bg-amber-500/10 border-amber-500/20 text-amber-600">
            <Filter className="h-3.5 w-3.5 mr-1.5" />
            Marketing is your highest spending category
          </Badge>
        </div>
      </CardContent>
    </Card>;
};
interface CategoryBreakdownProps {
  categoryData: Array<{
    name: string;
    value: number;
  }>;
}
export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  categoryData
}) => {
  return <Card className="animate-fade-in" style={{
    animationDelay: "200ms"
  }}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Spending by Category</CardTitle>
        <CardDescription>
          Breakdown of your expense categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }}>
              <Pie data={categoryData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" label={({
              name,
              percent
            }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={value => [`${value}%`, "Percentage"]} contentStyle={{
              borderRadius: "0.5rem",
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-3">
          {categoryData.map((category, index) => <div key={category.name} className="flex items-center">
              <div className="h-3 w-3 rounded-full mr-2" style={{
            backgroundColor: COLORS[index % COLORS.length]
          }} />
              <span className="text-sm">{category.name}</span>
            </div>)}
        </div>
      </CardContent>
    </Card>;
};
export const TaxComplianceCard = () => {
  const navigate = useNavigate();
  return <Card className="animate-fade-in" style={{
    animationDelay: "250ms"
  }}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Your GST payments</CardTitle>
        <CardDescription>
          GST and tax-related insights
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border p-4 bg-muted/50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Tax Paid Till Date</h3>
            
          </div>
          <div className="text-2xl font-bold mb-1">{formatCurrency(12450.80)}</div>
          
          <Button className="mt-4 w-full" onClick={()=>{navigate("/gst-reports")}}>View your GST Report</Button>
        </div>
        
        <div className="rounded-md border p-4">
          <h3 className="font-medium mb-3">Recent Tax Documents</h3>
          <div className="space-y-3">
            {[{
            name: "Q2 GST Challan.pdf",
            date: "Jul 15, 2023"
          }, {
            name: "Annual Tax Summary.pdf",
            date: "Apr 30, 2023"
          }, {
            name: "Q1 GST Challan.pdf",
            date: "Apr 15, 2023"
          }].map(doc => <div key={doc.name} className="flex justify-between items-center">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{doc.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{doc.date}</span>
              </div>)}
          </div>
        </div>
      </CardContent>
    </Card>;
};
interface CashFlowForecastProps {
  cashFlowData: Array<{
    name: string;
    balance: number;
  }>;
}
export const CashFlowForecastCard: React.FC<CashFlowForecastProps> = ({
  cashFlowData
}) => {
  return <Card className="animate-fade-in" style={{
    animationDelay: "300ms"
  }}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Cash Flow Forecast</CardTitle>
        <CardDescription>
          Projected financial position
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cashFlowData} margin={{
            top: 20,
            right: 20,
            left: 20,
            bottom: 10
          }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={value => `$${value / 1000}k`} />
              <Tooltip formatter={value => [`$${value.toLocaleString()}`, "Projected Balance"]} contentStyle={{
              borderRadius: "0.5rem",
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            }} />
              <Line type="monotone" dataKey="balance" stroke={CHART_COLORS.success} strokeWidth={3} dot={{
              r: 4,
              strokeWidth: 3
            }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="rounded-md border p-4 bg-green-500/5 border-green-500/10">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <h3 className="font-medium text-green-700">Positive Cash Flow Projected</h3>
          </div>
          <p className="text-sm text-muted-foreground">Your cash flow is trending positively. No liquidity issues expected in the next 30 days.</p>
        </div>
      </CardContent>
    </Card>;
};