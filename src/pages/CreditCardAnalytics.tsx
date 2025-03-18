
import React, { useState } from "react";
import { 
  CreditCard, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  CreditCardIcon,
  ChevronRight, 
  ArrowRight,
  SlidersHorizontal
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockCreditCardBills } from "@/data/mockCreditCardBills";

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

// Define some colors for our charts
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
        
        <Button variant="outline" className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" /> 
          Customize View
        </Button>
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
        {/* Total Spend Per Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Spend Per Card</CardTitle>
            <CardDescription>Compare spending across all credit cards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer
                config={{
                  "Total Spend": {
                    label: "Total Spend",
                    theme: {
                      light: "#3b82f6",
                      dark: "#60a5fa",
                    },
                  },
                  "Rewards Earned": {
                    label: "Rewards Earned",
                    theme: {
                      light: "#10b981",
                      dark: "#34d399",
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
                  />
                  <YAxis 
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₹${value/1000}k`}
                    tick={{ fontSize: 12 }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => formatCurrency(value)}
                      />
                    }
                  />
                  <Bar dataKey="Total Spend" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Rewards Earned" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Hidden Charges Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Hidden Charges Breakdown</CardTitle>
            <CardDescription>Late fees, interest, and other penalties by card</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer
                config={{
                  "Late Fees": {
                    label: "Late Fees",
                    theme: {
                      light: "#ef4444",
                      dark: "#f87171",
                    },
                  },
                  "Interest Charged": {
                    label: "Interest Charged",
                    theme: {
                      light: "#f59e0b",
                      dark: "#fbbf24",
                    },
                  },
                  "Other Penalties": {
                    label: "Other Penalties",
                    theme: {
                      light: "#eab308",
                      dark: "#facc15",
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
                  />
                  <YAxis 
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₹${value}`}
                    tick={{ fontSize: 12 }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => formatCurrency(value)}
                      />
                    }
                  />
                  <Bar dataKey="Late Fees" stackId="a" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Interest Charged" stackId="a" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Other Penalties" stackId="a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Utilization Rate Per Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Credit Utilization by Card</CardTitle>
              <CardDescription>Percentage of credit limit used</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
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
              </div>
            </CardContent>
          </Card>
          
          {/* Late Payment Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Late Fee Trends (Last 6 Months)</CardTitle>
              <CardDescription>Track late payment patterns by card</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
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
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Rewards Leaderboard */}
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
      </div>
      
      {/* Recommendations Section */}
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
    </div>
  );
}
