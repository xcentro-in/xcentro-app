
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MilestoneGrid from "./MilestoneGrid";
import { MilestoneCardProps } from "@/types/milestone";

interface MilestoneTabsProps {
  milestones: MilestoneCardProps[];
  activeTab: string;
  setActiveTab: (value: string) => void;
  onRedeemClick: (categoryId: string) => void;
}

const MilestoneTabs: React.FC<MilestoneTabsProps> = ({ 
  milestones, 
  activeTab, 
  setActiveTab,
  onRedeemClick 
}) => {
  // Filter milestones based on active tab
  const filteredMilestones = milestones.filter(milestone => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return milestone.status === "active";
    if (activeTab === "completed") return milestone.status === "completed";
    return true;
  });

  // Separate active and locked milestones to display locked ones after active ones
  const activeMilestones = milestones.filter(m => 
    (activeTab === "active" || activeTab === "all") && m.status === "active");
  
  const lockedMilestones = milestones.filter(m => m.status === "locked");
  
  return (
    <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>
      
      <TabsContent value={activeTab} className="mt-0">
        <MilestoneGrid 
          activeMilestones={activeMilestones}
          lockedMilestones={lockedMilestones}
          completedMilestones={filteredMilestones.filter(m => m.status === "completed")}
          activeTab={activeTab}
          onRedeemClick={onRedeemClick}
        />
      </TabsContent>
    </Tabs>
  );
};

export default MilestoneTabs;
