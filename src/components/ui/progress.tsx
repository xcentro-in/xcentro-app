
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps extends
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorClassName?: string;
  showMilestones?: boolean;
  milestones?: string[];
  currentStep?: number;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, indicatorClassName, showMilestones, milestones = [], currentStep = 1, ...props }, ref) => (
  <div className="space-y-2">
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/10",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 bg-primary transition-all",
          indicatorClassName
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
      
      {showMilestones && milestones.length > 0 && (
        <div className="absolute inset-0 flex w-full justify-between px-[3px]">
          {milestones.map((_, index) => {
            const isCompleted = index + 1 <= currentStep;
            return (
              <div 
                key={index}
                className={cn(
                  "h-full w-1 rounded-full",
                  index === 0 ? "hidden" : "",
                  index === milestones.length - 1 ? "hidden" : "",
                  isCompleted ? "bg-primary-foreground" : "bg-primary/30"
                )}
              />
            );
          })}
        </div>
      )}
    </ProgressPrimitive.Root>
    
    {showMilestones && milestones.length > 0 && (
      <div className="flex w-full justify-between">
        {milestones.map((milestone, index) => {
          const isActive = index + 1 === currentStep;
          const isCompleted = index + 1 < currentStep;
          return (
            <div 
              key={index}
              className="flex flex-col items-center"
              style={{ width: `${100 / milestones.length}%` }}
            >
              <div 
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                  isActive ? "bg-primary text-primary-foreground" : 
                  isCompleted ? "bg-primary/80 text-primary-foreground" : "bg-muted text-muted-foreground"
                )}
              >
                {index + 1}
              </div>
              <span 
                className={cn(
                  "mt-1 text-xs",
                  isActive ? "font-medium text-foreground" : 
                  isCompleted ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {milestone}
              </span>
            </div>
          );
        })}
      </div>
    )}
  </div>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
