
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dispatch, SetStateAction } from "react";

interface ApprovalInboxTabsProps {
  activeTab: "pending" | "action_required" | "approved";
  setActiveTab: Dispatch<SetStateAction<"pending" | "action_required" | "approved">>;
}

const ApprovalInboxTabs = ({ activeTab, setActiveTab }: ApprovalInboxTabsProps) => (
  <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "pending" | "action_required" | "approved")}>
    <TabsList className="w-full sm:w-auto">
      <TabsTrigger value="pending">Pending</TabsTrigger>
      <TabsTrigger value="action_required">Action Required</TabsTrigger>
      <TabsTrigger value="approved">Approved</TabsTrigger>
    </TabsList>
  </Tabs>
);

export default ApprovalInboxTabs;
