
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import RewardsHeader from "@/components/rewards/RewardsHeader";
import RewardsSummary from "@/components/rewards/RewardsSummary";
import RedemptionOptions from "@/components/rewards/RedemptionOptions";
import EarningHistory from "@/components/rewards/EarningHistory";
import SpendingRecommendations from "@/components/rewards/SpendingRecommendations";
import { redemptionCategories } from "@/data/redemptionCategories";

const Rewards = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const availablePoints = 24530;
  
  useEffect(() => {
    // Check if redirected after redemption
    if (location.state?.redemptionCompleted) {
      toast.success("Points redemption completed successfully!");
    }
  }, [location]);
  
  const handleRedeemClick = (categoryId?: string | null) => {
    // If a specific category is selected, navigate to it
    if (categoryId) {
      navigate(`/rewards/redeem/${categoryId}`);
    } else if (selectedCategory) {
      navigate(`/rewards/redeem/${selectedCategory}`);
    } else {
      // Default to first category if none selected
      navigate(`/rewards/redeem/${redemptionCategories[0].id}`);
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
          onRedeemClick={() => handleRedeemClick()}
        />
        
        <RedemptionOptions 
          onRedeemClick={handleRedeemClick}
          onCategorySelect={setSelectedCategory}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EarningHistory />
        <SpendingRecommendations />
      </div>
    </div>
  );
};

export default Rewards;
