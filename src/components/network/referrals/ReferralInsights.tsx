
import { Users, Award, BadgeCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ReferralInsights = ({ 
  totalJoined, 
  totalReferrals, 
  totalPoints 
}: { 
  totalJoined: number;
  totalReferrals: number;
  totalPoints: number;
}) => {
  return (
    <Card className="bg-gradient-to-br from-slate-50 to-blue-50/50 border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="h-5 w-5 text-amber-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </span>
          Referral Insights
        </CardTitle>
        <CardDescription>
          Share the power of rewards across your ecosystem
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col bg-white p-4 rounded-lg border border-slate-200">
            <div className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-blue-500" />
              This Month's Referral Score
            </div>
            <div className="text-2xl font-bold">
              {totalJoined} <span className="text-lg font-normal text-muted-foreground">/ {totalReferrals} invited</span>
            </div>
          </div>
          
          <div className="flex flex-col bg-white p-4 rounded-lg border border-slate-200">
            <div className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
              <Award className="h-4 w-4 text-amber-500" />
              Points Earned via Referral
            </div>
            <div className="text-2xl font-bold">{totalPoints.toLocaleString()} pts</div>
          </div>
          
          <div className="flex flex-col bg-white p-4 rounded-lg border border-slate-200">
            <div className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
              <BadgeCheck className="h-4 w-4 text-green-500" />
              Top Reward
            </div>
            <div className="text-xl font-medium text-green-600">
              Refer 5 more and get a bonus 1,000 pts
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralInsights;
