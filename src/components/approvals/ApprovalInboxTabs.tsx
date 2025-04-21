
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ApprovalTransactionList from "@/components/approvals/ApprovalTransactionList";
import ApprovalInboxSearch from "./ApprovalInboxSearch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { ApprovalTransaction } from "@/types/approval";

interface ApprovalInboxTabsProps {
  tabs: { value: string; label: string; count: number }[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  transactions: ApprovalTransaction[];
  tabTransactions: ApprovalTransaction[];
  searchValue: string;
  setSearchValue: (val: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onFlag: (id: string) => void;
  onRequestChanges: (id: string) => void;
  onRefresh: () => void;
}

const ApprovalInboxTabs = ({
  tabs,
  activeTab,
  setActiveTab,
  transactions,
  tabTransactions,
  searchValue,
  setSearchValue,
  onApprove,
  onReject,
  onFlag,
  onRequestChanges,
  onRefresh
}: ApprovalInboxTabsProps) => (
  <Tabs value={activeTab} onValueChange={(tab: any) => setActiveTab(tab)} className="w-full">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <TabsList className="h-9">
        {tabs.map(tab => (
          <TabsTrigger key={tab.value} value={tab.value} className="relative">
            <span>{tab.label}</span>
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {tab.count}
            </span>
          </TabsTrigger>
        ))}
        <Button 
          variant="ghost" 
          size="icon"
          className="ml-2 h-9 w-9"
          onClick={onRefresh}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </TabsList>
      <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-3">
        <ApprovalInboxSearch searchValue={searchValue} setSearchValue={setSearchValue} />
      </div>
    </div>

    {tabs.map(tab => (
      <TabsContent key={tab.value} value={tab.value}>
        {tab.value === "approved" ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-0">Info</Badge>
              Displaying transactions approved within the last 14 days
            </div>
            <ApprovalTransactionList
              transactions={tabTransactions}
              onApprove={onApprove}
              onReject={onReject}
              onFlag={onFlag}
              onRequestChanges={onRequestChanges}
            />
          </div>
        ) : (
          <ApprovalTransactionList
            transactions={tabTransactions}
            onApprove={onApprove}
            onReject={onReject}
            onFlag={onFlag}
            onRequestChanges={onRequestChanges}
          />
        )}
      </TabsContent>
    ))}
  </Tabs>
);

export default ApprovalInboxTabs;
