
import React, { useState } from "react";
import { 
  CreditCard, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  CreditCardIcon,
  ChevronRight, 
  ArrowRight,
  SlidersHorizontal,
  X,
  Check
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockCreditCardBills } from "@/data/mockCreditCardBills";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Import recharts components
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Define vibrant colors for our charts
const CARD_COLORS = [
  "#3b82f6", // blue-500
  "#ef4444", // red-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
];

const EXPENSE_CATEGORIES = [
  "Rent",
  "Vendors",
  "Travel",
  "Office Supplies",
  "Utilities",
  "Entertainment",
];

// Mock data generation
const generateMockCardSpendData = () => {
  return mockCreditCardBills.map((bill, index) => ({
    cardName: `${bill.cardIssuer} (${bill.lastFourDigits})`,
    totalSpend: Math.floor(Math.random() * 200000) + 100000,
    rewardsEarned: Math.floor(Math.random() * 5000) + 1000,
    lateFees: Math.floor(Math.random() * 2000),
    interestCharged: Math.floor(Math.random() * 3000),
    otherPenalties: Math.floor(Math.random() * 1000),
    utilizationRate: Math.floor(Math.random() * 80) + 20,
    categories: EXPENSE_CATEGORIES.map(category => ({
      name: category,
      value: Math.floor(Math.random() * 50000) + 10000,
    })),
    latePaymentHistory: Array.from({ length: 6 }, (_, i) => ({
      month: i + 1,
      fees: Math.floor(Math.random() * 1000),
    })),
    cardIndex: index,
  }));
};

// Generate data for donut chart
const generateUtilizationData = (cardData) => {
  return cardData.map(card => ({
    name: card.cardName,
    value: card.utilizationRate,
    fill: CARD_COLORS[card.cardIndex % CARD_COLORS.length],
  }));
};

const generateHiddenChargesData = (cardData) => {
  return cardData.map(card => ({
    name: card.cardName,
    "Late Fees": card.lateFees,
    "Interest Charged": card.interestCharged,
    "Other Penalties": card.otherPenalties,
    total: card.lateFees + card.interestCharged + card.otherPenalties,
  }));
};

const generateRewardsData = (cardData) => {
  return [...cardData]
    .sort((a, b) => b.rewardsEarned - a.rewardsEarned)
    .map(card => ({
      name: card.cardName,
      value: card.rewardsEarned,
      fill: CARD_COLORS[card.cardIndex % CARD_COLORS.length],
    }));
};

const generateSpendingData = (cardData) => {
  return cardData.map(card => ({
    name: card.cardName,
    "Total Spend": card.totalSpend,
    "Rewards Earned": card.rewardsEarned,
  }));
};

const generateLatePaymentData = (cardData) => {
  // Combine all late payment data by month
  const monthlyData = [];
  
  for (let month = 1; month <= 6; month++) {
    const monthEntry = { month: `M${month}` };
    
    cardData.forEach(card => {
      const monthData = card.latePaymentHistory.find(entry => entry.month === month);
      if (monthData) {
        monthEntry[card.cardName] = monthData.fees;
      } else {
        monthEntry[card.cardName] = 0;
      }
    });
    
    monthlyData.push(monthEntry);
  }
  
  return monthlyData;
};

// Function to format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

export default function CreditCardAnalytics() {
  const [period, setPeriod] = useState("3m");
  const [cardData] = useState(generateMockCardSpendData());
  const [viewOptions, setViewOptions] = useState({
    showSpendingChart: true,
    showHiddenChargesChart: true,
    showUtilizationChart: true,
    showLatePaymentChart: true,
    showRewardsChart: true,
    showRecommendations: true,
    compactView: false,
  });
  const [customizeDialogOpen, setCustomizeDialogOpen] = useState(false);
  
  const utilizationData = generateUtilizationData(cardData);
  const hiddenChargesData = generateHiddenChargesData(cardData);
  const rewardsData = generateRewardsData(cardData);
  const spendingData = generateSpendingData(cardData);
  const latePaymentData = generateLatePaymentData(cardData);
  
  // Find best card (lowest fees to rewards ratio)
  const bestCard = cardData.reduce((best, current) => {
    const currentRatio = (current.lateFees + current.interestCharged + current.otherPenalties) / current.rewardsEarned;
    const bestRatio = (best.lateFees + best.interestCharged + best.otherPenalties) / best.rewardsEarned;
    
    return currentRatio < bestRatio ? current : best;
  }, cardData[0]);
  
  // Find worst card (highest fees)
  const worstCard = cardData.reduce((worst, current) => {
    const currentFees = current.lateFees + current.interestCharged + current.otherPenalties;
    const worstFees = worst.lateFees + worst.interestCharged + worst.otherPenalties;
    
    return currentFees > worstFees ? current : worst;
  }, cardData[0]);
  
  // Find card with highest utilization
  const highUtilizationCard = cardData.reduce((highest, current) => {
    return current.utilizationRate > highest.utilizationRate ? current : highest;
  }, cardData[0]);
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight animate-slide-up">Credit Card Insights & Analytics</h1>
        <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: "50ms" }}>
          Comparative analysis of your credit card spending patterns and fees
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <Tabs defaultValue="3m" className="w-[200px]" onValueChange={setPeriod}>
          <TabsList>
            <TabsTrigger value="3m">3 Months</TabsTrigger>
            <TabsTrigger value="6m">6 Months</TabsTrigger>
            <TabsTrigger value="12m">12 Months</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Dialog open={customizeDialogOpen} onOpenChange={setCustomizeDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" /> 
              Customize View
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Customize Analytics View</DialogTitle>
              <DialogDescription>
                Select which charts and information you want to see in your dashboard.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="spending" 
                    checked={viewOptions.showSpendingChart} 
                    onCheckedChange={(checked) => setViewOptions({...viewOptions, showSpendingChart: !!checked})} 
                  />
                  <Label htmlFor="spending">Total Spend Per Card</Label>
                </div>
                <div className="text-xs text-muted-foreground">Spending comparison across cards</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hidden-charges" 
                    checked={viewOptions.showHiddenChargesChart} 
                    onCheckedChange={(checked) => setViewOptions({...viewOptions, showHiddenChargesChart: !!checked})} 
                  />
                  <Label htmlFor="hidden-charges">Hidden Charges Breakdown</Label>
                </div>
                <div className="text-xs text-muted-foreground">All fees and penalties</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="utilization" 
                    checked={viewOptions.showUtilizationChart} 
                    onCheckedChange={(checked) => setViewOptions({...viewOptions, showUtilizationChart: !!checked})} 
                  />
                  <Label htmlFor="utilization">Credit Utilization</Label>
                </div>
                <div className="text-xs text-muted-foreground">Percentage of credit limit used</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="late-payment" 
                    checked={viewOptions.showLatePaymentChart} 
                    onCheckedChange={(checked) => setViewOptions({...viewOptions, showLatePaymentChart: !!checked})} 
                  />
                  <Label htmlFor="late-payment">Late Fee Trends</Label>
                </div>
                <div className="text-xs text-muted-foreground">Historical late payment patterns</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="rewards" 
                    checked={viewOptions.showRewardsChart} 
                    onCheckedChange={(checked) => setViewOptions({...viewOptions, showRewardsChart: !!checked})} 
                  />
                  <Label htmlFor="rewards">Rewards Leaderboard</Label>
                </div>
                <div className="text-xs text-muted-foreground">Cards ranked by rewards earned</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="recommendations" 
                    checked={viewOptions.showRecommendations} 
                    onCheckedChange={(checked) => setViewOptions({...viewOptions, showRecommendations: !!checked})} 
                  />
                  <Label htmlFor="recommendations">Smart Recommendations</Label>
                </div>
                <div className="text-xs text-muted-foreground">AI-powered insights and tips</div>
              </div>

              <div className="flex items-center justify-between border-t pt-4 mt-4">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="compact-view">Compact View</Label>
                </div>
                <Switch 
                  id="compact-view" 
                  checked={viewOptions.compactView} 
                  onCheckedChange={(checked) => setViewOptions({...viewOptions, compactView: checked})} 
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCustomizeDialogOpen(false)}>
                <Check className="mr-2 h-4 w-4" /> Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Key Insights Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Best Card to Use</CardTitle>
            <CardDescription>Based on rewards to fees ratio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                  <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <p className="font-semibold text-lg">{bestCard.cardName}</p>
                  <p className="text-sm text-muted-foreground">Rewards/Fee Ratio: Excellent</p>
                </div>
              </div>
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div className="mt-4">
              <div className="text-sm flex justify-between">
                <span>Rewards Earned</span>
                <span className="font-medium">{formatCurrency(bestCard.rewardsEarned)}</span>
              </div>
              <div className="text-sm flex justify-between mt-1">
                <span>Total Fees</span>
                <span className="font-medium">{formatCurrency(bestCard.lateFees + bestCard.interestCharged + bestCard.otherPenalties)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Highest Fees Card</CardTitle>
            <CardDescription>Card with most hidden charges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-300" />
                </div>
                <div>
                  <p className="font-semibold text-lg">{worstCard.cardName}</p>
                  <p className="text-sm text-muted-foreground">High fees to rewards ratio</p>
                </div>
              </div>
              <TrendingDown className="h-6 w-6 text-red-500" />
            </div>
            <div className="mt-4">
              <div className="text-sm flex justify-between">
                <span>Total Fees</span>
                <span className="font-medium">{formatCurrency(worstCard.lateFees + worstCard.interestCharged + worstCard.otherPenalties)}</span>
              </div>
              <div className="text-sm flex justify-between mt-1 text-red-500">
                <span>Late Fees</span>
                <span className="font-medium">{formatCurrency(worstCard.lateFees)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">High Utilization Alert</CardTitle>
            <CardDescription>Card closest to credit limit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-full">
                  <CreditCardIcon className="h-6 w-6 text-amber-600 dark:text-amber-300" />
                </div>
                <div>
                  <p className="font-semibold text-lg">{highUtilizationCard.cardName}</p>
                  <p className="text-sm text-muted-foreground">Utilization: {highUtilizationCard.utilizationRate}%</p>
                </div>
              </div>
              {highUtilizationCard.utilizationRate > 80 ? (
                <AlertTriangle className="h-6 w-6 text-red-500" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-amber-500" />
              )}
            </div>
            <div className="mt-4">
              <div className="w-full bg-muted rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    highUtilizationCard.utilizationRate > 80 ? 'bg-red-500' : 
                    highUtilizationCard.utilizationRate > 60 ? 'bg-amber-500' : 
                    'bg-green-500'
                  }`} 
                  style={{ width: `${highUtilizationCard.utilizationRate}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {highUtilizationCard.utilizationRate > 80 
                  ? "High utilization may impact credit score" 
                  : "Maintain utilization below 30% for optimal credit score"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Section */}
      <div className="space-y-6">
        {viewOptions.showSpendingChart && (
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
                <BarChart data={spendingData}>
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
        )}
        
        {viewOptions.showHiddenChargesChart && (
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
                <BarChart data={hiddenChargesData}>
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
        )}
        
        <div className="grid gap-6 md:grid-cols-2">
          {viewOptions.showUtilizationChart && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Credit Utilization by Card</CardTitle>
                <CardDescription>Percentage of credit limit used</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] w-full">
                <ChartContainer config={{}}>
                  <PieChart>
                    <Pie
                      data={utilizationData}
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
                      {utilizationData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={CARD_COLORS[index % CARD_COLORS.length]} 
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
          )}
          
          {viewOptions.showLatePaymentChart && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Late Fee Trends (Last 6 Months)</CardTitle>
                <CardDescription>Track late payment patterns by card</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] w-full">
                <ChartContainer 
                  config={
                    Object.fromEntries(
                      cardData.map((card, index) => [
                        card.cardName, 
                        { 
                          label: card.cardName,
                          theme: {
                            light: CARD_COLORS[index % CARD_COLORS.length],
                            dark: CARD_COLORS[index % CARD_COLORS.length],
                          } 
                        }
                      ])
                    )
                  }
                >
                  <LineChart data={latePaymentData}>
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
                      width={60}
                    />
                    <ChartTooltip 
                      content={
                        <ChartTooltipContent 
                          formatter={(value) => formatCurrency(value)} 
                        />
                      } 
                    />
                    {cardData.map((card, index) => (
                      <Line
                        key={card.cardName}
                        type="monotone"
                        dataKey={card.cardName}
                        stroke={CARD_COLORS[index % CARD_COLORS.length]}
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                    ))}
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          )}
        </div>
        
        {viewOptions.showRewardsChart && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rewards Earned Per Card</CardTitle>
              <CardDescription>Cards ranked by total rewards earned</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rewardsData.map((card, index) => (
                  <div key={card.name} className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-8 text-center font-bold">
                      #{index + 1}
                    </div>
                    <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" 
                      style={{ backgroundColor: card.fill }}>
                      <CreditCardIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm font-medium">{card.name}</div>
                      <div className="w-full bg-muted rounded-full h-2.5 mt-1">
                        <div 
                          className="h-2.5 rounded-full" 
                          style={{ 
                            width: `${(card.value / rewardsData[0].value) * 100}%`,
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
        )}
      </div>
      
      {/* Recommendations Section */}
      {viewOptions.showRecommendations && (
        <Card>
          <CardHeader>
            <CardTitle>Smart Recommendations</CardTitle>
            <CardDescription>AI-powered insights to optimize your credit card usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
              <div className="mt-0.5">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Consider using {bestCard.cardName} for large purchases</p>
                <p className="text-sm text-muted-foreground mt-1">
                  This card offers the best rewards-to-fee ratio in your wallet, making it ideal for major expenses.
                </p>
                <Button variant="link" className="px-0 h-auto py-1 text-primary flex items-center gap-1">
                  Switch spending to this card <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            {worstCard.lateFees > 0 && (
              <div className="flex items-start gap-3 p-3 bg-red-500/5 rounded-lg">
                <div className="mt-0.5">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="font-medium">High late fees detected on {worstCard.cardName}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    You've paid {formatCurrency(worstCard.lateFees)} in late fees on this card. Consider setting up auto-payments to avoid these charges.
                  </p>
                  <Button variant="link" className="px-0 h-auto py-1 text-primary flex items-center gap-1">
                    Set up auto-payment <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
            
            {highUtilizationCard.utilizationRate > 70 && (
              <div className="flex items-start gap-3 p-3 bg-amber-500/5 rounded-lg">
                <div className="mt-0.5">
                  <CreditCardIcon className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="font-medium">High utilization on {highUtilizationCard.cardName}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your card is at {highUtilizationCard.utilizationRate}% of its limit. Consider making a partial payment before the statement date to reduce utilization.
                  </p>
                  <Button variant="link" className="px-0 h-auto py-1 text-primary flex items-center gap-1">
                    Make a partial payment <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
