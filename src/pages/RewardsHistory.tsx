import React from "react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Search, Filter, ChevronRight, Award, Clock, X, Download, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from "recharts";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const pointsEarningHistory = [
  { 
    id: "tx1",
    vendor: "Office Supplies Co.", 
    amount: 1200, 
    points: 250, 
    date: "2023-08-15", 
    type: "single",
    hasBonus: true,
    basePoints: 200,
    bonusPoints: 50,
    paymentMethod: "Credit Card",
    description: "Office furniture and supplies"
  },
  { 
    id: "tx2",
    vendor: "Cloud Services", 
    amount: 550, 
    points: 90, 
    date: "2023-08-14", 
    type: "recurring",
    hasBonus: false,
    basePoints: 90,
    bonusPoints: 0,
    paymentMethod: "Bank Transfer",
    description: "Monthly cloud infrastructure subscription"
  },
  { 
    id: "tx3",
    vendor: "Marketing Agency", 
    amount: 3500, 
    points: 600, 
    date: "2023-08-12", 
    type: "single",
    hasBonus: true,
    basePoints: 500,
    bonusPoints: 100,
    paymentMethod: "Credit Card",
    description: "Q3 Marketing campaign"
  },
  { 
    id: "tx4",
    vendor: "IT Support", 
    amount: 800, 
    points: 130, 
    date: "2023-08-10", 
    type: "recurring",
    hasBonus: false,
    basePoints: 130,
    bonusPoints: 0,
    paymentMethod: "Credit Card",
    description: "Monthly IT support services"
  },
  { 
    id: "tx5",
    vendor: "Office Furniture", 
    amount: 2800, 
    points: 475, 
    date: "2023-08-05", 
    type: "single",
    hasBonus: true,
    basePoints: 400,
    bonusPoints: 75,
    paymentMethod: "Bank Transfer",
    description: "Ergonomic desks and chairs"
  },
  { 
    id: "tx6",
    vendor: "Software Licenses", 
    amount: 1200, 
    points: 210, 
    date: "2023-08-03", 
    type: "single",
    hasBonus: false,
    basePoints: 210,
    bonusPoints: 0,
    paymentMethod: "Credit Card",
    description: "Adobe Creative Cloud licenses"
  },
  { 
    id: "tx7",
    vendor: "Corporate Catering", 
    amount: 950, 
    points: 180, 
    date: "2023-07-28", 
    type: "single",
    hasBonus: true,
    basePoints: 150,
    bonusPoints: 30,
    paymentMethod: "Credit Card",
    description: "Team lunch event"
  },
];

const monthlyPointsData = [
  { month: 'Mar', points: 1200 },
  { month: 'Apr', points: 1800 },
  { month: 'May', points: 2400 },
  { month: 'Jun', points: 2000 },
  { month: 'Jul', points: 2800 },
  { month: 'Aug', points: 3200 },
];

const categoryPointsData = [
  { category: 'Office', points: 725 },
  { category: 'IT', points: 430 },
  { category: 'Marketing', points: 600 },
  { category: 'Catering', points: 180 },
];

const chartConfig = {
  points: {
    label: "Points",
    theme: {
      light: "#6366f1",
      dark: "#818cf8",
    },
  },
};

interface DetailPanelProps {
  transaction: any;
  onClose: () => void;
  open: boolean;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ transaction, onClose, open }) => {
  const navigate = useNavigate();
  
  return (
    <Sheet open={open} onOpenChange={() => onClose()}>
      <SheetContent className="sm:max-w-md overflow-auto">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-xl font-semibold">Transaction Details</SheetTitle>
          <SheetDescription>
            Details for transaction on {format(new Date(transaction.date), "MMM d, yyyy")}
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Vendor</p>
            <p className="font-medium text-lg">{transaction.vendor}</p>
          </div>
          
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Points Earned</span>
              <span className="text-2xl font-bold text-indigo-600">{transaction.points}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Base Points</p>
                <p className="font-medium">{transaction.basePoints}</p>
              </div>
              {transaction.bonusPoints > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Bonus Points</p>
                  <p className="font-medium text-amber-600">+{transaction.bonusPoints}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="font-medium">${transaction.amount.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">{format(new Date(transaction.date), "MMM d, yyyy")}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Payment Method</p>
              <p className="font-medium">{transaction.paymentMethod}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="font-medium capitalize">{transaction.type}</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="font-medium">{transaction.description}</p>
          </div>
          
          <Button 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => navigate(`/payments/${transaction.id}`)}
          >
            View Full Transaction Details
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

interface RewardsHistoryProps {
  embeddedView?: boolean;
}

const RewardsHistory = ({ embeddedView = false }: RewardsHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("30");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date; to?: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
  });
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showCharts, setShowCharts] = useState(false);
  
  const filteredHistory = pointsEarningHistory.filter(transaction => {
    if (searchTerm && !transaction.vendor.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !transaction.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    if (typeFilter !== "all" && transaction.type !== typeFilter) {
      return false;
    }
    
    return true;
  });

  const handleRowClick = (transaction: any) => {
    setSelectedTransaction(transaction);
    setShowDetailPanel(true);
  };
  
  const totalPoints = pointsEarningHistory.reduce((sum, tx) => sum + tx.points, 0);
  const last30DaysPoints = pointsEarningHistory.filter(tx => 
    new Date(tx.date) > new Date(new Date().setDate(new Date().getDate() - 30))
  ).reduce((sum, tx) => sum + tx.points, 0);
  
  const pendingPoints = 150; // Mock value
  const redeemedPoints = 1500; // Mock value
  const availablePoints = totalPoints - redeemedPoints;

  return (
    <div className="space-y-6">
      {!embeddedView && (
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Earning History</h1>
          <p className="text-muted-foreground">
            Track all your reward point earnings across transactions
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-indigo-50 to-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Lifetime Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPoints.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last 30 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{last30DaysPoints.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPoints.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-violet-50 to-purple-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availablePoints.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {redeemedPoints.toLocaleString()} points redeemed
            </div>
          </CardContent>
        </Card>
      </div>
      
      {showCharts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Points Earned</CardTitle>
              <CardDescription>Points earned over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-60">
                <ChartContainer config={chartConfig}>
                  <BarChart data={monthlyPointsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <ChartTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                                    Month
                                  </span>
                                  <span className="font-bold text-xs">
                                    {payload[0].payload.month}
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                                    Points
                                  </span>
                                  <span className="font-bold text-xs">
                                    {payload[0].value}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar 
                      dataKey="points"
                      fill="var(--color-points)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Points by Category</CardTitle>
              <CardDescription>Breakdown of points earned by spending category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-60">
                <ChartContainer config={chartConfig}>
                  <BarChart data={categoryPointsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="category" 
                      axisLine={false} 
                      tickLine={false}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <ChartTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                                    Category
                                  </span>
                                  <span className="font-bold text-xs">
                                    {payload[0].payload.category}
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                                    Points
                                  </span>
                                  <span className="font-bold text-xs">
                                    {payload[0].value}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar 
                      dataKey="points"
                      fill="var(--color-points)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by vendor, payment method..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-3">
          <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex gap-2 w-auto justify-start">
                <Calendar className="h-4 w-4" />
                {dateFilter === "custom" 
                  ? `${format(dateRange.from, "MMM d")}${dateRange.to ? ` - ${format(dateRange.to, "MMM d")}` : ""}`
                  : dateFilter === "7" 
                    ? "Last 7 Days" 
                    : dateFilter === "30" 
                      ? "Last 30 Days" 
                      : "Last 6 Months"
                }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-3 border-b">
                <div className="space-y-2">
                  <div 
                    className={`px-3 py-1 rounded-md cursor-pointer hover:bg-muted ${dateFilter === "7" ? "bg-muted" : ""}`}
                    onClick={() => { setDateFilter("7"); setShowDatePicker(false); }}
                  >
                    Last 7 Days
                  </div>
                  <div 
                    className={`px-3 py-1 rounded-md cursor-pointer hover:bg-muted ${dateFilter === "30" ? "bg-muted" : ""}`}
                    onClick={() => { setDateFilter("30"); setShowDatePicker(false); }}
                  >
                    Last 30 Days
                  </div>
                  <div 
                    className={`px-3 py-1 rounded-md cursor-pointer hover:bg-muted ${dateFilter === "180" ? "bg-muted" : ""}`}
                    onClick={() => { setDateFilter("180"); setShowDatePicker(false); }}
                  >
                    Last 6 Months
                  </div>
                  <div 
                    className={`px-3 py-1 rounded-md cursor-pointer hover:bg-muted ${dateFilter === "custom" ? "bg-muted" : ""}`}
                    onClick={() => { setDateFilter("custom"); }}
                  >
                    Custom Range
                  </div>
                </div>
              </div>
              {dateFilter === "custom" && (
                <CalendarComponent
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => {
                    if (range?.from) {
                      setDateRange(range);
                      if (range.to) {
                        setShowDatePicker(false);
                      }
                    }
                  }}
                  numberOfMonths={2}
                  className="p-3 pointer-events-auto"
                />
              )}
            </PopoverContent>
          </Popover>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="All Types" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="single">Single Payments</SelectItem>
              <SelectItem value="recurring">Recurring Payments</SelectItem>
              <SelectItem value="batch">Batch Payments</SelectItem>
              <SelectItem value="bonus">Bonus Points</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Transaction Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Points Earned</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((transaction) => (
                <TableRow 
                  key={transaction.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(transaction)}
                >
                  <TableCell className="font-medium">{transaction.vendor}</TableCell>
                  <TableCell>{format(new Date(transaction.date), "MMM d, yyyy")}</TableCell>
                  <TableCell className="capitalize">{transaction.type}</TableCell>
                  <TableCell>{transaction.paymentMethod}</TableCell>
                  <TableCell className="text-right">${transaction.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {transaction.hasBonus && (
                        <Badge variant="luxury" className="h-5">BONUS</Badge>
                      )}
                      <span className="font-medium">{transaction.points}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredHistory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No transactions found matching your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      
      {selectedTransaction && (
        <DetailPanel 
          transaction={selectedTransaction}
          onClose={() => setShowDetailPanel(false)}
          open={showDetailPanel}
        />
      )}
    </div>
  );
};

export default RewardsHistory;
