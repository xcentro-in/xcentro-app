
import React from "react";
import { Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProgressStepsProps {
  step: number;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ step }) => {
  const steps = ["Select Partner", "Redeem Points", "Confirm Redemption"];
  
  return (
    <div className="w-full mb-8">
      <Progress 
        showMilestones={true}
        milestones={steps}
        currentStep={step}
        className="h-2"
      />
    </div>
  );
};

export default ProgressSteps;
