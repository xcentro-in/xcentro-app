
import { useState } from "react";
import ApprovalInboxStatusCards from "@/components/approvals/ApprovalInboxStatusCards";
import ApprovalInboxTabs from "@/components/approvals/ApprovalInboxTabs";
import ApprovalTransactionList from "@/components/approvals/ApprovalTransactionList";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { mockApprovalTransactions } from "@/data/mockApprovalTransactions";
import { ApprovalTransaction } from "@/types/approval";
import { toast } from "@/hooks/use-toast";
import ApprovalInboxSearch from "@/components/approvals/ApprovalInboxSearch";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const ApprovalInbox = () => {
  const [searchValue, setSearchValue] = useState("");
  const [transactions, setTransactions] = useState<ApprovalTransaction[]>(mockApprovalTransactions);
  const [activeTab, setActiveTab] = useState<"pending" | "action_required" | "approved">("pending");

  // Transaction counts for status summary cards
  const pendingCount = transactions.filter(t =>
    t.status === "pending" || t.status === "urgent" || t.status === "flagged"
  ).length;
  const urgentCount = transactions.filter(t => t.status === "urgent").length;
  const flaggedCount = transactions.filter(t => t.status === "flagged").length;
  const completedCount = transactions.filter(t =>
    t.status === "approved" || t.status === "rejected"
  ).length;
  const actionRequiredCount = transactions.filter(t =>
    t.status === "flagged" || t.status === "changes_requested" || t.status === "urgent"
  ).length;

  // Event handlers for transaction actions
  const handleApprove = (id: string) => {
    setTransactions(prev =>
      prev.map(transaction =>
        transaction.id === id
          ? { ...transaction, status: "approved" }
          : transaction
      )
    );
    toast({
      description: `Transaction ${id} approved successfully`,
    });
  };

  const handleReject = (id: string) => {
    setTransactions(prev =>
      prev.map(transaction =>
        transaction.id === id
          ? { ...transaction, status: "rejected" }
          : transaction
      )
    );
    toast({
      description: `Transaction ${id} rejected`,
    });
  };

  const handleFlag = (id: string) => {
    setTransactions(prev =>
      prev.map(transaction =>
        transaction.id === id
          ? { ...transaction, status: "flagged" }
          : transaction
      )
    );
    toast({
      description: `Transaction ${id} flagged for review`,
    });
  };

  const handleRequestChanges = (id: string) => {
    setTransactions(prev =>
      prev.map(transaction =>
        transaction.id === id
          ? { ...transaction, status: "changes_requested" }
          : transaction
      )
    );
    toast({
      description: `Changes requested for transaction ${id}`,
    });
  };

  // Filter for search box (case insensitive, by payee, initiator, or transaction id)
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch =
      transaction.payee.toLowerCase().includes(searchValue.toLowerCase()) ||
      transaction.initiatedBy.toLowerCase().includes(searchValue.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchValue.toLowerCase());
    return matchesSearch;
  });

  // Tab-specific transaction selection
  const getTabTransactions = () => {
    if (activeTab === "pending") {
      return filteredTransactions.filter(
        t => t.status === "pending"
      );
    }
    if (activeTab === "action_required") {
      return filteredTransactions.filter(
        t => ["flagged", "urgent", "changes_requested"].includes(t.status)
      );
    }
    if (activeTab === "approved") {
      // Last 14 days only
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      return filteredTransactions.filter(t => {
        if (t.status !== "approved") return false;
        return new Date(t.requestedDate) >= twoWeeksAgo;
      });
    }
    return [];
  };

  // Tabs setup
  const tabs = [
    { value: "pending", label: "Pending", count: pendingCount },
    { value: "action_required", label: "Action Required", count: actionRequiredCount },
    { value: "approved", label: "Approved", count: transactions.filter(t => t.status === "approved").length }
  ];

  // Handler for refresh button
  const handleRefresh = () => {
    toast({
      description: "Refreshing transactions...",
    });
    // TODO: Add refresh logic
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight animate-slide-up">Transaction Approval Inbox</h1>
        <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: "50ms" }}>
          Review and approve pending transactions requiring your attention
        </p>
      </div>

      <ApprovalInboxStatusCards
        pendingCount={pendingCount}
        urgentCount={urgentCount}
        flaggedCount={flaggedCount}
        completedCount={completedCount}
      />

      <Card className="animate-scale-in">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <ApprovalInboxTabs
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <ApprovalInboxSearch 
                value={searchValue}
                onChange={setSearchValue}
                className="w-full sm:w-auto"
              />
              <Button variant="outline" size="icon" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mt-2 mb-4 text-sm text-muted-foreground">
            <div>
              Showing <span className="font-medium">{getTabTransactions().length}</span> of <span className="font-medium">{transactions.length}</span> transactions
            </div>
          </div>
          
          {/* Add the transaction list component */}
          <ApprovalTransactionList 
            transactions={getTabTransactions()}
            onApprove={handleApprove}
            onReject={handleReject}
            onFlag={handleFlag}
            onRequestChanges={handleRequestChanges}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ApprovalInbox;
