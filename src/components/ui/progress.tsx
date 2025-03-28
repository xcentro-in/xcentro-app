
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { Check } from "lucide-react"

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
  <div className="space-y-6">
    <div className="relative">
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative h-1 w-full overflow-hidden bg-primary/10",
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
      </ProgressPrimitive.Root>
      
      {showMilestones && milestones.length > 0 && (
        <div className="absolute inset-0 flex justify-between w-full">
          {milestones.map((_, index) => {
            const stepNumber = index + 1;
            return (
              <div 
                key={index}
                className={cn(
                  "absolute top-1/2 -translate-y-1/2",
                  index === 0 ? "left-0" : 
                  index === milestones.length - 1 ? "right-0" : 
                  `left-[${(index / (milestones.length - 1)) * 100}%]`
                )}
                style={{ 
                  left: index === 0 ? "0%" : 
                        index === milestones.length - 1 ? "auto" : 
                        `${(index / (milestones.length - 1)) * 100}%`,
                  right: index === milestones.length - 1 ? "0%" : "auto"
                }}
              />
            );
          })}
        </div>
      )}
    </div>
    
    {showMilestones && milestones.length > 0 && (
      <div className="flex justify-between w-full">
        {milestones.map((milestone, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <div 
              key={index}
              className="flex flex-col items-center"
            >
              <div 
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm border",
                  isCompleted ? "bg-primary border-primary text-primary-foreground" : 
                  isActive ? "bg-primary border-primary text-primary-foreground" : 
                  "bg-background border-muted-foreground/30 text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  stepNumber
                )}
              </div>
              <span 
                className={cn(
                  "mt-2 text-sm",
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
