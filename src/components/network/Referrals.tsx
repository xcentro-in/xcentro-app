
import { useState } from "react";
import ReferralInsights from "./referrals/ReferralInsights";
import ReferralInviteForm from "./referrals/ReferralInviteForm";
import ReferralLimitCard from "./referrals/ReferralLimitCard";
import ReferralHistoryTable from "./referrals/ReferralHistoryTable";
import { referralHistory } from "./referrals/data";

const Referrals = () => {
  // Summary stats
  const totalReferrals = referralHistory.length;
  const totalJoined = referralHistory.filter(r => r.status === "joined").length;
  const totalPoints = referralHistory.reduce((sum, item) => sum + item.points, 0);
  const monthlyLimit = 10;
  const remainingReferrals = monthlyLimit - totalReferrals;
  
  return (
    <div className="space-y-6">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold mb-2">Referrals</h2>
        <p className="text-muted-foreground">
          Invite other businesses to join PaySphere and earn reward points.
        </p>
      </div>
      
      {/* Insights Card */}
      <ReferralInsights 
        totalJoined={totalJoined} 
        totalReferrals={totalReferrals}
        totalPoints={totalPoints}
      />
      
      {/* Invite Form and Monthly Limit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Invite Form */}
        <ReferralInviteForm />
        
        {/* Monthly Referral Limit Card */}
        <ReferralLimitCard 
          totalReferrals={totalReferrals}
          monthlyLimit={monthlyLimit}
          remainingReferrals={remainingReferrals}
        />
      </div>
      
      {/* Referral History */}
      <ReferralHistoryTable referralHistory={referralHistory} />
    </div>
  );
};

export default Referrals;
