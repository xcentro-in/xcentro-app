
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, FileText, Filter, PlaneTakeoff, Search } from "lucide-react";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/payments/DateRangePicker";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Dummy data for redemption history
const redemptionHistoryData = [
  {
    id: "RED001",
    type: "Flight",
    partner: "Air India",
    date: "Mar 10, 2025",
    points: 12500,
    value: 11250,
    status: "Successful",
    referenceId: "#REDEEM20250310001",
  },
  {
    id: "RED002",
    type: "Hotel",
    partner: "Taj Hotels",
    date: "Feb 28, 2025",
    points: 8000,
    value: 7200,
    status: "Processing",
    referenceId: "#REDEEM20250228002",
  },
  {
    id: "RED003",
    type: "Gift Card",
    partner: "Amazon",
    date: "Feb 15, 2025",
    points: 5000,
    value: 4500,
    status: "Successful",
    referenceId: "#REDEEM20250215003",
  },
  {
    id: "RED004",
    type: "Transfer",
    partner: "ABC Retail LLP",
    date: "Feb 10, 2025",
    points: 22000,
    value: 19800,
    status: "Successful",
    referenceId: "#REDEEM20250210004",
  },
  {
    id: "RED005",
    type: "Flight",
    partner: "Indigo Airlines",
    date: "Jan 25, 2025",
    points: 10000,
    value: 9000,
    status: "Failed",
    referenceId: "#REDEEM20250125005",
  },
  {
    id: "RED006",
    type: "Hotel",
    partner: "Marriott",
    date: "Jan 20, 2025",
    points: 15000,
    value: 13500,
    status: "Successful",
    referenceId: "#REDEEM20250120006",
  },
  {
    id: "RED007",
    type: "Gift Card",
    partner: "Flipkart",
    date: "Jan 15, 2025",
    points: 3000,
    value: 2700,
    status: "Successful",
    referenceId: "#REDEEM20250115007",
  },
  {
    id: "RED008",
    type: "Transfer",
    partner: "XYZ Corp Ltd",
    date: "Jan 05, 2025",
    points: 18000,
    value: 16200,
    status: "Successful",
    referenceId: "#REDEEM20250105008",
  },
];

// Data for charts
const pieChartData = [
  { name: "Flights", value: 22500, fill: "#8884d8" },
  { name: "Hotels", value: 23000, fill: "#82ca9d" },
  { name: "Gift Cards", value: 8000, fill: "#ffc658" },
  { name: "Transfers", value: 40000, fill: "#ff8042" },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

const lineChartData = [
  { name: "Oct", points: 15000 },
  { name: "Nov", points: 22000 },
  { name: "Dec", points: 18000 },
  { name: "Jan", points: 36000 },
  { name: "Feb", points: 35000 },
  { name: "Mar", points: 12500 },
];

// Type for status badge
type StatusBadgeProps = {
  status: string;
};

// Component for status badges with appropriate colors
const StatusBadge = ({ status }: StatusBadgeProps) => {
  let variant: "default" | "destructive" | "outline" | "secondary" | null = null;
  
  switch(status) {
    case "Successful":
      variant = "default";
      break;
    case "Failed":
      variant = "destructive";
      break;
    case "Processing":
      variant = "secondary";
      break;
    default:
      variant = "outline";
  }
  
  return <Badge variant={variant}>{status}</Badge>;
};

// Type for redemption type icon
type RedemptionTypeIconProps = {
  type: string;
};

// Component for redemption type icons
const RedemptionTypeIcon = ({ type }: RedemptionTypeIconProps) => {
  switch(type) {
    case "Flight":
      return <span className="mr-2">✈️</span>;
    case "Hotel":
      return <span className="mr-2">🏨</span>;
    case "Gift Card":
      return <span className="mr-2">🎁</span>;
    case "Transfer":
      return <span className="mr-2">🔁</span>;
    default:
      return null;
  }
};

const RedemptionHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [activeTab, setActiveTab] = useState("table");

  // Filter redemption history data
  const filteredData = redemptionHistoryData.filter(item => {
    const matchesSearch = 
      item.partner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.referenceId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || item.type === filterType;
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    
    // Date filtering logic would go here if we had actual Date objects
    
    return matchesSearch && matchesType && matchesStatus;
  });
  
  // Calculate summary metrics
  const totalRedeemedPoints = redemptionHistoryData.reduce((sum, item) => sum + item.points, 0);
  
  // Calculate points redeemed this month (assuming March 2025)
  const thisMonthPoints = redemptionHistoryData
    .filter(item => item.date.includes("Mar"))
    .reduce((sum, item) => sum + item.points, 0);
  
  // Find most redeemed category
  const categoryPoints: Record<string, number> = {};
  redemptionHistoryData.forEach(item => {
    categoryPoints[item.type] = (categoryPoints[item.type] || 0) + item.points;
  });
  
  const mostRedeemedCategory = Object.entries(categoryPoints)
    .sort((a, b) => b[1] - a[1])[0];
  
  const mostRedeemedPercentage = Math.round((mostRedeemedCategory[1] / totalRedeemedPoints) * 100);
  
  // Average points per redemption
  const avgPointsPerRedemption = Math.round(totalRedeemedPoints / redemptionHistoryData.length);
  
  // Find subsidiary with max transfers
  const subsidiaryTransfers: Record<string, number> = {};
  redemptionHistoryData
    .filter(item => item.type === "Transfer")
    .forEach(item => {
      subsidiaryTransfers[item.partner] = (subsidiaryTransfers[item.partner] || 0) + item.points;
    });
  
  const maxTransferSubsidiary = Object.entries(subsidiaryTransfers)
    .sort((a, b) => b[1] - a[1])[0] || ["None", 0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Redemption History</h1>
        <p className="text-muted-foreground">
          Track all your reward point redemptions across categories and subsidiaries
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Redeemed Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRedeemedPoints.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Points This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisMonthPoints.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Most Redeemed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mostRedeemedCategory[0]} ({mostRedeemedPercentage}%)
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Points/Redemption</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgPointsPerRedemption.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Max Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">{maxTransferSubsidiary[0]}</div>
            <div className="text-sm text-muted-foreground">{maxTransferSubsidiary[1].toLocaleString()} pts</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for switching between table and charts view */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="pie">Category Distribution</TabsTrigger>
          <TabsTrigger value="line">Timeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="table">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by partner or reference ID..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Flight">Flight</SelectItem>
                  <SelectItem value="Hotel">Hotel</SelectItem>
                  <SelectItem value="Gift Card">Gift Card</SelectItem>
                  <SelectItem value="Transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Successful">Successful</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              
              <DateRangePicker
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                className="w-auto"
              />
            </div>
          </div>
          
          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Type</TableHead>
                  <TableHead>Partner</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Points Used</TableHead>
                  <TableHead className="text-right">Value (₹)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reference ID</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <RedemptionTypeIcon type={item.type} />
                          {item.type}
                        </div>
                      </TableCell>
                      <TableCell>{item.partner}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell className="text-right">{item.points.toLocaleString()}</TableCell>
                      <TableCell className="text-right">₹{item.value.toLocaleString()}</TableCell>
                      <TableCell>
                        <StatusBadge status={item.status} />
                      </TableCell>
                      <TableCell className="font-mono text-xs">{item.referenceId}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No redemption history matching the current filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="pie">
          <Card>
            <CardHeader>
              <CardTitle>Redemption by Category</CardTitle>
              <CardDescription>
                Distribution of points redeemed across different categories
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-4">
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="line">
          <Card>
            <CardHeader>
              <CardTitle>Points Redeemed Over Time</CardTitle>
              <CardDescription>
                Monthly trends of point redemptions in the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-4">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={lineChartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="points"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RedemptionHistory;
