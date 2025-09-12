import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Filter, MapPin, Phone, Mail, Building2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockPayees } from "@/data/mockPayees";
import { getPayeeTransactions, getPayeeTotalPayments, getPayeeLastTransactionDate } from "@/data/mockPayeeTransactions";
import { Payee, BankPayee, BillerPayee, PayrollPayee } from "@/types/payee";
import { Transaction, TransactionStatus, PaymentMethod } from "@/types/transaction";
import { DateRange } from "react-day-picker";

// Import refactored components
import { FilterCard } from "@/components/payee-history/FilterCard";
import { TransactionsTable } from "@/components/payee-history/TransactionsTable";
import { DownloadActions } from "@/components/payee-history/DownloadActions";
const PayeeHistory = () => {
  const {payeeId} = useParams<{payeeId: string;}>();
  const navigate = useNavigate();
  const [payee, setPayee] = useState<Payee | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [appliedFilters, setAppliedFilters] = useState({
    status: "all" as TransactionStatus | "all",
    method: "all" as PaymentMethod | "all",
    dateRange: undefined as DateRange | undefined
  });

  // Load payee and transaction data
  useEffect(() => {
    if (!payeeId) return;
    const payeeData = mockPayees.find(p => p.id === payeeId);
    if (payeeData) {
      setPayee(payeeData);
      const payeeTransactions = getPayeeTransactions(payeeId);
      setTransactions(payeeTransactions);
    }
  }, [payeeId]);

  // Calculate totals
  const totalPaid = getPayeeTotalPayments(payeeId || "");
  const lastTransactionDate = getPayeeLastTransactionDate(payeeId || "");

  // Handle filter application
  const handleApplyFilters = (filters: {
    status: TransactionStatus | "all";
    method: PaymentMethod | "all";
    dateRange: DateRange | undefined;
  }) => {
    setAppliedFilters(filters);
  };

  // Handle filter reset
  const handleResetFilters = () => {
    setAppliedFilters({
      status: "all",
      method: "all",
      dateRange: undefined
    });
  };
  // Helper function to get payee-specific overview data
  const getPayeeOverviewData = () => {
    if (!payee) return [];
    
    switch (payee.type) {
      case 'bank':
        const bankPayee = payee as BankPayee;
        return [
          { icon: Building2, label: "Company Name", value: bankPayee.name },
          { icon: CreditCard, label: "GST Number", value: bankPayee.gstin || "Not provided" },
          { icon: MapPin, label: "Address", value: "Head Office, Business District" },
          { icon: Phone, label: "Contact Number", value: bankPayee.contactNumber },
          { icon: Mail, label: "Email", value: bankPayee.email },
          { icon: Building2, label: "Bank Name", value: bankPayee.bankName },
          { icon: CreditCard, label: "Account Number", value: bankPayee.accountNumber }
        ];
      case 'biller':
        const billerPayee = payee as BillerPayee;
        return [
          { icon: Building2, label: "Biller Name", value: billerPayee.billerName },
          { icon: CreditCard, label: "Customer ID", value: billerPayee.customerId },
          { icon: Phone, label: "Contact Number", value: billerPayee.contactNumber },
          { icon: Mail, label: "Email", value: billerPayee.email },
          { icon: Building2, label: "Billing Cycle", value: billerPayee.billingCycle }
        ];
      case 'payroll':
        const payrollPayee = payee as PayrollPayee;
        return [
          { icon: Building2, label: "Employee Name", value: payrollPayee.name },
          { icon: Phone, label: "Contact Number", value: payrollPayee.contactNumber },
          { icon: Mail, label: "Email", value: payrollPayee.email },
          { icon: Building2, label: "Bank Name", value: payrollPayee.bankName },
          { icon: CreditCard, label: "Account Number", value: payrollPayee.accountNumber },
          { icon: CreditCard, label: "Salary Amount", value: `₹${payrollPayee.salaryAmount.toLocaleString()}` }
        ];
      default:
        return [];
    }
  };

  if (!payee) {
    return <div className="p-8 text-center">
        <h2 className="text-xl font-semibold">Payee not found</h2>
        <p className="text-muted-foreground mt-2">The payee you are looking for does not exist.</p>
        <Button className="mt-4" onClick={() => navigate("/payees")}>
          Back to Payees
        </Button>
      </div>;
  }

  const overviewData = getPayeeOverviewData();

  return <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <Button variant="ghost" className="w-fit pl-0 hover:pl-0 hover:bg-transparent -ml-2 text-muted-foreground" onClick={() => navigate("/payees")}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Payees
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{payee.name}</h1>
            <p className="text-muted-foreground text-sm mt-1 capitalize">{payee.type} Payee</p>
          </div>
          <DownloadActions payeeName={payee.name} />
        </div>
      </div>
      
      {/* Tab-based Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="inline-flex bg-transparent p-0 h-auto gap-8">
          <TabsTrigger 
            value="overview" 
            className="relative rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 pt-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            className="relative rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 pt-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Payment History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {overviewData.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                      <p className="text-sm font-medium text-foreground break-words">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="mt-6 space-y-6">
          {/* Filters Section */}
          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              Filters
            </h3>
            <FilterCard onApplyFilters={handleApplyFilters} />
          </div>
          
          {/* Transactions Table */}
          <TransactionsTable transactions={transactions} appliedFilters={appliedFilters} onResetFilters={handleResetFilters} />
        </TabsContent>
      </Tabs>
    </div>;
};
export default PayeeHistory;