
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dispatch, SetStateAction } from "react";

interface ApprovalInboxTabsProps {
  activeTab: "pending" | "action_required" | "approved";
  setActiveTab: Dispatch<SetStateAction<"pending" | "action_required" | "approved">>;
  tabs: Array<{
    value: string;
    label: string;
    count: number;
  }>;
}

const ApprovalInboxTabs = ({ activeTab, setActiveTab, tabs }: ApprovalInboxTabsProps) => (
  <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "pending" | "action_required" | "approved")}>
    <TabsList className="w-full sm:w-auto">
      {tabs.map((tab) => (
        <TabsTrigger key={tab.value} value={tab.value}>
          {tab.label} ({tab.count})
        </TabsTrigger>
      ))}
    </TabsList>
  </Tabs>
);

export default ApprovalInboxTabs;
