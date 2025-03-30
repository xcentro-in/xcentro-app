
import React from "react";
import { Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProgressStepsProps {
  step: number;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ step }) => {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between mb-2">
        {["Select Partner", "Redeem Points", "Confirm Redemption"].map((stepName, idx) => (
          <div 
            key={stepName} 
            className={`flex items-center ${idx + 1 === step ? "text-primary font-medium" : "text-muted-foreground"}`}
          >
            <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-2 
              ${idx + 1 === step ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white" : 
                idx + 1 < step ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
              {idx + 1 < step ? <Check className="h-4 w-4" /> : idx + 1}
            </div>
            <span className="hidden sm:inline">{stepName}</span>
          </div>
        ))}
      </div>
      <Progress value={(step / 3) * 100} className="h-2" />
    </div>
  );
};

export default ProgressSteps;
