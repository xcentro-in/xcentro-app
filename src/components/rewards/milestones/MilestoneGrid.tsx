
import React from "react";
import { Award } from "lucide-react";
import MilestoneCard from "./MilestoneCard";
import { MilestoneCardProps } from "@/types/milestone";

interface MilestoneGridProps {
  activeMilestones: MilestoneCardProps[];
  lockedMilestones: MilestoneCardProps[];
  completedMilestones: MilestoneCardProps[];
  activeTab: string;
  onRedeemClick: (categoryId: string) => void;
}

const MilestoneGrid: React.FC<MilestoneGridProps> = ({
  activeMilestones,
  lockedMilestones,
  completedMilestones,
  activeTab,
  onRedeemClick
}) => {
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-gray-100 p-3 rounded-full mb-4">
        <Award className="h-8 w-8 text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold mb-1">No milestones found</h3>
      <p className="text-muted-foreground mb-4">
        No {activeTab} milestones to display at the moment
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Active milestones section */}
      {activeTab !== "completed" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeMilestones.map(milestone => (
            <MilestoneCard 
              key={milestone.id}
              milestone={milestone} 
              onRedeemClick={onRedeemClick} 
            />
          ))}
        </div>
      )}
      
      {/* Locked milestones section - only show on active tab */}
      {activeTab === "active" && lockedMilestones.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">Locked Milestones</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedMilestones.map(milestone => (
              <MilestoneCard 
                key={milestone.id}
                milestone={milestone} 
                onRedeemClick={onRedeemClick} 
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed milestones - only show on completed tab */}
      {activeTab === "completed" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {completedMilestones.map(milestone => (
            <MilestoneCard 
              key={milestone.id}
              milestone={milestone} 
              onRedeemClick={onRedeemClick} 
            />
          ))}
        </div>
      )}
      
      {/* Empty state for active and completed tabs */}
      {((activeTab === "active" && activeMilestones.length === 0) || 
        (activeTab === "completed" && completedMilestones.length === 0)) && renderEmptyState()}
    </div>
  );
};

export default MilestoneGrid;
