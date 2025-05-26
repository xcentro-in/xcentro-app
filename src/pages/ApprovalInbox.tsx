import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import ApprovalInboxStatusCards from "@/components/approvals/ApprovalInboxStatusCards";
import ApprovalInboxTabs from "@/components/approvals/ApprovalInboxTabs";
import ApprovalFilters from "@/components/approvals/ApprovalFilters";
import ApprovalTransactionList from "@/components/approvals/ApprovalTransactionList";
import { mockApprovalTransactions } from "@/data/mockApprovalTransactions";
import { ApprovalStatus } from "@/types/approval";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw, Search } from "lucide-react";

const ApprovalInbox = () => {
  const [activeTab, setActiveTab] = useState<ApprovalStatus>("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("all");
  const [selectedAmountRange, setSelectedAmountRange] = useState<string>("all");
  const [selectedDateRange, setSelectedDateRange] = useState<string>("all");

  // Filter transactions based on active tab and filters
  const filteredTransactions = mockApprovalTransactions.filter(transaction => {
    const matchesStatus = transaction.status === activeTab;
    const matchesSearch = searchTerm === "" || 
      transaction.payeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const handleRefresh = () => {
    // Add refresh logic here
    console.log("Refreshing approval transactions...");
  };

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight animate-slide-up">
          Approval Inbox
        </h1>
        <p className="text-muted-foreground animate-slide-up" style={{
          animationDelay: "50ms"
        }}>
          Review and approve pending transactions
        </p>
      </div>

      <ApprovalInboxStatusCards />

      <Card className="animate-scale-in">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <ApprovalInboxTabs 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
            />
            
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>

            <ApprovalFilters
              selectedPaymentMethod={selectedPaymentMethod}
              onPaymentMethodChange={setSelectedPaymentMethod}
              selectedAmountRange={selectedAmountRange}
              onAmountRangeChange={setSelectedAmountRange}
              selectedDateRange={selectedDateRange}
              onDateRangeChange={setSelectedDateRange}
            />

            <ApprovalTransactionList 
              transactions={filteredTransactions}
              onApprove={(id) => console.log("Approve:", id)}
              onReject={(id) => console.log("Reject:", id)}
              onView={(id) => console.log("View:", id)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApprovalInbox;
