
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface ViewOptions {
  showSpendingChart: boolean;
  showHiddenChargesChart: boolean;
  showUtilizationChart: boolean;
  showLatePaymentChart: boolean;
  showRewardsChart: boolean;
  showRecommendations: boolean;
  compactView: boolean;
}

interface CustomizeViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  viewOptions: ViewOptions;
  setViewOptions: React.Dispatch<React.SetStateAction<ViewOptions>>;
}

const CustomizeViewDialog: React.FC<CustomizeViewDialogProps> = ({
  open,
  onOpenChange,
  viewOptions,
  setViewOptions,
}) => {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Customize Analytics View</DialogTitle>
        <DialogDescription>
          Select which charts and information you want to see in your dashboard.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="spending" 
              checked={viewOptions.showSpendingChart} 
              onCheckedChange={(checked) => setViewOptions({...viewOptions, showSpendingChart: !!checked})} 
            />
            <Label htmlFor="spending">Total Spend Per Card</Label>
          </div>
          <div className="text-xs text-muted-foreground">Spending comparison across cards</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="hidden-charges" 
              checked={viewOptions.showHiddenChargesChart} 
              onCheckedChange={(checked) => setViewOptions({...viewOptions, showHiddenChargesChart: !!checked})} 
            />
            <Label htmlFor="hidden-charges">Hidden Charges Breakdown</Label>
          </div>
          <div className="text-xs text-muted-foreground">All fees and penalties</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="utilization" 
              checked={viewOptions.showUtilizationChart} 
              onCheckedChange={(checked) => setViewOptions({...viewOptions, showUtilizationChart: !!checked})} 
            />
            <Label htmlFor="utilization">Credit Utilization</Label>
          </div>
          <div className="text-xs text-muted-foreground">Percentage of credit limit used</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="late-payment" 
              checked={viewOptions.showLatePaymentChart} 
              onCheckedChange={(checked) => setViewOptions({...viewOptions, showLatePaymentChart: !!checked})} 
            />
            <Label htmlFor="late-payment">Late Fee Trends</Label>
          </div>
          <div className="text-xs text-muted-foreground">Historical late payment patterns</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="rewards" 
              checked={viewOptions.showRewardsChart} 
              onCheckedChange={(checked) => setViewOptions({...viewOptions, showRewardsChart: !!checked})} 
            />
            <Label htmlFor="rewards">Rewards Leaderboard</Label>
          </div>
          <div className="text-xs text-muted-foreground">Cards ranked by rewards earned</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="recommendations" 
              checked={viewOptions.showRecommendations} 
              onCheckedChange={(checked) => setViewOptions({...viewOptions, showRecommendations: !!checked})} 
            />
            <Label htmlFor="recommendations">Smart Recommendations</Label>
          </div>
          <div className="text-xs text-muted-foreground">AI-powered insights and tips</div>
        </div>

        <div className="flex items-center justify-between border-t pt-4 mt-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="compact-view">Compact View</Label>
          </div>
          <Switch 
            id="compact-view" 
            checked={viewOptions.compactView} 
            onCheckedChange={(checked) => setViewOptions({...viewOptions, compactView: checked})} 
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          <Check className="mr-2 h-4 w-4" /> Done
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default CustomizeViewDialog;
