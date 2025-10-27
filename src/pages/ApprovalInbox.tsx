
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ApprovalInboxTabs from "@/components/approvals/ApprovalInboxTabs";
import ApprovalTransactionList from "@/components/approvals/ApprovalTransactionList";
import { mockApprovalTransactions } from "@/data/mockApprovalTransactions";
import { ApprovalStatus } from "@/types/approval";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw, Search, Info, TrendingUp, AlertCircle } from "lucide-react";
import { usePageTitle } from "@/contexts/PageTitleContext";
import { isWithinInterval, subDays } from "date-fns";

const ApprovalInbox = () => {
  const [activeTab, setActiveTab] = useState<ApprovalStatus>("pending");
  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle("Approval Inbox");
  }, [setTitle]);
  const [searchTerm, setSearchTerm] = useState("");

  // Calculate status counts
  const pendingCount = mockApprovalTransactions.filter(t => t.status === "pending").length;
  const requestChangesCount = mockApprovalTransactions.filter(t => t.status === "request_changes").length;
  const rejectedCount = mockApprovalTransactions.filter(t => t.status === "rejected").length;

  // For approved: only count last 7 days
  const approvedLast7DaysCount = useMemo(() => {
    const sevenDaysAgo = subDays(new Date(), 7);
    return mockApprovalTransactions.filter(t => {
      if (t.status !== "approved") return false;
      const requestDate = new Date(t.requestedDate);
      return isWithinInterval(requestDate, { start: sevenDaysAgo, end: new Date() });
    }).length;
  }, []);

  // Filter transactions based on active tab and filters
  const filteredTransactions = useMemo(() => {
    let filtered = mockApprovalTransactions.filter(transaction => {
      const matchesStatus = transaction.status === activeTab;
      const matchesSearch = searchTerm === "" ||
        transaction.payee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });

    // For approved tab: only show last 7 days
    if (activeTab === "approved") {
      const sevenDaysAgo = subDays(new Date(), 7);
      filtered = filtered.filter(t => {
        const requestDate = new Date(t.requestedDate);
        return isWithinInterval(requestDate, { start: sevenDaysAgo, end: new Date() });
      });
    }

    return filtered;
  }, [activeTab, searchTerm]);

  const handleRefresh = () => {
    // Add refresh logic here
    console.log("Refreshing approval transactions...");
  };

  // Define tabs with proper structure
  const tabs = [
    { value: "pending" as ApprovalStatus, label: "Pending", count: pendingCount },
    { value: "request_changes" as ApprovalStatus, label: "Request Changes", count: requestChangesCount },
    { value: "rejected" as ApprovalStatus, label: "Rejected", count: rejectedCount },
    { value: "approved" as ApprovalStatus, label: "Approved (Last 7d)", count: approvedLast7DaysCount },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-muted-foreground animate-slide-up" style={{
          animationDelay: "50ms"
        }}>
          Review and approve pending bill payments
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="animate-scale-in">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="animate-scale-in" style={{ animationDelay: "50ms" }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Need Changes</p>
                <p className="text-2xl font-bold">{requestChangesCount}</p>
              </div>
              <Info className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="animate-scale-in" style={{ animationDelay: "100ms" }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold">{rejectedCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="animate-scale-in" style={{ animationDelay: "150ms" }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Approved (7d)</p>
                <p className="text-2xl font-bold">{approvedLast7DaysCount}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <ApprovalInboxTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
      />

      {/* Info Banner for Approved Tab */}
      {activeTab === "approved" && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Showing approved bills from last 7 days. View all in Bills page.
          </AlertDescription>
        </Alert>
      )}

      <Card className="animate-scale-in">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by vendor, invoice, or description..."
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

            <ApprovalTransactionList
              transactions={filteredTransactions}
              onApprove={(id) => console.log("Approve:", id)}
              onReject={(id) => console.log("Reject:", id)}
              onRequestChanges={(id) => console.log("Request changes:", id)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApprovalInbox;
