
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Award, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import RewardsHeader from "@/components/rewards/RewardsHeader";
import MilestoneTabs from "@/components/rewards/milestones/MilestoneTabs";
import MilestoneSidebar from "@/components/rewards/milestones/MilestoneSidebar";
import CustomMilestoneDialog from "@/components/rewards/milestones/CustomMilestoneDialog";
import { MilestoneCardProps } from "@/types/milestone";

const MilestoneRewards = () => {
  const navigate = useNavigate();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  
  // Sample milestone data
  const milestones: MilestoneCardProps[] = [
    {
      id: "flight-mumbai",
      title: "Free Flight to Mumbai",
      description: "Convert your points to airline miles for a premium flight",
      icon: Award,
      pointsNeeded: 50000,
      currentPoints: 36000,
      status: 'active',
      category: 'travel',
      estimatedTimeToReach: "4 more transactions"
    },
    {
      id: "hotel-stay",
      title: "5-Star Hotel Night",
      description: "Enjoy a luxury stay at top hotel chains worldwide",
      icon: Award,
      pointsNeeded: 35000,
      currentPoints: 24530,
      status: 'active',
      category: 'travel',
      estimatedTimeToReach: "3 more transactions"
    },
    {
      id: "vip-event",
      title: "VIP Event Ticket",
      description: "Access to exclusive professional networking events",
      icon: Award,
      pointsNeeded: 20000,
      currentPoints: 24530,
      status: 'completed',
      category: 'vip',
      completionDate: "March 15, 2025"
    },
    {
      id: "business-class",
      title: "Business Class Upgrade",
      description: "Upgrade any economy ticket to business class",
      icon: Award,
      pointsNeeded: 65000,
      currentPoints: 24530,
      status: 'locked',
      category: 'travel',
      estimatedTimeToReach: "8 more transactions"
    },
    {
      id: "software-discount",
      title: "Premium Software Package",
      description: "50% discount on leading business software",
      icon: Award,
      pointsNeeded: 30000,
      currentPoints: 24530,
      status: 'active',
      category: 'business',
      estimatedTimeToReach: "2 more transactions"
    },
    {
      id: "fine-dining",
      title: "Fine Dining Experience",
      description: "Dinner for two at an exclusive restaurant",
      icon: Award,
      pointsNeeded: 40000,
      currentPoints: 24530,
      status: 'locked',
      category: 'personal',
      estimatedTimeToReach: "5 more transactions"
    },
    {
      id: "trade-show",
      title: "Industry Trade Show VIP",
      description: "VIP access to top industry conferences",
      icon: Award,
      pointsNeeded: 45000,
      currentPoints: 24530,
      status: 'locked',
      category: 'vip',
      estimatedTimeToReach: "7 more transactions"
    }
  ];

  const handleBack = () => {
    navigate('/rewards');
  };

  const handleRedeemClick = (categoryId: string) => {
    navigate(`/rewards/redeem/${categoryId}`);
  };

  const totalPoints = 24530;
  const nextMilestone = milestones.filter(m => m.status === 'active')
    .sort((a, b) => (a.pointsNeeded - a.currentPoints) - (b.pointsNeeded - b.currentPoints))[0];
  const pointsToNextMilestone = nextMilestone ? nextMilestone.pointsNeeded - nextMilestone.currentPoints : 0;
  const completedMilestones = milestones.filter(m => m.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <RewardsHeader 
          title="Milestone Rewards" 
          description="Track your progress and unlock exciting rewards"
        />
      </div>
      
      {/* Main content with tabs and sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 space-y-6">
          <MilestoneTabs 
            milestones={milestones} 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onRedeemClick={handleRedeemClick}
          />
        </div>
        
        {/* Side panel with quick stats */}
        <div className="space-y-4">
          <MilestoneSidebar 
            totalPoints={totalPoints}
            completedMilestones={completedMilestones}
            nextMilestone={nextMilestone}
            pointsToNextMilestone={pointsToNextMilestone}
            onCreateCustomClick={() => setCreateDialogOpen(true)}
          />
        </div>
      </div>
      
      {/* Custom milestone creation dialog */}
      <CustomMilestoneDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
      />
    </div>
  );
};

export default MilestoneRewards;
