
import { ReactElement } from "react";

export interface MilestoneCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  pointsNeeded: number;
  currentPoints: number;
  status: 'active' | 'locked' | 'completed';
  category: string;
  estimatedTimeToReach?: string;
  completionDate?: string;
  isCustom?: boolean;
}
