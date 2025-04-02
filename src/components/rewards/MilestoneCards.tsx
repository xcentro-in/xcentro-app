
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plane, Hotel, Ticket, Lock, CheckCircle2, ChevronRight, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

interface MilestoneCard {
  id: string;
  icon: React.ElementType;
  title: string;
  pointsNeeded: number;
  currentPoints: number;
  status: 'in-progress' | 'locked' | 'redeemed';
  category: string;
  estimatedTimeToReach: string;
}

const MilestoneCards: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const milestones: MilestoneCard[] = [
    {
      id: "flight-mumbai",
      icon: Plane,
      title: "Free Flight to Mumbai",
      pointsNeeded: 50000,
      currentPoints: 36000,
      status: 'in-progress',
      category: "flights",
      estimatedTimeToReach: "4 more transactions"
    },
    {
      id: "hotel-stay",
      icon: Hotel,
      title: "5-Star Hotel Night",
      pointsNeeded: 35000,
      currentPoints: 24530,
      status: 'in-progress',
      category: "hotels",
      estimatedTimeToReach: "3 more transactions"
    },
    {
      id: "vip-event",
      icon: Ticket,
      title: "VIP Event Ticket",
      pointsNeeded: 20000,
      currentPoints: 24530,
      status: 'redeemed',
      category: "events",
      estimatedTimeToReach: "Already redeemed"
    },
    {
      id: "business-class",
      icon: Plane,
      title: "Business Class Upgrade",
      pointsNeeded: 65000,
      currentPoints: 24530,
      status: 'locked',
      category: "flights",
      estimatedTimeToReach: "8 more transactions"
    }
  ];

  const handleRedeemClick = (categoryId: string) => {
    navigate(`/rewards/redeem/${categoryId}`);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">Milestone Rewards</h2>
        <Button variant="link" className="text-primary p-0 h-auto gap-1" onClick={() => navigate('/rewards/milestones')}>
          View All <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* For desktop, use a grid */}
      <div className={isMobile ? "flex overflow-x-auto gap-4 pb-2 -mx-2 px-2" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"}>
        {milestones.map((milestone) => {
          const progress = Math.round((milestone.currentPoints / milestone.pointsNeeded) * 100);
          const pointsAway = milestone.pointsNeeded - milestone.currentPoints;
          
          return (
            <Card 
              key={milestone.id} 
              className={`${isMobile ? "min-w-[280px] max-w-[280px]" : ""} ${
                milestone.status === 'redeemed' 
                  ? "bg-green-50 border-green-100 dark:bg-green-950/20 dark:border-green-900/30" 
                  : milestone.status === 'locked'
                    ? "bg-gray-50 border-gray-100 dark:bg-gray-900/20 dark:border-gray-800/30 opacity-75"
                    : "bg-amber-50 border-amber-100 dark:bg-amber-950/10 dark:border-amber-900/20"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-full ${
                      milestone.status === 'redeemed' 
                        ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" 
                        : milestone.status === 'locked'
                          ? "bg-gray-100 text-gray-500 dark:bg-gray-800/40 dark:text-gray-400"
                          : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                    }`}>
                      <milestone.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{milestone.title}</CardTitle>
                  </div>
                  
                  <Badge variant={
                    milestone.status === 'redeemed' 
                      ? "outline" 
                      : milestone.status === 'locked'
                        ? "secondary"
                        : "default"
                  } className={`
                    text-xs font-semibold ${
                      milestone.status === 'redeemed' 
                        ? "border-green-200 bg-green-100/50 text-green-700 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30" 
                        : milestone.status === 'locked'
                          ? "bg-gray-100 text-gray-500 dark:bg-gray-800/40 dark:text-gray-400" 
                          : "bg-amber-500 text-white dark:bg-amber-600"
                    }
                  `}>
                    {milestone.status === 'redeemed' ? 'Redeemed' : milestone.status === 'locked' ? 'Locked' : 'In Progress'}
                  </Badge>
                </div>
                
                <CardDescription className="mt-2">
                  {milestone.pointsNeeded.toLocaleString()} points needed
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pb-4 space-y-4">
                {milestone.status === 'redeemed' ? (
                  <div className="flex items-center justify-center h-6 text-green-600 gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm font-medium">Already redeemed</span>
                  </div>
                ) : (
                  <>
                    <div className="space-y-1">
                      <Progress 
                        value={progress} 
                        className={`h-2 ${
                          milestone.status === 'locked' 
                            ? "bg-gray-100 dark:bg-gray-800/40" 
                            : "bg-amber-100 dark:bg-amber-900/20"
                        }`}
                        indicatorClassName={
                          milestone.status === 'locked' 
                            ? "bg-gray-400 dark:bg-gray-600" 
                            : "bg-amber-500 dark:bg-amber-600"
                        }
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <div>{milestone.currentPoints.toLocaleString()} pts</div>
                        <div>{milestone.pointsNeeded.toLocaleString()} pts</div>
                      </div>
                    </div>
                    
                    {milestone.status === 'in-progress' && (
                      <div className="text-sm">
                        <span className="font-medium text-amber-600 dark:text-amber-400">
                          Just {pointsAway.toLocaleString()} pts away
                        </span> 
                        <span className="text-muted-foreground"> • Est: {milestone.estimatedTimeToReach}</span>
                      </div>
                    )}
                    
                    {milestone.status === 'locked' && (
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Lock className="h-3.5 w-3.5" />
                        <span>Requires {pointsAway.toLocaleString()} more points</span>
                      </div>
                    )}
                  </>
                )}
                
                <Button 
                  onClick={() => handleRedeemClick(milestone.category)}
                  className="w-full gap-1"
                  variant={milestone.status === 'redeemed' ? "outline" : milestone.status === 'locked' ? "secondary" : "default"}
                  disabled={milestone.status === 'locked'}
                >
                  {milestone.status === 'redeemed' 
                    ? 'View Details' 
                    : milestone.status === 'locked' 
                      ? 'Locked' 
                      : 'Redeem Now'}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MilestoneCards;
