import { cn } from "@/lib/utils";

type Priority = "high" | "medium" | "low";

interface PriorityIndicatorProps {
  priority: Priority;
}

const priorityColors = {
  high: "bg-destructive",
  medium: "bg-amber-500",
  low: "bg-green-500"
} as const;

export const PriorityIndicator = ({ priority }: PriorityIndicatorProps) => (
  <div 
    className={cn(
      "w-2 h-2 rounded-full mt-2",
      priorityColors[priority]
    )}
  />
);