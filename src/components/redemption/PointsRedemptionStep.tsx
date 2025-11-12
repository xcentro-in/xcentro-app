
import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { LoyaltyPartner, RedemptionItem } from "@/types/rewards";

interface PointsRedemptionStepProps {
  selectedPartner: LoyaltyPartner | null;
  item: RedemptionItem | null;
  availablePoints: number;
  pointsToRedeem: number;
  onPointsChange: (value: number) => void;
}

const PointsRedemptionStep: React.FC<PointsRedemptionStepProps> = ({
  selectedPartner,
  item,
  availablePoints,
  pointsToRedeem,
  onPointsChange,
}) => {
  const [pointsError, setPointsError] = useState<string | null>(null);

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      onPointsChange(value);
      
      if (item && value < item.pointsCost) {
        setPointsError(`Minimum should be ${item.pointsCost.toLocaleString()} points`);
      } else {
        setPointsError(null);
      }
    }
  };

  const getConvertedPoints = () => {
    if (selectedPartner) {
      return Math.floor(pointsToRedeem * selectedPartner.conversionRatio);
    }
    return 0;
  };

  return (
    <div className="space-y-6">
      <h3 className="font-medium text-lg mb-4">Redeem Points</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {selectedPartner && (
          <div className="p-5 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/20 rounded-lg border">
            <h4 className="font-medium mb-3">Your {selectedPartner.name} Details</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Registered Name</Label>
                <p className="font-medium">{selectedPartner.membershipDetails?.registeredName || "Not provided"}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Registered Email</Label>
                <p className="font-medium truncate">{selectedPartner.membershipDetails?.email || "Not provided"}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Membership Number</Label>
                <p className="font-medium">{selectedPartner.membershipDetails?.membershipNumber || "Not provided"}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Conversion Rate</Label>
                <p className="font-medium">1:{selectedPartner.conversionRatio}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/20 p-5 rounded-lg border">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-sm text-muted-foreground">Your Available Points</div>
              <div className="text-2xl font-bold">{availablePoints.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Minimum Required</div>
              <div className="text-xl font-medium">{item?.pointsCost.toLocaleString()}</div>
            </div>
          </div>
          
          <Progress value={(availablePoints / 30000) * 100} className="h-2 mb-2" />
        </div>
      </div>
        
      <div className="space-y-4">
        <div>
          <Label htmlFor="pointsToRedeem" className="text-base font-medium block">
            Points to Redeem
          </Label>
          <div className="flex items-center mt-2 space-x-3">
            <div className="relative w-64">
              <Input 
                id="pointsToRedeem" 
                type="number" 
                value={pointsToRedeem}
                onChange={handlePointsChange}
                min={item?.pointsCost}
                max={availablePoints}
                className="text-left pr-12 h-10"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                pts
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                onPointsChange(availablePoints);
                setPointsError(null);
              }}
              className="h-10"
            >
              Max
            </Button>
          </div>
          {pointsError && (
            <p className="text-destructive text-sm mt-2">
              {pointsError}
            </p>
          )}
          {pointsToRedeem > availablePoints && (
            <p className="text-destructive text-sm mt-2">
              You don't have enough points
            </p>
          )}
        </div>
        
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/20 rounded-lg border overflow-hidden mt-6">
          <div className="p-4 border-b bg-white/50 dark:bg-black/10">
            <h4 className="font-medium">Conversion Preview</h4>
          </div>
          
          <div className="flex items-center justify-center gap-10 p-6">
            <div className="text-center">
              <div className="text-4xl font-bold">{pointsToRedeem.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground mt-1">Xcentro Points</div>
            </div>
            <div className="text-primary">
              <ArrowRight className="h-8 w-8" />
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {getConvertedPoints().toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{selectedPartner?.name} Points</div>
            </div>
          </div>
          
          <div className="bg-white/80 dark:bg-black/20 p-3 text-center text-sm text-muted-foreground">
            Conversion Rate: 1 Xcentro Point = {selectedPartner?.conversionRatio} {selectedPartner?.name} Points
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsRedemptionStep;
