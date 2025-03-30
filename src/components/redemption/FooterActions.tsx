
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { RedemptionItem } from "@/types/rewards";

interface FooterActionsProps {
  step: number;
  isSubmitting: boolean;
  agreementChecked: boolean;
  pointsToRedeem: number;
  availablePoints: number;
  item: RedemptionItem | null;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const FooterActions: React.FC<FooterActionsProps> = ({
  step,
  isSubmitting,
  agreementChecked,
  pointsToRedeem,
  availablePoints,
  item,
  onPrevious,
  onNext,
  onSubmit,
}) => {
  return (
    <div className="flex justify-between p-6 w-full bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/20 border-t">
      <div className="w-1/3 flex justify-start">
        <Button 
          variant="outline" 
          onClick={onPrevious}
          className="border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
        >
          {step > 1 ? "Previous" : "Cancel"}
        </Button>
      </div>
      
      <div className="w-1/3 flex justify-center items-center">
        {step === 1 && (
          <div className="text-sm text-muted-foreground italic">
            Click on a partner card to continue
          </div>
        )}
      </div>
      
      <div className="w-1/3 flex justify-end">
        {step < 3 ? (
          step > 1 && (
            <Button 
              onClick={onNext}
              disabled={
                (step === 2 && (item && (pointsToRedeem < item.pointsCost || pointsToRedeem > availablePoints)))
              }
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all min-w-[120px]"
            >
              Continue
            </Button>
          )
        ) : (
          <Button 
            onClick={onSubmit}
            disabled={!agreementChecked || isSubmitting || pointsToRedeem > availablePoints}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all min-w-[150px]"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Processing
              </>
            ) : (
              "Convert Points"
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default FooterActions;
