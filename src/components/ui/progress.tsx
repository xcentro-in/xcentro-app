
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
  <div className="w-full">
    {showMilestones && milestones.length > 0 ? (
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200" />
        
        {/* Completed Progress */}
        <div 
          className="absolute top-4 left-0 h-0.5 bg-primary transition-all duration-300" 
          style={{ 
            width: `${((currentStep - 1) / (milestones.length - 1)) * 100}%`,
            maxWidth: currentStep > 1 ? '100%' : '0%'
          }} 
        />
        
        {/* Milestones */}
        <div className="flex justify-between">
          {milestones.map((milestone, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;
            
            return (
              <div key={index} className="flex flex-col items-center relative">
                <div 
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm border z-10",
                    isCompleted ? "bg-primary border-primary text-primary-foreground" : 
                    isActive ? "border-primary text-primary bg-white" : 
                    "bg-white border-gray-300 text-gray-500"
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
                    "mt-2 text-sm whitespace-nowrap",
                    isActive ? "font-medium text-primary" : 
                    isCompleted ? "text-primary" : "text-gray-500"
                  )}
                >
                  {milestone}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    ) : (
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
    )}
  </div>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
