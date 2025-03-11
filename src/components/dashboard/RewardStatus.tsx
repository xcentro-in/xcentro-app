
import { DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const RewardStatus = () => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setProgress(78), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="animate-fade-in" style={{ animationDelay: "200ms" }}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Reward Status</CardTitle>
        <CardDescription>Your rewards program progress</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Monthly target</span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium">Available Points</div>
                <div className="text-xs text-muted-foreground">Convert or use</div>
              </div>
            </div>
            <div className="text-base font-semibold">24,530</div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-purple-500" />
              </div>
              <div>
                <div className="text-sm font-medium">Points This Month</div>
                <div className="text-xs text-muted-foreground">Current progress</div>
              </div>
            </div>
            <div className="text-base font-semibold">3,840</div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">Redeem Points</Button>
      </CardFooter>
    </Card>
  );
};

export default RewardStatus;
