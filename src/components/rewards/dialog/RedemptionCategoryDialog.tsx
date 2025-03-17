
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plane, Hotel, Ticket, Car, Tag, Package, X } from "lucide-react";
import { RedemptionCategory } from "@/types/rewards";
import { redemptionCategories } from "@/data/redemptionCategories";
import { useNavigate } from "react-router-dom";

interface RedemptionCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RedemptionCategoryDialog: React.FC<RedemptionCategoryDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const navigate = useNavigate();

  const handleCategorySelect = (categoryId: string) => {
    navigate(`/rewards/redeem/${categoryId}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Redeem Your Points</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="pt-2">
            Choose a redemption category to begin your premium experience
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-4">
          {redemptionCategories.map(category => (
            <div 
              key={category.id}
              className="group flex flex-col rounded-lg border hover:border-primary/50 bg-white hover:bg-primary/5 transition-all cursor-pointer shadow-sm hover:shadow-md overflow-hidden"
              onClick={() => handleCategorySelect(category.id)}
            >
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-6 flex items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
                  {React.createElement(category.icon, { className: "h-8 w-8 text-primary" })}
                </div>
              </div>
              
              <div className="flex-1 p-4">
                <h3 className="font-medium text-lg mb-1">{category.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{category.description}</p>
                <div className="flex items-center text-xs text-muted-foreground mt-auto">
                  <span>From {category.pointsNeeded.toLocaleString()} points</span>
                  <ChevronRight className="h-3 w-3 ml-1 text-primary" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RedemptionCategoryDialog;
