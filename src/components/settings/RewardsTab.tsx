
import React, { useState } from "react";
import RewardPreferences from "@/components/settings/RewardPreferences";
import { LoyaltyPartner } from "@/types/rewards";
import { toast } from "sonner";

const RewardsTab = () => {
  const [loyaltyPartners, setLoyaltyPartners] = useState<LoyaltyPartner[]>([
    {
      id: "emirates",
      name: "Emirates Skywards",
      type: "airline",
      conversionRatio: 0.5,
      category: "flights",
      membershipDetails: {
        membershipNumber: "EK123456789",
        registeredName: "John Doe",
        email: "john@example.com"
      }
    }
  ]);
  
  const handleSavePartner = (partner: LoyaltyPartner) => {
    const existingIndex = loyaltyPartners.findIndex(p => p.id === partner.id);
    
    if (existingIndex >= 0) {
      const updatedPartners = [...loyaltyPartners];
      updatedPartners[existingIndex] = partner;
      setLoyaltyPartners(updatedPartners);
    } else {
      setLoyaltyPartners([...loyaltyPartners, partner]);
    }
  };
  
  const handleDeletePartner = (partnerId: string) => {
    setLoyaltyPartners(loyaltyPartners.filter(p => p.id !== partnerId));
  };

  return (
    <RewardPreferences 
      savedPartners={loyaltyPartners}
      onSavePartner={handleSavePartner}
      onDeletePartner={handleDeletePartner}
    />
  );
};

export default RewardsTab;
