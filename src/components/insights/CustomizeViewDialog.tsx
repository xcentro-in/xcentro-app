
import React from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ViewOptions {
  showSpendingTrend: boolean;
  showCategoryBreakdown: boolean;
  showTaxCompliance: boolean;
  showCashFlowForecast: boolean;
  showCreditCardInsights: boolean;
  timePeriod: string;
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
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Customize View</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Chart Display Options</h4>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <Checkbox 
                checked={viewOptions.showSpendingTrend} 
                onCheckedChange={(checked) => 
                  setViewOptions({...viewOptions, showSpendingTrend: !!checked})
                }
                className="rounded text-primary" 
              />
              <span>Show Spending Trend</span>
            </label>
            <label className="flex items-center gap-2">
              <Checkbox 
                checked={viewOptions.showCategoryBreakdown} 
                onCheckedChange={(checked) => 
                  setViewOptions({...viewOptions, showCategoryBreakdown: !!checked})
                }
                className="rounded text-primary" 
              />
              <span>Show Category Breakdown</span>
            </label>
            <label className="flex items-center gap-2">
              <Checkbox 
                checked={viewOptions.showTaxCompliance} 
                onCheckedChange={(checked) => 
                  setViewOptions({...viewOptions, showTaxCompliance: !!checked})
                }
                className="rounded text-primary" 
              />
              <span>Show Tax Compliance</span>
            </label>
            <label className="flex items-center gap-2">
              <Checkbox 
                checked={viewOptions.showCashFlowForecast} 
                onCheckedChange={(checked) => 
                  setViewOptions({...viewOptions, showCashFlowForecast: !!checked})
                }
                className="rounded text-primary" 
              />
              <span>Show Cash Flow Forecast</span>
            </label>
            <label className="flex items-center gap-2">
              <Checkbox 
                checked={viewOptions.showCreditCardInsights} 
                onCheckedChange={(checked) => 
                  setViewOptions({...viewOptions, showCreditCardInsights: !!checked})
                }
                className="rounded text-primary" 
              />
              <span>Show Credit Card Insights</span>
            </label>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Time Period</h4>
          <Select 
            value={viewOptions.timePeriod} 
            onValueChange={(value) => 
              setViewOptions({...viewOptions, timePeriod: value})
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="pt-4 flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Apply Changes</Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default CustomizeViewDialog;
