
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CategorySelector from "./CategorySelector";
import CategoryItems from "./CategoryItems";
import { RedemptionCategory } from "@/types/rewards";

interface RedemptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  categories: RedemptionCategory[];
  onRedeemItem: (itemId: string, categoryId: string) => void;
  availablePoints: number;
}

const RedemptionDialog: React.FC<RedemptionDialogProps> = ({
  open,
  onOpenChange,
  selectedCategory,
  setSelectedCategory,
  categories,
  onRedeemItem,
  availablePoints
}) => {
  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Redeem Your Reward Points</DialogTitle>
          <DialogDescription>
            Choose from premium redemption options below
          </DialogDescription>
        </DialogHeader>
        
        {selectedCategory ? (
          <CategoryItems 
            category={selectedCategoryData!}
            onBackClick={() => setSelectedCategory(null)}
            onRedeemItem={onRedeemItem}
            availablePoints={availablePoints}
          />
        ) : (
          <CategorySelector 
            categories={categories}
            onCategorySelect={(categoryId) => setSelectedCategory(categoryId)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RedemptionDialog;
