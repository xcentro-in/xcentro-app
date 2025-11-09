
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApprovalStatus } from "@/types/approval";

interface ApprovalInboxTabsProps {
  activeTab: ApprovalStatus;
  onTabChange: (tab: ApprovalStatus) => void;
  tabs: Array<{
    value: string;
    label: string;
    count: number;
  }>;
}

const ApprovalInboxTabs = ({ activeTab, onTabChange, tabs }: ApprovalInboxTabsProps) => (
  <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as ApprovalStatus)}>
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
