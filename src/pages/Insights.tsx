
import { 
  BarChart2, 
  TrendingUp, 
  CreditCard, 
  DollarSign, 
  Calendar,
  Download,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Filter
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Mock data for charts
const spendingData = [
  { name: "Jan", amount: 35000 },
  { name: "Feb", amount: 28000 },
  { name: "Mar", amount: 32000 },
  { name: "Apr", amount: 40000 },
  { name: "May", amount: 35000 },
  { name: "Jun", amount: 42000 },
  { name: "Jul", amount: 45000 },
];

const categoryData = [
  { name: "Software", value: 25 },
  { name: "Rent", value: 20 },
  { name: "Marketing", value: 18 },
  { name: "Payroll", value: 27 },
  { name: "Travel", value: 10 },
];

const COLORS = ["#0088FE", "#6366F1", "#8884D8", "#5551FF", "#4F46E5"];

const Insights = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight animate-slide-up">Financial Insights</h1>
          <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: "50ms" }}>
            Analytics and insights to optimize your business spending
          </p>
        </div>
        
        <div className="flex items-center gap-2 animate-slide-down" style={{ animationDelay: "100ms" }}>
          <Select defaultValue="thisMonth">
            <SelectTrigger className="w-[180px] h-10">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="h-10 gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {[
          { title: "Total Spend", value: "$145,245", change: 8.2, trend: "up", icon: DollarSign, description: "vs. last month" },
          { title: "Transactions", value: "342", change: 12.5, trend: "up", icon: CreditCard, description: "vs. last month" },
          { title: "Active Vendors", value: "48", change: 2.1, trend: "up", icon: FileText, description: "vs. last month" },
          { title: "Upcoming Payments", value: "$35,400", change: -5.3, trend: "down", icon: Clock, description: "vs. last month" },
        ].map((stat, index) => (
          <Card key={stat.title} className="animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className={cn(
                "flex items-center text-xs mt-1",
                stat.trend === "up" ? "text-green-500" : "text-red-500"
              )}>
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                <span>{Math.abs(stat.change)}% {stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2 animate-fade-in" style={{ animationDelay: "150ms" }}>
          <CardHeader>
            <Tabs defaultValue="spend">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle className="text-lg font-semibold">Spending Trend</CardTitle>
                <div className="flex gap-2">
                  <TabsList className="h-9">
                    <TabsTrigger value="spend">Spending</TabsTrigger>
                    <TabsTrigger value="rewards">Rewards</TabsTrigger>
                  </TabsList>
                  
                  <Select defaultValue="monthly">
                    <SelectTrigger className="w-[100px] h-9">
                      <SelectValue placeholder="View" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Tabs>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="spend">
              <TabsContent value="spend" className="mt-0 space-y-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={spendingData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tickFormatter={(value) => `$${value/1000}k`}
                      />
                      <Tooltip 
                        formatter={(value) => [`$${value.toLocaleString()}`, "Amount"]}
                        contentStyle={{ 
                          borderRadius: "0.5rem", 
                          border: "1px solid #e5e7eb",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                        }}
                      />
                      <Bar 
                        dataKey="amount" 
                        fill="rgba(79, 70, 229, 0.8)" 
                        radius={[4, 4, 0, 0]}
                        barSize={30}
                      />
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
              </TabsContent>
              <TabsContent value="rewards" className="mt-0">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={spendingData.map(item => ({ ...item, rewards: Math.round(item.amount * 0.025) }))}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false}
                      />
                      <Tooltip 
                        formatter={(value) => [value.toLocaleString(), "Points"]}
                        contentStyle={{ 
                          borderRadius: "0.5rem", 
                          border: "1px solid #e5e7eb",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="rewards" 
                        stroke="#4F46E5" 
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 3 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card className="animate-fade-in" style={{ animationDelay: "200ms" }}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Spending by Category</CardTitle>
            <CardDescription>
              Breakdown of your expense categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, "Percentage"]}
                    contentStyle={{ 
                      borderRadius: "0.5rem", 
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-3">
              {categoryData.map((category, index) => (
                <div key={category.name} className="flex items-center">
                  <div 
                    className="h-3 w-3 rounded-full mr-2" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm">{category.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="animate-fade-in" style={{ animationDelay: "250ms" }}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Tax Compliance</CardTitle>
            <CardDescription>
              GST and tax-related insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border p-4 bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Current Quarter GST</h3>
                <Badge>Due in 23 days</Badge>
              </div>
              <div className="text-2xl font-bold mb-1">$12,450.80</div>
              <div className="text-sm text-muted-foreground">Based on $83,005.33 in qualifying transactions</div>
              <Button className="mt-4 w-full">Generate GST Report</Button>
            </div>
            
            <div className="rounded-md border p-4">
              <h3 className="font-medium mb-3">Recent Tax Documents</h3>
              <div className="space-y-3">
                {[
                  { name: "Q2 GST Filing.pdf", date: "Jul 15, 2023" },
                  { name: "Annual Tax Summary.pdf", date: "Apr 30, 2023" },
                  { name: "Q1 GST Filing.pdf", date: "Apr 15, 2023" },
                ].map((doc) => (
                  <div key={doc.name} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{doc.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{doc.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="animate-fade-in" style={{ animationDelay: "300ms" }}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Cash Flow Forecast</CardTitle>
            <CardDescription>
              Projected financial position
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { name: "Today", balance: 45000 },
                    { name: "Aug 20", balance: 42000 },
                    { name: "Aug 25", balance: 51000 },
                    { name: "Aug 30", balance: 48000 },
                    { name: "Sep 5", balance: 62000 },
                    { name: "Sep 10", balance: 58000 },
                  ]}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tickFormatter={(value) => `$${value/1000}k`}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value.toLocaleString()}`, "Projected Balance"]}
                    contentStyle={{ 
                      borderRadius: "0.5rem", 
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 3 }}
                  />
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
        </Card>
      </div>
    </div>
  );
};

export default Insights;
