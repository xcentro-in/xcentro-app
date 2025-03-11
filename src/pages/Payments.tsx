import { 
  CreditCard, 
  BanknoteIcon, 
  Plus, 
  Search, 
  Upload,
  Filter,
  ChevronDown,
  CheckCircle2,
  Clock,
  Download
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const transactions = [
  { id: 1, vendor: "Office Supplies Co.", amount: 2499.99, status: "completed", date: "Today, 2:30 PM", method: "credit" },
  { id: 2, vendor: "Cloud Services", amount: 899.00, status: "completed", date: "Yesterday, 10:15 AM", method: "bank" },
  { id: 3, vendor: "Marketing Agency", amount: 5999.99, status: "pending", date: "Aug 12, 9:30 AM", method: "credit" },
  { id: 4, vendor: "Rent Payment", amount: 8500.00, status: "upcoming", date: "Aug 15 (Scheduled)", method: "bank" },
  { id: 5, vendor: "IT Support", amount: 1299.50, status: "completed", date: "Aug 10, 3:45 PM", method: "credit" },
  { id: 6, vendor: "Office Furniture", amount: 4750.25, status: "completed", date: "Aug 5, 11:20 AM", method: "bank" },
  { id: 7, vendor: "Internet Provider", amount: 499.99, status: "upcoming", date: "Aug 20 (Scheduled)", method: "bank" },
  { id: 8, vendor: "Employee Benefits", amount: 3250.00, status: "pending", date: "Aug 14, Processing", method: "credit" },
];

const Payments = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.vendor.toLowerCase().includes(searchValue.toLowerCase());
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    const matchesMethod = methodFilter === "all" || transaction.method === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight animate-slide-up">Payments</h1>
          <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: "50ms" }}>
            Manage all your business transactions in one place
          </p>
        </div>
        
        <div className="flex gap-3 animate-slide-down" style={{ animationDelay: "100ms" }}>
          <Button variant="outline" className="h-10 gap-2">
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button 
            className="h-10 gap-2"
            onClick={() => navigate("/new-payment")}
          >
            <Plus className="h-4 w-4" />
            New Payment
          </Button>
        </div>
      </div>

      <Card className="animate-scale-in">
        <CardHeader className="pb-3">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <TabsList className="h-9">
                <TabsTrigger value="all">All Transactions</TabsTrigger>
                <TabsTrigger value="recurring">Recurring</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              </TabsList>
              
              <div className="flex w-full sm:w-auto gap-3">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search transactions" 
                    className="pl-9 h-9 w-full sm:w-[240px]"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[125px] h-9 gap-1">
                      <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={methodFilter} onValueChange={setMethodFilter}>
                    <SelectTrigger className="w-[130px] h-9 gap-1">
                      <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                      <SelectValue placeholder="Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Methods</SelectItem>
                      <SelectItem value="credit">Credit Card</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Tabs>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_1fr_auto_auto] items-center gap-4 p-4 bg-muted/50">
              <div className="font-medium">Transaction</div>
              <div className="hidden sm:block"></div>
              <div className="text-right font-medium">Amount</div>
              <div className="text-right font-medium">Status</div>
            </div>
            
            <div className="divide-y">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <div 
                    key={transaction.id}
                    className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_1fr_auto_auto] items-center gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full",
                        transaction.method === "credit" ? "bg-primary/10" : "bg-purple-500/10"
                      )}>
                        {transaction.method === "credit" ? (
                          <CreditCard className="h-5 w-5 text-primary" />
                        ) : (
                          <BanknoteIcon className="h-5 w-5 text-purple-500" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium truncate max-w-[150px] sm:max-w-none">{transaction.vendor}</div>
                        <div className="text-xs text-muted-foreground">{transaction.date}</div>
                      </div>
                    </div>
                    
                    <div className="hidden sm:block"></div>
                    
                    <div className="text-right font-medium">
                      ${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    
                    <div className="flex justify-end">
                      {transaction.status === "completed" && (
                        <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-600 text-xs">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                      {transaction.status === "pending" && (
                        <Badge variant="outline" className="bg-amber-500/10 border-amber-500/20 text-amber-600 text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                      {transaction.status === "upcoming" && (
                        <Badge variant="outline" className="bg-blue-500/10 border-blue-500/20 text-blue-600 text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Upcoming
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No transactions found matching your filters.</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{filteredTransactions.length}</span> of <span className="font-medium">{transactions.length}</span> transactions
            </div>
            
            <Button variant="outline" className="h-8 gap-1 text-xs">
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="animate-fade-in" style={{ animationDelay: "150ms" }}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Payment Methods</CardTitle>
            <CardDescription>
              Manage your payment options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border p-3 flex items-center justify-between bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Corporate Visa •••• 4242</div>
                  <div className="text-xs text-muted-foreground">Exp: 09/2025</div>
                </div>
              </div>
              <Badge>Default</Badge>
            </div>
            
            <div className="rounded-md border p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <BanknoteIcon className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <div className="font-medium">Business Checking</div>
                  <div className="text-xs text-muted-foreground">Acct: ••••8790</div>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-8">Set Default</Button>
            </div>
            
            <Button variant="outline" className="w-full gap-1 mt-2">
              <Plus className="h-4 w-4" />
              Add Payment Method
            </Button>
          </CardContent>
        </Card>
        
        <Card className="animate-fade-in" style={{ animationDelay: "200ms" }}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recently Paid Vendors</CardTitle>
            <CardDescription>
              Quick access to your frequent vendors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {["Office Supplies Co.", "Cloud Services", "Marketing Agency", "Internet Provider"].map((vendor, i) => (
              <div key={vendor} className="flex items-center justify-between p-3 rounded-md border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                    {vendor.charAt(0).toUpperCase()}
                  </div>
                  <div className="font-medium">{vendor}</div>
                </div>
                <Button size="sm" variant="outline" className="h-8">Pay</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payments;
