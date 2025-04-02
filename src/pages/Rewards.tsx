
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import RewardsHeader from "@/components/rewards/RewardsHeader";
import RewardsSummary from "@/components/rewards/RewardsSummary";
import MilestoneCards from "@/components/rewards/MilestoneCards";
import EarningHistory from "@/components/rewards/EarningHistory";
import SpendingRecommendations from "@/components/rewards/SpendingRecommendations";
import RedemptionCategoryDialog from "@/components/rewards/dialog/RedemptionCategoryDialog";

const Rewards = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [redeemDialogOpen, setRedeemDialogOpen] = useState<boolean>(false);
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
    } else {
      // Open category selection dialog if no specific category
      setRedeemDialogOpen(true);
    }
  };

  const handleTransferClick = () => {
    toast.info("Points transfer feature will be available soon!");
  };

  const handleViewHistory = () => {
    navigate("/rewards/history");
  };

  return (
    <div className="space-y-8">
      <RewardsHeader 
        title="My Rewards" 
        description="Track & redeem your business rewards" 
      />
      
      {/* Header Stats Bar */}
      <RewardsSummary 
        availablePoints={availablePoints}
        onRedeemClick={() => handleRedeemClick()}
        onTransferClick={handleTransferClick}
      />
      
      {/* Milestone Progress Cards Section */}
      <MilestoneCards />
      
      {/* Earning Tips and Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SpendingRecommendations />
        <EarningHistory onViewHistoryClick={handleViewHistory} />
      </div>

      <RedemptionCategoryDialog
        open={redeemDialogOpen}
        onOpenChange={setRedeemDialogOpen}
      />
    </div>
  );
};

export default Rewards;
