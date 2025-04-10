
import React, { useState } from "react";
import { ArrowLeftIcon, Info, DollarSign, AlertCircle, Calendar, CreditCard, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";

// Mock data for the timeliness chart
const timelinessData = [
  { month: 'Jan', days: 0 },
  { month: 'Feb', days: 1 },
  { month: 'Mar', days: 0 },
  { month: 'Apr', days: 0 },
  { month: 'May', days: 2 },
  { month: 'Jun', days: 0 },
];

const PayrollReport = () => {
  // State for payday simulation
  const [paymentDate, setPaymentDate] = useState<number>(25); // Default to 25th of month
  const [cashFlowImpact, setCashFlowImpact] = useState<number>(23000);
  const [rewardsEarned, setRewardsEarned] = useState<number>(2300);
  const [expanded, setExpanded] = useState<boolean>(true);
  
  // Simulate effects of changing payment date
  const handlePaymentDateChange = (value: number[]) => {
    const newDate = value[0];
    setPaymentDate(newDate);
    
    // Simulate cash flow impact based on date
    // Earlier dates have more negative impact, later dates less negative
    const newImpact = 230000 - ((newDate - 25) * 10000);
    setCashFlowImpact(newImpact > 0 ? newImpact : 0);
    
    // Simulate rewards based on the date (more rewards for optimal timing)
    const newRewards = 2300 + ((Math.abs(newDate - 28) < 3) ? 700 : 0);
    setRewardsEarned(newRewards);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payroll Report</h1>
          <p className="text-muted-foreground mt-1">
            Smart payroll insights and optimization tools
          </p>
        </div>
        <Link to="/insights">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Insights
          </Button>
        </Link>
      </div>

      {/* Upcoming Salary Commitment */}
      <Card className="border-2 border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/50">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-medium text-amber-800 dark:text-amber-500">Upcoming Salary Commitment</h2>
              <p className="text-4xl font-bold mt-1">₹3,80,000</p>
              <p className="text-amber-700 dark:text-amber-400 font-medium mt-1">Due in 6 days</p>
            </div>
            <div className="hidden md:block">
              <Calendar className="h-12 w-12 text-amber-600 dark:text-amber-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projected Cash Flow */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Projected Cash Flow vs Salary Obligation
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Based on upcoming invoices, expected payments, and current bank balance.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <CardDescription>Cash flow projections before payroll date</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Current balance</span>
                <span className="font-bold">₹2,00,000</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Expected incoming</span>
                <span className="font-bold text-green-600">+₹1,50,000</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Payroll amount</span>
                <span className="font-bold text-amber-600">-₹3,80,000</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold">Projected shortage</span>
                <span className="font-bold text-red-600">₹2,30,000</span>
              </div>
            </div>
            
            <div className="relative pt-2">
              <div className="mb-2 flex justify-between text-xs">
                <span>Current balance</span>
                <span>Payroll need</span>
              </div>
              <Progress value={52} className="h-4" />
              <div className="mt-1 flex justify-end text-xs text-muted-foreground">
                <span>52% funded</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Smart Payment Suggestion */}
        <Card className="border-green-100 bg-green-50/50 dark:bg-green-950/20 dark:border-green-900/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Smart Payment Suggestion
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Optimized for your cash flow, credit card cycles, and rewards earning.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-900/30">
              <p className="text-lg">
                Consider paying <span className="font-bold text-green-700 dark:text-green-500">₹1,50,000 via credit card</span> and the rest via bank to smooth cash outflows.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-md">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Card payment</span>
                  </div>
                  <p className="text-lg font-bold mt-1">₹1,50,000</p>
                  <p className="text-xs text-muted-foreground mt-1">Rewards: +1,500 points</p>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Bank payment</span>
                  </div>
                  <p className="text-lg font-bold mt-1">₹2,30,000</p>
                  <p className="text-xs text-muted-foreground mt-1">From savings account</p>
                </div>
              </div>
            </div>
            <Button className="w-full">Disburse Salary</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Salary Payment Timeliness */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Salary Payment Timeliness
              <AlertCircle className="h-4 w-4 text-amber-600" />
            </CardTitle>
            <CardDescription>Historical payment timeline analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelinessData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis label={{ value: 'Days Late', angle: -90, position: 'insideLeft' }} />
                  <RechartsTooltip formatter={(value) => [`${value} days late`, 'Delay']} />
                  <Line 
                    type="monotone" 
                    dataKey="days" 
                    stroke="#f59e0b" 
                    strokeWidth={2} 
                    dot={{ r: 5, fill: '#f59e0b', strokeWidth: 0 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-900/50">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <span className="font-medium">Risk Alert</span>
              </div>
              <p className="mt-1">You paid 2 days late last month. Consider using auto-scheduled card payments.</p>
            </div>
          </CardContent>
        </Card>

        {/* Payday Simulation Tool */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                Payday Simulation Tool
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Simulate different payment dates to optimize your cash flow and rewards.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setExpanded(!expanded)}
                className="h-8 w-8 p-0"
              >
                {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
            <CardDescription>Drag to change payment date and see impact</CardDescription>
          </CardHeader>
          {expanded && (
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Payment Date:</span>
                  <span className="text-xl font-bold">{paymentDate}th</span>
                </div>
                <div>
                  <Slider
                    defaultValue={[25]}
                    max={30}
                    min={20}
                    step={1}
                    onValueChange={handlePaymentDateChange}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>20th</span>
                    <span>30th</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span className="font-medium">Cash Flow Impact</span>
                  </div>
                  <div className={`text-lg font-bold ${cashFlowImpact > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {cashFlowImpact > 0 ? `-₹${(cashFlowImpact/1000).toFixed(0)}K` : '₹0'}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">Rewards Points</span>
                  </div>
                  <div className="text-lg font-bold text-amber-600">
                    +{rewardsEarned} points
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md border border-blue-200 dark:border-blue-900/50">
                <p className="text-sm">
                  <span className="font-medium">Suggestion:</span> The 28th is optimal for your cash flow 
                  and will sync better with your credit card billing cycle.
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PayrollReport;
