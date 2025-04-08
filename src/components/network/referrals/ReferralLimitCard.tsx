
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ReferralLimitCardProps {
  totalReferrals: number;
  monthlyLimit: number;
  remainingReferrals: number;
}

const ReferralLimitCard = ({ 
  totalReferrals, 
  monthlyLimit, 
  remainingReferrals 
}: ReferralLimitCardProps) => {
  return (
    <Card className="bg-slate-50 border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Monthly Referral Limit</CardTitle>
        <CardDescription>
          Track your monthly referral allocation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="flex items-baseline justify-center">
              <span className="text-4xl font-bold text-primary">{totalReferrals}</span>
              <span className="text-xl text-muted-foreground mx-2">/</span>
              <span className="text-2xl font-medium">{monthlyLimit}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              You can refer <span className="font-medium">{remainingReferrals}</span> more businesses this month
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralLimitCard;
