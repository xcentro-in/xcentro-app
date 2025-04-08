
import React from "react";
import { 
  Lock, 
  CheckCircle2,
  Info,
  Star
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MilestoneCardProps } from "@/types/milestone";

const MilestoneCard: React.FC<{
  milestone: MilestoneCardProps;
  onRedeemClick: (categoryId: string) => void;
}> = ({ milestone, onRedeemClick }) => {
  const progress = Math.round((milestone.currentPoints / milestone.pointsNeeded) * 100);
  const pointsAway = milestone.pointsNeeded - milestone.currentPoints;
    
  return (
    <Card 
      key={milestone.id} 
      className={`${
        milestone.status === 'completed' 
          ? "bg-green-50 border-green-100 dark:bg-green-950/20 dark:border-green-900/30" 
          : milestone.status === 'locked'
            ? "bg-gray-50 border-gray-100 dark:bg-gray-900/20 dark:border-gray-800/30 opacity-75"
            : "bg-amber-50 border-amber-100 dark:bg-amber-950/10 dark:border-amber-900/20"
      } ${milestone.isCustom ? "ring-1 ring-blue-300" : ""}`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-full ${
              milestone.status === 'completed' 
                ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" 
                : milestone.status === 'locked'
                  ? "bg-gray-100 text-gray-500 dark:bg-gray-800/40 dark:text-gray-400"
                  : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
            }`}>
              <milestone.icon className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg">
              {milestone.title}
              {milestone.isCustom && (
                <span className="ml-2 text-xs text-blue-500">
                  <Star className="h-3 w-3 inline" /> Custom
                </span>
              )}
            </CardTitle>
          </div>
          
          <Badge variant={
            milestone.status === 'completed' 
              ? "outline" 
              : milestone.status === 'locked'
                ? "secondary"
                : "default"
          } className={`
            text-xs font-semibold ${
              milestone.status === 'completed' 
                ? "border-green-200 bg-green-100/50 text-green-700 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30" 
                : milestone.status === 'locked'
                  ? "bg-gray-100 text-gray-500 dark:bg-gray-800/40 dark:text-gray-400" 
                  : "bg-amber-500 text-white dark:bg-amber-600"
            }
          `}>
            {milestone.status === 'completed' ? 'Completed' : milestone.status === 'locked' ? 'Locked' : 'In Progress'}
          </Badge>
        </div>
        
        <CardDescription className="mt-1.5">
          {milestone.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-3 space-y-3">
        {milestone.status === 'completed' ? (
          <div className="flex items-center justify-center h-6 text-green-600 gap-1.5">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-medium">
              Completed on {milestone.completionDate}
            </span>
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
            
            {milestone.status === 'active' && (
              <div className="text-sm">
                <span className="font-medium text-amber-600 dark:text-amber-400">
                  Just {pointsAway.toLocaleString()} pts away
                </span> 
                <span className="text-muted-foreground"> • Est: {milestone.estimatedTimeToReach}</span>
              </div>
            )}
            
            {milestone.status === 'locked' && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Lock className="h-3.5 w-3.5" />
                      <span>Requires {pointsAway.toLocaleString()} more points</span>
                      <Info className="h-3.5 w-3.5 ml-1 cursor-help text-gray-400" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-800 text-white border-gray-700">
                    <p>Earn {pointsAway.toLocaleString()} points to unlock this reward!</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </>
        )}
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          onClick={() => onRedeemClick(milestone.category)}
          variant={milestone.status === 'completed' ? "outline" : milestone.status === 'locked' ? "secondary" : "default"}
          disabled={milestone.status === 'locked'}
        >
          {milestone.status === 'completed' 
            ? 'View Details' 
            : milestone.status === 'locked' 
              ? 'Locked' 
              : 'Redeem Now'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MilestoneCard;
