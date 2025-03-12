
import { 
  Gift, 
  TrendingUp, 
  CreditCard, 
  Award, 
  ChevronRight,
  Share,
  ExternalLink,
  Star,
  Plane,
  Hotel,
  Ticket,
  Car,
  Tag,
  Package,
  Plus
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

// Redemption category type definition
interface RedemptionCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  pointsNeeded: number;
  items: RedemptionItem[];
}

interface RedemptionItem {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  image?: string;
}

const Rewards = () => {
  const [progress, setProgress] = useState(0);
  const [openRedemptionDialog, setOpenRedemptionDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  useEffect(() => {
    const timer = setTimeout(() => setProgress(78), 500);
    return () => clearTimeout(timer);
  }, []);

  // Sample redemption categories data
  const redemptionCategories: RedemptionCategory[] = [
    {
      id: "flights",
      title: "Flight Partners",
      description: "Convert points to airline loyalty miles",
      icon: Plane,
      pointsNeeded: 10000,
      items: [
        { 
          id: "flight-1", 
          title: "Emirates Skywards", 
          description: "10,000 points = 5,000 Skywards Miles",
          pointsCost: 10000 
        },
        { 
          id: "flight-2", 
          title: "Star Alliance", 
          description: "10,000 points = 4,000 Star Alliance Miles",
          pointsCost: 10000 
        },
        { 
          id: "flight-3", 
          title: "Delta SkyMiles", 
          description: "10,000 points = 4,500 SkyMiles",
          pointsCost: 10000 
        }
      ]
    },
    {
      id: "hotels",
      title: "Hotel Partners",
      description: "Convert points to hotel loyalty rewards",
      icon: Hotel,
      pointsNeeded: 8000,
      items: [
        { 
          id: "hotel-1", 
          title: "Marriott Bonvoy", 
          description: "8,000 points = 3,000 Bonvoy Points",
          pointsCost: 8000 
        },
        { 
          id: "hotel-2", 
          title: "Hilton Honors", 
          description: "8,000 points = 3,500 Honors Points",
          pointsCost: 8000 
        }
      ]
    },
    {
      id: "events",
      title: "VIP Events & Experiences",
      description: "Exclusive access to premium events",
      icon: Ticket,
      pointsNeeded: 15000,
      items: [
        { 
          id: "event-1", 
          title: "Tech Conference VIP Pass", 
          description: "Access to VIP lounge and speaker meetings",
          pointsCost: 15000 
        },
        { 
          id: "event-2", 
          title: "Business Summit", 
          description: "Reserved seating and networking cocktail hour",
          pointsCost: 18000 
        }
      ]
    },
    {
      id: "travel",
      title: "Luxury Travel & Rentals",
      description: "Business-class transport, chauffeur services",
      icon: Car,
      pointsNeeded: 12000,
      items: [
        { 
          id: "travel-1", 
          title: "Premium Car Rental", 
          description: "One day luxury car rental",
          pointsCost: 12000 
        },
        { 
          id: "travel-2", 
          title: "Airport Chauffeur Service", 
          description: "Chauffeur pickup and dropoff",
          pointsCost: 8000 
        }
      ]
    },
    {
      id: "business",
      title: "Business Service Discounts",
      description: "Exclusive vendor deals, software discounts",
      icon: Tag,
      pointsNeeded: 5000,
      items: [
        { 
          id: "business-1", 
          title: "SaaS Subscription Discount", 
          description: "30% off annual subscription for business tools",
          pointsCost: 5000 
        },
        { 
          id: "business-2", 
          title: "Marketing Services Credit", 
          description: "$200 credit for digital marketing services",
          pointsCost: 7500 
        }
      ]
    },
    {
      id: "gifts",
      title: "Curated Luxury Gifts",
      description: "High-end business merchandise",
      icon: Package,
      pointsNeeded: 10000,
      items: [
        { 
          id: "gift-1", 
          title: "Premium Business Accessories", 
          description: "Leather portfolio, pen set, and card holder",
          pointsCost: 10000 
        },
        { 
          id: "gift-2", 
          title: "Executive Tech Package", 
          description: "Noise-cancelling headphones and smart accessories",
          pointsCost: 15000 
        }
      ]
    }
  ];

  const handleRedeemPoints = (itemId: string, categoryId: string) => {
    const category = redemptionCategories.find(cat => cat.id === categoryId);
    const item = category?.items.find(item => item.id === itemId);
    
    if (item) {
      toast.success(`Redeemed: ${item.title} for ${item.pointsCost} points`);
      setOpenRedemptionDialog(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight animate-slide-up">Rewards Dashboard</h1>
        <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: "50ms" }}>
          Track and redeem your business rewards
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2 animate-fade-in overflow-hidden">
          <CardHeader className="pb-0">
            <CardTitle className="text-lg font-semibold">Current Rewards Summary</CardTitle>
            <CardDescription>
              Overview of your rewards program status
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
              <div className="text-center md:text-left">
                <div className="text-sm font-medium text-muted-foreground mb-2">Available Reward Points</div>
                <div className="text-4xl font-bold">24,530</div>
                <div className="text-sm text-muted-foreground mt-1">= Approx. $245 value</div>
              </div>
              
              <div className="flex gap-4">
                <Dialog open={openRedemptionDialog} onOpenChange={setOpenRedemptionDialog}>
                  <DialogTrigger asChild>
                    <Button className="h-10">Redeem Now</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Redeem Your Reward Points</DialogTitle>
                      <DialogDescription>
                        Choose from premium redemption options below
                      </DialogDescription>
                    </DialogHeader>
                    
                    {selectedCategory ? (
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <Button 
                            variant="ghost" 
                            className="px-2" 
                            onClick={() => setSelectedCategory(null)}
                          >
                            <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
                            Back to Categories
                          </Button>
                        </div>
                        
                        <h3 className="text-lg font-medium">
                          {redemptionCategories.find(cat => cat.id === selectedCategory)?.title}
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {redemptionCategories
                            .find(cat => cat.id === selectedCategory)
                            ?.items.map(item => (
                              <Card key={item.id} className="hover:border-primary/50 transition-colors">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-base">{item.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="pb-3">
                                  <p className="text-sm text-muted-foreground">{item.description}</p>
                                </CardContent>
                                <CardFooter className="flex justify-between items-center pt-0">
                                  <Badge variant="outline" className="bg-primary/10 text-primary">
                                    {item.pointsCost.toLocaleString()} points
                                  </Badge>
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleRedeemPoints(item.id, selectedCategory)}
                                    disabled={item.pointsCost > 24530}
                                  >
                                    Redeem Now
                                  </Button>
                                </CardFooter>
                              </Card>
                            ))}
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                        {redemptionCategories.map(category => (
                          <div 
                            key={category.id}
                            className="flex flex-col p-4 border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer"
                            onClick={() => setSelectedCategory(category.id)}
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <category.icon className="h-5 w-5 text-primary" />
                              </div>
                              <div className="font-medium">{category.title}</div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                            <div className="mt-auto flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                Starting from {category.pointsNeeded.toLocaleString()} points
                              </span>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline" className="h-10 gap-1.5">
                  <Share className="h-4 w-4" />
                  Transfer
                </Button>
              </div>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Monthly Reward Target</div>
                  <div className="text-sm">{progress}% Complete</div>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <div>0 points</div>
                  <div>5,000 points (Target)</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                {[
                  { label: "Earned This Month", value: "3,840", icon: TrendingUp, color: "text-primary" },
                  { label: "Lifetime Earned", value: "138,570", icon: Award, color: "text-purple-500" },
                  { label: "Redeemed Value", value: "$1,140", icon: Gift, color: "text-green-500" },
                ].map((stat, i) => (
                  <div key={stat.label} className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <stat.icon className={cn("h-4 w-4", stat.color)} />
                      <span className="text-sm text-muted-foreground">{stat.label}</span>
                    </div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Redemption Options</CardTitle>
            <CardDescription>
              Ways to use your reward points
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: "Travel Credits", points: "15,000", cashValue: "$150", icon: ExternalLink },
              { title: "Statement Credit", points: "10,000", cashValue: "$100", icon: CreditCard },
              { title: "Gift Cards", points: "5,000", cashValue: "$50", icon: Gift },
            ].map((option, i) => (
              <div 
                key={option.title} 
                className="rounded-md border p-3 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer"
                onClick={() => {
                  setOpenRedemptionDialog(true);
                  if (option.title === "Travel Credits") {
                    setSelectedCategory("flights");
                  } else if (option.title === "Gift Cards") {
                    setSelectedCategory("gifts");
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <option.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{option.title}</div>
                      <div className="text-xs text-muted-foreground">{option.points} points = {option.cashValue}</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full gap-1.5"
              onClick={() => setOpenRedemptionDialog(true)}
            >
              <ExternalLink className="h-4 w-4" />
              View All Options
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="animate-fade-in" style={{ animationDelay: "150ms" }}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Earning History</CardTitle>
            <CardDescription>
              Recent reward point transactions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border">
              <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 p-3 bg-muted/50">
                <div className="font-medium">Transaction</div>
                <div className="text-right font-medium">Points</div>
                <div className="text-right font-medium">Date</div>
              </div>
              
              <div className="divide-y">
                {[
                  { vendor: "Office Supplies Co.", points: 250, date: "Today" },
                  { vendor: "Cloud Services", points: 90, date: "Yesterday" },
                  { vendor: "Marketing Agency", points: 600, date: "Aug 12" },
                  { vendor: "IT Support", points: 130, date: "Aug 10" },
                  { vendor: "Office Furniture", points: 475, date: "Aug 5" },
                ].map((transaction, i) => (
                  <div 
                    key={transaction.vendor}
                    className="grid grid-cols-[1fr_auto_auto] items-center gap-4 p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="font-medium truncate">{transaction.vendor}</div>
                    <div className="text-right font-medium text-green-500">+{transaction.points}</div>
                    <div className="text-right text-sm text-muted-foreground">{transaction.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="gap-1 mx-auto">
              View Complete History <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="animate-fade-in" style={{ animationDelay: "200ms" }}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Spending Recommendations</CardTitle>
            <CardDescription>
              Smart suggestions to maximize rewards
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                title: "Use Credit Card for Software Subscriptions",
                description: "Earn 3x points on all software and SaaS subscriptions",
                savings: "300+ points/month",
                badge: "Recommended"
              },
              {
                title: "Pay Office Utilities with Bank Transfer",
                description: "Save on transaction fees with direct bank payments",
                savings: "Avg. $25/month in fees",
                badge: "Cost Saving"
              },
              {
                title: "Bundle Marketing Services Payments",
                description: "Qualify for 5x points with $5000+ monthly spend",
                savings: "~2,000 extra points/month",
                badge: "Points Booster"
              },
            ].map((recommendation, i) => (
              <div key={recommendation.title} className="rounded-md border p-4 hover:border-primary/30 hover:bg-primary/5 transition-all">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium text-base">{recommendation.title}</h3>
                  <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary text-xs">
                    {recommendation.badge}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{recommendation.description}</p>
                <p className="text-sm font-medium">Potential benefit: {recommendation.savings}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Rewards;
