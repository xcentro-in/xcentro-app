
import { DollarSign, Gift, TrendingUp, Star, ChevronRight, Plane, Award, Lock, CheckCircle2, CreditCard, Calendar, ArrowRight, Share, Wallet } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const RewardStatus = () => {
  const [progress, setProgress] = useState(0);
  const [goalProgress, setGoalProgress] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(78);
      setGoalProgress(72);
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  
  const handleRedeemClick = () => {
    navigate('/rewards');
  };
  
  const handlePayNowClick = () => {
    navigate('/new-payment', {
      state: {
        paymentCategory: 'gst'
      }
    });
  };
  
  return (
    <Card className="animate-fade-in overflow-hidden border-0 shadow-md bg-gradient-to-br from-[#1A1F2C] to-[#221F26] text-white" style={{
      animationDelay: "200ms"
    }}>
      <CardHeader className="border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-white">My Rewards</CardTitle>
            <CardDescription className="text-gray-300">Track & redeem your business rewards</CardDescription>
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
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1 cursor-help">
                    <Wallet className="h-3 w-3" />
                    <span>Worth approx ₹12,000</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="p-3 bg-gray-800 border-gray-700">
                  <p className="font-medium mb-1 text-white">Points Value Breakdown</p>
                  <ul className="text-xs space-y-1 text-gray-300">
                    <li className="flex justify-between">
                      <span>Flight Redemption:</span>
                      <span>₹0.60 per point</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Hotel Redemption:</span>
                      <span>₹0.55 per point</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Cashback:</span>
                      <span>₹0.40 per point</span>
                    </li>
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex gap-3">
            <Button className="gap-2 bg-amber-500 hover:bg-amber-600 text-black" onClick={handleRedeemClick}>
              Redeem <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="border-white/20 bg-white/5 hover:bg-white/10">
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Monthly Target Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-300">Monthly Target</div>
            <div className="text-sm text-gray-300">{progress}% Complete</div>
          </div>
          <Progress value={progress} className="h-2 bg-white/10" indicatorClassName="bg-blue-500" />
          <div className="flex justify-between text-xs text-gray-400">
            <div>0 points</div>
            <div>5,000 points (Target)</div>
          </div>
        </div>

        {/* Goal Tracker with Milestones */}
        <div className="space-y-2 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Plane className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-medium text-white">Free Flight to Mumbai (50,000 pts)</span>
            </div>
            <span className="text-sm font-bold text-white">{goalProgress}%</span>
          </div>
          
          <Progress value={goalProgress} className="h-2.5 bg-white/10" indicatorClassName="bg-gradient-to-r from-amber-400 to-amber-500" />
          
          <div className="text-xs text-gray-300">
            <span className="font-medium text-amber-400">Just 14,000 pts away</span> • Estimate: 4 more transactions this month
          </div>
        </div>
        
        {/* Contextual Action Suggestion */}
        <div className="bg-white/10 rounded-lg p-3.5 border border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <CreditCard className="h-4 w-4 text-purple-400" />
              <p className="text-sm font-medium text-white">Earn 3,200 points now</p>
            </div>
            <p className="text-xs text-gray-300">Pay your upcoming GST invoice through credit card</p>
          </div>
          <Button size="sm" variant="outline" onClick={handlePayNowClick} className="border-white/20 h-8 bg-teal-700 hover:bg-teal-600">
            Pay Now
          </Button>
        </div>
        
        {/* Reward Milestone Shelf */}
        <div className="mt-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-300">Reward Milestones</h3>
            <Button variant="link" className="p-0 h-auto text-amber-400 text-xs" onClick={handleRedeemClick}>
              View All <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
            {/* Redeemed Reward */}
            <div className="min-w-[140px] bg-white/5 border border-white/10 rounded-lg p-3 flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <Badge variant="outline" className="px-1.5 py-0.5 text-[10px] bg-green-500/20 text-green-400 border-green-500/30">
                  Redeemed
                </Badge>
                <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
              </div>
              <p className="text-sm font-medium text-white">Hotel Stay</p>
              <p className="text-xs text-gray-400 mt-1">₹15,000 value</p>
            </div>
            
            {/* In Progress Reward */}
            <div className="min-w-[140px] bg-white/5 border border-white/10 rounded-lg p-3 flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <Badge variant="outline" className="px-1.5 py-0.5 text-[10px] bg-amber-500/20 text-amber-400 border-amber-500/30">
                  In Progress
                </Badge>
                <div className="text-[10px] font-semibold text-amber-400">74%</div>
              </div>
              <p className="text-sm font-medium text-white">VIP Concert Pass</p>
              <Progress value={74} className="h-1 bg-white/10 mt-2" indicatorClassName="bg-amber-400" />
            </div>
            
            {/* Locked Reward */}
            <div className="min-w-[140px] bg-white/5 border border-white/10 rounded-lg p-3 flex flex-col opacity-60">
              <div className="flex items-center justify-between mb-1">
                <Badge variant="outline" className="px-1.5 py-0.5 text-[10px] bg-gray-500/20 text-gray-400 border-gray-500/30">
                  Locked
                </Badge>
                <Lock className="h-3.5 w-3.5 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-white">Business Class Upgrade</p>
              <p className="text-xs text-gray-400 mt-1">50,000 points needed</p>
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
    </Card>
  );
};

export default RewardStatus;
