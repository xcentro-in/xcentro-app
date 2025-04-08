
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CustomMilestoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateMilestone?: () => void;
}

const CustomMilestoneDialog: React.FC<CustomMilestoneDialogProps> = ({ 
  open, 
  onOpenChange,
  onCreateMilestone
}) => {
  const [customTitle, setCustomTitle] = useState("");
  const [customPoints, setCustomPoints] = useState<number>(10000);
  const [customReward, setCustomReward] = useState("");
  
  const handleCreateCustomMilestone = () => {
    if (!customTitle || !customReward || customPoints <= 0) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // In a real app, we would save this to the backend
    toast.success("Custom milestone created successfully!");
    onOpenChange(false);
    
    // Reset form fields
    setCustomTitle("");
    setCustomPoints(10000);
    setCustomReward("");
    
    // Notify parent component
    if (onCreateMilestone) {
      onCreateMilestone();
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Custom Goal</DialogTitle>
          <DialogDescription>
            Set your own milestone goals to track your progress.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title</Label>
            <Input
              id="title"
              placeholder="e.g., Business Conference Trip"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="points">
              Points Target: {customPoints.toLocaleString()}
            </Label>
            <Slider
              id="points"
              min={5000}
              max={100000}
              step={1000}
              value={[customPoints]}
              onValueChange={([value]) => setCustomPoints(value)}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5,000</span>
              <span>100,000</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reward">Desired Reward</Label>
            <Input
              id="reward"
              placeholder="e.g., Flight tickets to conference"
              value={customReward}
              onChange={(e) => setCustomReward(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateCustomMilestone}>
            Create Goal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomMilestoneDialog;
