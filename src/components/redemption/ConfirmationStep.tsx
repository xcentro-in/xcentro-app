
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { LoyaltyPartner } from "@/types/rewards";

interface ConfirmationStepProps {
  selectedPartner: LoyaltyPartner | null;
  pointsToRedeem: number;
  availablePoints: number;
  agreementChecked: boolean;
  onAgreementChange: (checked: boolean) => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  selectedPartner,
  pointsToRedeem,
  availablePoints,
  agreementChecked,
  onAgreementChange,
}) => {
  const getConvertedPoints = () => {
    if (selectedPartner) {
      return Math.floor(pointsToRedeem * selectedPartner.conversionRatio);
    }
    return 0;
  };

  return (
    <div className="space-y-5">
      <h3 className="font-medium text-lg mb-4">Confirm Your Redemption</h3>
      
      <div className="rounded-lg border overflow-hidden bg-white dark:bg-slate-800">
        <div className="p-4 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/20 border-b">
          <h4 className="font-medium">Redemption Summary</h4>
        </div>
        
        <div className="p-5 space-y-4">
          <div className="flex justify-between pb-3 border-b">
            <span className="text-muted-foreground">Selected Partner</span>
            <span className="font-medium">{selectedPartner?.name}</span>
          </div>
          <div className="flex justify-between pb-3 border-b">
            <span className="text-muted-foreground">Membership Number</span>
            <span className="font-medium">{selectedPartner?.membershipDetails?.membershipNumber}</span>
          </div>
          <div className="flex justify-between pb-3 border-b">
            <span className="text-muted-foreground">Points to Redeem</span>
            <span className="font-medium">{pointsToRedeem.toLocaleString()} PaySphere Points</span>
          </div>
          <div className="flex justify-between pb-3 border-b">
            <span className="text-muted-foreground">You'll Receive</span>
            <span className="font-medium">{getConvertedPoints().toLocaleString()} {selectedPartner?.name} Points</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Remaining Balance</span>
            <span className="font-medium">{(availablePoints - pointsToRedeem).toLocaleString()} PaySphere Points</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-5 border rounded-lg bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/20">
        <div className="flex items-start space-x-3 mb-1">
          <Checkbox 
            id="terms" 
            checked={agreementChecked}
            onCheckedChange={(checked) => onAgreementChange(checked as boolean)}
            className="mt-1"
          />
          <Label 
            htmlFor="terms" 
            className="text-base leading-relaxed cursor-pointer"
          >
            I understand that this conversion is final and cannot be reversed. Points will be 
            transferred to my loyalty account within 3-5 business days.
          </Label>
        </div>
        <div className={`ml-7 text-sm ${agreementChecked ? 'text-muted-foreground' : 'text-amber-600'}`}>
          Please check this box to proceed with your redemption
        </div>
      </div>
    </div>
  );
};

export default ConfirmationStep;
