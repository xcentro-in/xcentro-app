
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock,
  CheckCircle2,
  ChevronRight,
  Plus,
  BarChart2,
  TrendingUp,
  DollarSign,
  BanknoteIcon,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Mock data
const recentTransactions = [
  { id: 1, vendor: "Office Supplies Co.", amount: 2499.99, status: "completed", date: "Today", method: "credit" },
  { id: 2, vendor: "Cloud Services", amount: 899.00, status: "completed", date: "Yesterday", method: "bank" },
  { id: 3, vendor: "Marketing Agency", amount: 5999.99, status: "pending", date: "Aug 12", method: "credit" },
  { id: 4, vendor: "Rent Payment", amount: 8500.00, status: "upcoming", date: "Aug 15", method: "bank" },
];

const insights = [
  { title: "Monthly Spend", value: "$75,493", change: 12.8, trend: "up" },
  { title: "Reward Points", value: "24,530", change: 8.3, trend: "up" },
  { title: "Expenses Tracked", value: "94%", change: 3.1, trend: "up" },
];

const Dashboard = () => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setProgress(78), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <Badge variant="outline" className="mb-2.5 px-3 py-1.5 text-xs font-medium bg-primary/5 border-primary/10 text-primary animate-fade-in">
            Business Dashboard
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight animate-slide-up">Welcome back, John</h1>
          <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: "50ms" }}>
            Here's what's happening with your business finances today
          </p>
        </div>
        
        <div className="flex gap-3 animate-slide-down" style={{ animationDelay: "100ms" }}>
          <Button variant="outline" className="h-10 gap-2">
            <Plus className="h-4 w-4" />
            Add Account
          </Button>
          <Button className="h-10 gap-2">
            <Plus className="h-4 w-4" />
            New Payment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {insights.map((item, index) => (
          <Card key={item.title} className="overflow-hidden animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-2xl font-bold">{item.value}</div>
              <div className={cn(
                "flex items-center text-xs mt-1",
                item.trend === "up" ? "text-green-500" : "text-red-500"
              )}>
                {item.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                <span>{item.change}% from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="col-span-1 md:col-span-2 animate-fade-in" style={{ animationDelay: "150ms" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
              <CardDescription>
                Your latest financial activities
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 text-sm h-8 hover:bg-transparent hover:text-primary p-0">
              View All <ChevronRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between transition-all hover:bg-muted/50 -mx-3 p-3 rounded-md cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full",
                      transaction.method === "credit" ? "bg-primary/10" : "bg-purple-500/10"
                    )}>
                      {transaction.method === "credit" ? (
                        <CreditCard className={cn(
                          "h-5 w-5",
                          transaction.method === "credit" ? "text-primary" : "text-purple-500"
                        )} />
                      ) : (
                        <BanknoteIcon className="h-5 w-5 text-purple-500" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{transaction.vendor}</div>
                      <div className="text-xs text-muted-foreground">{transaction.date}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="font-medium">${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <div className="flex items-center gap-1.5">
                      {transaction.status === "completed" && (
                        <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-600 text-[10px] px-1.5 py-0">
                          <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                          Completed
                        </Badge>
                      )}
                      {transaction.status === "pending" && (
                        <Badge variant="outline" className="bg-amber-500/10 border-amber-500/20 text-amber-600 text-[10px] px-1.5 py-0">
                          <Clock className="h-2.5 w-2.5 mr-1" />
                          Pending
                        </Badge>
                      )}
                      {transaction.status === "upcoming" && (
                        <Badge variant="outline" className="bg-blue-500/10 border-blue-500/20 text-blue-600 text-[10px] px-1.5 py-0">
                          <Clock className="h-2.5 w-2.5 mr-1" />
                          Upcoming
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in" style={{ animationDelay: "200ms" }}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Reward Status</CardTitle>
            <CardDescription>
              Your rewards program progress
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Monthly target</span>
                <span className="text-sm font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Available Points</div>
                    <div className="text-xs text-muted-foreground">Convert or use</div>
                  </div>
                </div>
                <div className="text-base font-semibold">24,530</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Points This Month</div>
                    <div className="text-xs text-muted-foreground">Current progress</div>
                  </div>
                </div>
                <div className="text-base font-semibold">3,840</div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Redeem Points
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="animate-fade-in" style={{ animationDelay: "250ms" }}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            <CardDescription>
              Frequently used operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { title: "Schedule Payment", icon: Clock, description: "Set up future payments" },
              { title: "Bulk Transfers", icon: ArrowRight, description: "Pay multiple vendors" },
              { title: "View Analytics", icon: BarChart2, description: "Track your spending" },
            ].map((action, i) => (
              <div 
                key={action.title} 
                className="flex items-center gap-3 p-3 rounded-md border border-border hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer"
              >
                <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                  <action.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <CardHeader>
            <Tabs defaultValue="upcoming">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Payment Calendar</CardTitle>
                <TabsList className="grid grid-cols-2 h-8">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="recurring">Recurring</TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsContent value="upcoming" className="space-y-4 mt-0">
                {[
                  { vendor: "Office Rent", amount: 8500, date: "Aug 15", days: 3 },
                  { vendor: "Cloud Infrastructure", amount: 2450, date: "Aug 18", days: 6 },
                  { vendor: "Marketing Services", amount: 5999.99, date: "Aug 22", days: 10 },
                ].map((payment, i) => (
                  <div 
                    key={payment.vendor}
                    className="flex items-center justify-between p-3 rounded-md border border-border hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md bg-blue-500/10 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <div className="font-medium">{payment.vendor}</div>
                        <div className="text-xs text-muted-foreground">Due on {payment.date}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="font-medium">${payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      <div className="text-xs text-muted-foreground">in {payment.days} days</div>
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="recurring" className="space-y-4 mt-0">
                {[
                  { vendor: "Software Subscriptions", amount: 1200, frequency: "Monthly" },
                  { vendor: "Team Salaries", amount: 24500, frequency: "Monthly" },
                  { vendor: "Internet Services", amount: 499.99, frequency: "Monthly" },
                ].map((payment, i) => (
                  <div 
                    key={payment.vendor}
                    className="flex items-center justify-between p-3 rounded-md border border-border hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md bg-purple-500/10 flex items-center justify-center">
                        <Repeat className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <div className="font-medium">{payment.vendor}</div>
                        <div className="text-xs text-muted-foreground">{payment.frequency} payment</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="font-medium">${payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      <div className="text-xs text-muted-foreground">Automatic</div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
