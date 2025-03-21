import { DollarSign, Gift, TrendingUp, Star, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
const RewardStatus = () => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => setProgress(78), 500);
    return () => clearTimeout(timer);
  }, []);
  const handleRedeemClick = () => {
    navigate('/rewards');
  };
  return <Card className="animate-fade-in overflow-hidden border-0 shadow-md bg-gradient-to-br from-[#1A1F2C] to-[#221F26] text-white" style={{
    animationDelay: "200ms"
  }}>
      <CardHeader className="border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-white">My Rewards</CardTitle>
            <CardDescription className="text-gray-300">Premium benefits for your business</CardDescription>
          </div>
          <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
            <Star className="h-5 w-5 text-amber-400" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-5 pt-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div>
            <div className="text-gray-300 text-sm">Available Points</div>
            <div className="text-3xl font-bold text-white mt-1">24,530</div>
            
          </div>
          
          <Button className="gap-2 bg-amber-500 hover:bg-amber-600 text-black" onClick={handleRedeemClick}>
            Redeem Now <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Monthly Target</span>
            <span className="text-sm font-medium text-white">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-white/10" indicatorClassName="bg-amber-400" />
          <div className="flex justify-between text-xs text-gray-300">
            <div>0 points</div>
            <div>5,000 points (Target)</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <div className="rounded-lg border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">This Month</div>
                <div className="text-base font-semibold text-white">3,840 <span className="text-xs text-green-400">+12%</span></div>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Gift className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Redeemed</div>
                <div className="text-base font-semibold text-white">114,000 <span className="text-xs text-gray-400">points</span></div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-black/30 border-t border-white/10">
        <div className="flex justify-between items-center w-full">
          <div className="text-xs text-gray-300">Latest activity: <span className="text-amber-400">+250 points</span> from Office Supplies Co.</div>
          <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-400 text-xs">
            Tier: Business Elite
          </Badge>
        </div>
      </CardFooter>
    </Card>;
};
export default RewardStatus;