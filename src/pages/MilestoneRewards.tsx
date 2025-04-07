
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Lock, 
  CheckCircle2, 
  Plus, 
  ArrowLeft, 
  Award, 
  Star 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import RewardsHeader from "@/components/rewards/RewardsHeader";

interface MilestoneCard {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  pointsNeeded: number;
  currentPoints: number;
  status: 'active' | 'locked' | 'completed';
  category: 'travel' | 'business' | 'personal' | 'vip';
  estimatedTimeToReach?: string;
  completionDate?: string;
  isCustom?: boolean;
}

const MilestoneRewards = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [customTitle, setCustomTitle] = useState("");
  const [customPoints, setCustomPoints] = useState<number>(10000);
  const [customReward, setCustomReward] = useState("");
  
  // Sample milestone data
  const milestones: MilestoneCard[] = [
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
  
  // Filter milestones based on active tab
  const filteredMilestones = milestones.filter(milestone => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return milestone.status === "active";
    if (activeTab === "locked") return milestone.status === "locked";
    if (activeTab === "completed") return milestone.status === "completed";
    return true;
  });

  const handleBack = () => {
    navigate('/rewards');
  };

  const handleRedeemClick = (categoryId: string) => {
    navigate(`/rewards/redeem/${categoryId}`);
  };

  const handleCreateCustomMilestone = () => {
    if (!customTitle || !customReward || customPoints <= 0) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // In a real app, we would save this to the backend
    toast.success("Custom milestone created successfully!");
    setCreateDialogOpen(false);
    
    // Reset form fields
    setCustomTitle("");
    setCustomPoints(10000);
    setCustomReward("");
  };

  const totalPoints = 24530;
  const nextMilestone = milestones.filter(m => m.status === 'active')
    .sort((a, b) => (a.pointsNeeded - a.currentPoints) - (b.pointsNeeded - b.currentPoints))[0];
  const pointsToNextMilestone = nextMilestone ? nextMilestone.pointsNeeded - nextMilestone.currentPoints : 0;

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
      
      {/* Quick Stats Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 space-y-6">
          {/* Tabs for filtering milestones */}
          <Tabs defaultValue="active" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="locked">Locked</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            {/* Grid of milestone cards */}
            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMilestones.map((milestone) => {
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
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Lock className="h-3.5 w-3.5" />
                                <span>Requires {pointsAway.toLocaleString()} more points</span>
                              </div>
                            )}
                          </>
                        )}
                      </CardContent>
                      
                      <CardFooter className="pt-0">
                        <Button 
                          onClick={() => handleRedeemClick(milestone.category)}
                          className="w-full"
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
                })}
              </div>
              
              {filteredMilestones.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-gray-100 p-3 rounded-full mb-4">
                    <Award className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">No milestones found</h3>
                  <p className="text-muted-foreground mb-4">
                    No {activeTab} milestones to display at the moment
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Side panel with quick stats */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Your Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Total Points</span>
                  <span className="font-semibold">{totalPoints.toLocaleString()}</span>
                </div>
                
                {nextMilestone && (
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Next Milestone:</span>
                    </div>
                    <div className="bg-amber-50 rounded-md p-2.5 border border-amber-100 dark:bg-amber-950/10 dark:border-amber-900/20">
                      <div className="font-medium text-sm">{nextMilestone.title}</div>
                      <div className="text-xs text-amber-600">
                        {pointsToNextMilestone.toLocaleString()} points needed
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Create Custom Goal
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Completed milestones summary */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Completed Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              {milestones.filter(m => m.status === 'completed').length > 0 ? (
                <div className="space-y-3">
                  {milestones
                    .filter(m => m.status === 'completed')
                    .slice(0, 3)
                    .map(milestone => (
                      <div key={milestone.id} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="truncate">{milestone.title}</span>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No completed milestones yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Custom Milestone Creation Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Custom Goal</DialogTitle>
            <DialogDescription>
              Set your own milestone goals to track your progress.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Goal Title</Label>
              <Input
                id="title"
                placeholder="e.g., Business Conference Trip"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="points">
                Points Target: {customPoints.toLocaleString()}
              </Label>
              <Slider
                id="points"
                min={5000}
                max={100000}
                step={1000}
                value={[customPoints]}
                onValueChange={([value]) => setCustomPoints(value)}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5,000</span>
                <span>100,000</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reward">Desired Reward</Label>
              <Input
                id="reward"
                placeholder="e.g., Flight tickets to conference"
                value={customReward}
                onChange={(e) => setCustomReward(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCustomMilestone}>
              Create Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MilestoneRewards;
