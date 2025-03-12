
import { useState } from "react";
import { toast } from "sonner";
import RewardsHeader from "@/components/rewards/RewardsHeader";
import RewardsSummary from "@/components/rewards/RewardsSummary";
import RedemptionOptions from "@/components/rewards/RedemptionOptions";
import EarningHistory from "@/components/rewards/EarningHistory";
import SpendingRecommendations from "@/components/rewards/SpendingRecommendations";
import RedemptionDialog from "@/components/rewards/dialog/RedemptionDialog";
import { redemptionCategories } from "@/data/redemptionCategories";

const Rewards = () => {
  const [openRedemptionDialog, setOpenRedemptionDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const availablePoints = 24530;
  
  const handleRedeemPoints = (itemId: string, categoryId: string) => {
    const category = redemptionCategories.find(cat => cat.id === categoryId);
    const item = category?.items.find(item => item.id === itemId);
    
    if (item) {
      toast.success(`Redeemed: ${item.title} for ${item.pointsCost} points`);
      setOpenRedemptionDialog(false);
    }
  };

  return (
    <div className="space-y-8">
      <RewardsHeader 
        title="Rewards Dashboard" 
        description="Track and redeem your business rewards" 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RewardsSummary 
          availablePoints={availablePoints}
          onRedeemClick={() => setOpenRedemptionDialog(true)}
        />
        
        <RedemptionOptions 
          onRedeemClick={() => setOpenRedemptionDialog(true)}
          onCategorySelect={setSelectedCategory}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EarningHistory />
        <SpendingRecommendations />
      </div>
      
      <RedemptionDialog 
        open={openRedemptionDialog}
        onOpenChange={setOpenRedemptionDialog}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={redemptionCategories}
        onRedeemItem={handleRedeemPoints}
        availablePoints={availablePoints}
      />
    </div>
  );
};

export default Rewards;
