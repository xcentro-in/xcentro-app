
import { Upload, Plus, Download, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PaymentFilters } from "@/components/payments/PaymentFilters";
import { TransactionList } from "@/components/payments/TransactionList";

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
          <Button 
            variant="outline" 
            className="h-10 gap-2"
            onClick={() => navigate('/payees')}
          >
            <Users className="h-4 w-4" />
            Manage Payees
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
              
              <PaymentFilters 
                searchValue={searchValue}
                statusFilter={statusFilter}
                methodFilter={methodFilter}
                onSearchChange={setSearchValue}
                onStatusChange={setStatusFilter}
                onMethodChange={setMethodFilter}
              />
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
            
            <TransactionList transactions={filteredTransactions} />
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
    </div>
  );
};

export default Payments;
