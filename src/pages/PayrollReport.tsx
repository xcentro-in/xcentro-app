
import React, { useState } from "react";
import { ArrowRight, Info, Calendar, TrendingUp, CreditCard, FileText, AlertTriangle, Sliders } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { formatCurrency } from "@/utils/formatters";

const PayrollReport = () => {
  const [payDate, setPayDate] = useState(25);
  
  // Mock data for charts and tables
  const payrollData = {
    totalSalary: 380000,
    daysUntilPayday: 6,
    incomingPayments: 150000,
    shortfall: 230000,
    cardPaymentSuggestion: 150000,
    bankPaymentSuggestion: 230000,
    lastMonthDelay: 2,
    paymentMethodData: [
      { name: "Bank Transfer", value: 70 },
      { name: "Credit Card", value: 30 }
    ],
    complianceData: [
      { name: "TDS", deducted: 100000, deposited: 80000, due: "Apr 7", status: "Pending" },
      { name: "PF", deducted: 50000, deposited: 50000, due: "Apr 15", status: "Completed" },
      { name: "ESI", deducted: 25000, deposited: 25000, due: "Apr 21", status: "Completed" }
    ],
    salaryTrendData: [
      { month: "Jan", amount: 350000 },
      { month: "Feb", amount: 360000 },
      { month: "Mar", amount: 370000 },
      { month: "Apr", amount: 380000 },
    ],
    paymentTimelinessData: [
      { month: "Jan", onTime: 100 },
      { month: "Feb", onTime: 100 },
      { month: "Mar", delayed: 2 },
      { month: "Apr", predicted: 0 }
    ],
    employeeData: [
      { id: 1, name: "Amit Sharma", gross: 80000, deductions: 15000, net: 65000 },
      { id: 2, name: "Priya Singh", gross: 65000, deductions: 12000, net: 53000 },
      { id: 3, name: "Rahul Gupta", gross: 90000, deductions: 18000, net: 72000 },
      { id: 4, name: "Neha Patel", gross: 75000, deductions: 14000, net: 61000 },
      { id: 5, name: "Vijay Kumar", gross: 70000, deductions: 13000, net: 57000 }
    ]
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const simulatePaydayChange = (newDate: number) => {
    setPayDate(newDate);
    // In a real app, this would recalculate cash flow projections
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight animate-slide-up">Payroll Report</h1>
        <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: "50ms" }}>
          Optimize your salary payments and track compliance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Salary Commitment */}
        <Card className="col-span-1 md:col-span-2 border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming Salary Commitment</CardTitle>
            <CardDescription>Based on your previous payroll patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div>
                <p className="text-muted-foreground text-sm">Your payroll this month</p>
                <p className="text-3xl font-bold tracking-tight text-blue-500">
                  {formatCurrency(payrollData.totalSalary)}
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950 rounded-md px-3 py-1.5 text-sm">
                Due in {payrollData.daysUntilPayday} days
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projected Cash Flow vs Salary Obligation */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Cash Flow vs Salary</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">This shows projected cash inflow before your payroll date versus your total salary obligation</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-muted-foreground">Incoming before payroll</span>
                  <span>{formatCurrency(payrollData.incomingPayments)}</span>
                </div>
                <Progress value={(payrollData.incomingPayments / payrollData.totalSalary) * 100} className="h-2" />
              </div>
              <div className="flex items-center gap-2 text-red-500 text-sm font-medium">
                <AlertTriangle className="h-4 w-4" />
                <span>You're {formatCurrency(payrollData.shortfall)} short for payroll</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Smart Payment Suggestion */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Smart Payment Suggestion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">Consider this optimized payment method split:</p>
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Credit Card</span>
                <span className="font-medium">{formatCurrency(payrollData.cardPaymentSuggestion)}</span>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Bank Transfer</span>
                <span className="font-medium">{formatCurrency(payrollData.bankPaymentSuggestion)}</span>
              </div>
            </div>
            <Button className="w-full">
              Disburse Salary
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Payment Timeliness */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Salary Payment Timeliness</CardTitle>
            <CardDescription>
              {payrollData.lastMonthDelay > 0 ? 
                `You paid ${payrollData.lastMonthDelay} days late last month` : 
                'All salaries were paid on time recently'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={payrollData.paymentTimelinessData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis 
                    label={{ value: 'Days Delayed', angle: -90, position: 'insideLeft' }} 
                    allowDecimals={false}
                  />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="onTime" name="On Time" fill="#4ade80" />
                  <Bar dataKey="delayed" name="Days Delayed" fill="#f87171" />
                  <Bar dataKey="predicted" name="Predicted" fill="#60a5fa" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {payrollData.lastMonthDelay > 0 && (
              <div className="mt-4 bg-amber-50 dark:bg-amber-950/30 rounded-md p-3 text-sm">
                <div className="flex gap-2 items-center text-amber-600 dark:text-amber-400 font-medium mb-1">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Risk Alert</span>
                </div>
                <p>Consider using auto-scheduled card payments to avoid delays.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Method Analysis */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Payment Method Analysis</CardTitle>
            <CardDescription>Current distribution of salary payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={payrollData.paymentMethodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {payrollData.paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-sm">
              <p className="text-muted-foreground">Optimization tip:</p>
              <p>Switching ₹2 lakh more to credit card would earn you additional ₹10k in rewards annually.</p>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Tracker */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Compliance Tracker</CardTitle>
            <CardDescription>Monthly statutory deductions status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Deducted</TableHead>
                    <TableHead>Deposited</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollData.complianceData.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{formatCurrency(item.deducted)}</TableCell>
                      <TableCell>{formatCurrency(item.deposited)}</TableCell>
                      <TableCell>{item.due}</TableCell>
                      <TableCell>
                        <Badge variant={item.status === "Completed" ? "outline" : "secondary"}>
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Payday Simulation Tool */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Payday Simulation Tool</CardTitle>
            <CardDescription>
              Adjust your payment date to see impact on cash flow
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Earlier</span>
                <span>Current: Day {payDate}</span>
                <span>Later</span>
              </div>
              <Slider
                value={[payDate]}
                min={1}
                max={31}
                step={1}
                onValueChange={(value) => simulatePaydayChange(value[0])}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Cash Flow Impact</span>
                </div>
                <p className="text-sm">
                  {payDate < 25 ? 
                    "Moving payday earlier increases cash flow pressure." : 
                    payDate > 25 ? 
                      "Moving payday later improves immediate cash flow." :
                      "Current payday is optimal for your cash flow."
                  }
                </p>
              </div>
              
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Card Billing Impact</span>
                </div>
                <p className="text-sm">
                  {payDate < 20 ? 
                    "Falls in current billing cycle." : 
                    payDate > 20 ? 
                      "Falls in next billing cycle, giving 25+ days float." :
                      "Current payday aligns with billing cycle."
                  }
                </p>
              </div>
              
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Rewards Optimization</span>
                </div>
                <p className="text-sm">
                  {payDate < 15 ? 
                    "Suboptimal for maximizing quarterly rewards." : 
                    payDate > 25 ? 
                      "Optimal timing for quarterly reward calculation." :
                      "Good balance for reward accumulation."
                  }
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled={payDate === 25}>
              Apply New Payment Date
            </Button>
          </CardFooter>
        </Card>

        {/* Employee-Level Insights */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Employee Salary Breakdown</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Individual salary details including gross pay, deductions, and net pay</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead className="text-right">Gross Pay</TableHead>
                    <TableHead className="text-right">Deductions</TableHead>
                    <TableHead className="text-right">Net Pay</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollData.employeeData.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell className="text-right">{formatCurrency(employee.gross)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(employee.deductions)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(employee.net)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <tfoot className="border-t">
                  <TableRow>
                    <TableCell className="font-medium">Total</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(
                        payrollData.employeeData.reduce((sum, emp) => sum + emp.gross, 0)
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(
                        payrollData.employeeData.reduce((sum, emp) => sum + emp.deductions, 0)
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(
                        payrollData.employeeData.reduce((sum, emp) => sum + emp.net, 0)
                      )}
                    </TableCell>
                  </TableRow>
                </tfoot>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Payroll Variance Report */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Payroll Variance Report</CardTitle>
            <CardDescription>Month-over-month changes in payroll costs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={payrollData.salaryTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis 
                    tickFormatter={(value) => `₹${value / 1000}k`}
                    width={80}
                  />
                  <RechartsTooltip 
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']} 
                  />
                  <Legend />
                  <Bar 
                    dataKey="amount" 
                    name="Total Payroll" 
                    fill="#3b82f6" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 bg-blue-50 dark:bg-blue-950/30 rounded-md p-3 text-sm">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium mb-1">
                <TrendingUp className="h-4 w-4" />
                <span>Trend Analysis</span>
              </div>
              <p>Payroll increased by ₹10,000 this month due to annual increments.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PayrollReport;
