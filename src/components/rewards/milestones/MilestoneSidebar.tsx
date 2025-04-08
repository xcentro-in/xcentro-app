
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Plus } from "lucide-react";
import { MilestoneCardProps } from "@/types/milestone";

interface MilestoneSidebarProps {
  totalPoints: number;
  completedMilestones: MilestoneCardProps[];
  nextMilestone?: MilestoneCardProps;
  pointsToNextMilestone: number;
  onCreateCustomClick: () => void;
}

const MilestoneSidebar: React.FC<MilestoneSidebarProps> = ({
  totalPoints,
  completedMilestones,
  nextMilestone,
  pointsToNextMilestone,
  onCreateCustomClick
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Your Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-muted-foreground">Total Points</span>
              <span className="font-semibold">{totalPoints.toLocaleString()}</span>
            </div>
            
            {nextMilestone && (
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">Next Milestone:</span>
                </div>
                <div className="bg-amber-50 rounded-md p-2.5 border border-amber-100 dark:bg-amber-950/10 dark:border-amber-900/20">
                  <div className="font-medium text-sm">{nextMilestone.title}</div>
                  <div className="text-xs text-amber-600">
                    {pointsToNextMilestone.toLocaleString()} points needed
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="pt-2">
            <Button variant="outline" className="w-full justify-start gap-2" onClick={onCreateCustomClick}>
              <Plus className="h-4 w-4" />
              Create Custom Goal
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Completed milestones summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Completed Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          {completedMilestones.length > 0 ? (
            <div className="space-y-3">
              {completedMilestones
                .slice(0, 3)
                .map(milestone => (
                  <div key={milestone.id} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="truncate">{milestone.title}</span>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              No completed milestones yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MilestoneSidebar;
