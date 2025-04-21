
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Flag, 
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ApprovalTransactionList from "@/components/approvals/ApprovalTransactionList";
import { mockApprovalTransactions } from "@/data/mockApprovalTransactions";
import { useNavigate } from "react-router-dom";
import { ApprovalTransaction } from "@/types/approval";
import { toast } from "@/hooks/use-toast";

const ApprovalInbox = () => {
  const navigate = useNavigate();
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
    t.status === "flagged" || t.status === "changes_requested"
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
  };

  const handleReject = (id: string) => {
    setTransactions(prev =>
      prev.map(transaction =>
        transaction.id === id
          ? { ...transaction, status: "rejected" }
          : transaction
      )
    );
  };

  const handleFlag = (id: string) => {
    setTransactions(prev =>
      prev.map(transaction =>
        transaction.id === id
          ? { ...transaction, status: "flagged" }
          : transaction
      )
    );
  };

  const handleRequestChanges = (id: string) => {
    setTransactions(prev =>
      prev.map(transaction =>
        transaction.id === id
          ? { ...transaction, status: "changes_requested" }
          : transaction
      )
    );
  };

  // For search (case insensitive, by payee, initiator, or transaction id)
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch =
      transaction.payee.toLowerCase().includes(searchValue.toLowerCase()) ||
      transaction.initiatedBy.toLowerCase().includes(searchValue.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchValue.toLowerCase());
    return matchesSearch;
  });

  // Tab-specific data getters
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
      // Last 14 days only for approved
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      return filteredTransactions.filter(t => {
        if (t.status !== "approved") return false;
        return new Date(t.requestedDate) >= twoWeeksAgo;
      });
    }
    return [];
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight animate-slide-up">Transaction Approval Inbox</h1>
        <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: "50ms" }}>
          Review and approve pending transactions requiring your attention
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-muted/50 animate-fade-in">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50 animate-fade-in" style={{ animationDelay: "50ms" }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Urgent</p>
                <p className="text-2xl font-bold">{urgentCount}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Flagged</p>
                <p className="text-2xl font-bold">{flaggedCount}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Flag className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50 animate-fade-in" style={{ animationDelay: "150ms" }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedCount}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="animate-scale-in">
        <CardHeader className="pb-3">
          <Tabs value={activeTab} onValueChange={(tab: any) => setActiveTab(tab)} className="w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <TabsList className="h-9">
                <TabsTrigger value="pending" className="relative">
                  <span>Pending</span>
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                    {pendingCount}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="action_required" className="relative">
                  <span>Action Required</span>
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                    {actionRequiredCount}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="approved" className="relative">
                  <span>Approved</span>
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                    {transactions.filter(t => t.status === "approved").length}
                  </span>
                </TabsTrigger>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="ml-2 h-9 w-9"
                  onClick={() => {
                    toast({
                      description: "Refreshing transactions...",
                    });
                    // TODO: Add your refresh logic here
                  }}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TabsList>

              <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-3">
                <div className="relative flex-1 sm:w-[200px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search transactions..."
                    className="w-full pl-9"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <TabsContent value="pending">
              <ApprovalTransactionList
                transactions={getTabTransactions()}
                onApprove={handleApprove}
                onReject={handleReject}
                onFlag={handleFlag}
                onRequestChanges={handleRequestChanges}
              />
            </TabsContent>

            <TabsContent value="action_required">
              <ApprovalTransactionList
                transactions={getTabTransactions()}
                onApprove={handleApprove}
                onReject={handleReject}
                onFlag={handleFlag}
                onRequestChanges={handleRequestChanges}
              />
            </TabsContent>

            <TabsContent value="approved">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-0">
                    Info
                  </Badge>
                  Displaying transactions approved within the last 14 days
                </div>
                <ApprovalTransactionList
                  transactions={getTabTransactions()}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onFlag={handleFlag}
                  onRequestChanges={handleRequestChanges}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between mt-6 text-sm text-muted-foreground">
            <div>
              Showing <span className="font-medium">{getTabTransactions().length}</span> of <span className="font-medium">{transactions.length}</span> transactions
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApprovalInbox;

