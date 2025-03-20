
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon, ArrowRight, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { RedemptionCategory, RedemptionItem, LoyaltyPartner } from "@/types/rewards";
import { redemptionCategories } from "@/data/redemptionCategories";

// Enhanced mock data for loyalty partners with images
const mockPartners: LoyaltyPartner[] = [
  {
    id: "emirates",
    name: "Emirates Skywards",
    type: "airline",
    conversionRatio: 0.5, // 1 PaySphere point = 0.5 Skywards miles
    category: "flights",
    membershipDetails: {
      membershipNumber: "EK123456789",
      registeredName: "John Doe",
      email: "john@example.com"
    }
  },
  {
    id: "delta",
    name: "Delta SkyMiles",
    type: "airline",
    conversionRatio: 0.6,
    category: "flights",
    membershipDetails: {
      membershipNumber: "DL987654321",
      registeredName: "John Doe",
      email: "john@example.com"
    }
  },
  {
    id: "united",
    name: "United MileagePlus",
    type: "airline",
    conversionRatio: 0.7,
    category: "flights",
    membershipDetails: {
      membershipNumber: "UA567891234",
      registeredName: "John Doe",
      email: "john@example.com"
    }
  },
  {
    id: "marriott",
    name: "Marriott Bonvoy",
    type: "hotel",
    conversionRatio: 0.3, // 1 PaySphere point = 0.3 Bonvoy points
    category: "hotels",
    membershipDetails: {
      membershipNumber: "MB987654321",
      registeredName: "John Doe",
      email: "john@example.com"
    }
  },
  {
    id: "hilton",
    name: "Hilton Honors",
    type: "hotel",
    conversionRatio: 0.4,
    category: "hotels",
    membershipDetails: {
      membershipNumber: "HH555123789",
      registeredName: "John Doe",
      email: "john@example.com"
    }
  },
  {
    id: "hyatt",
    name: "World of Hyatt",
    type: "hotel",
    conversionRatio: 0.5,
    category: "hotels",
    membershipDetails: {
      membershipNumber: "WH421987654",
      registeredName: "John Doe",
      email: "john@example.com"
    }
  },
  {
    id: "avis",
    name: "Avis Preferred",
    type: "car",
    conversionRatio: 0.4,
    category: "travel",
    membershipDetails: {
      membershipNumber: "AP846271539",
      registeredName: "John Doe",
      email: "john@example.com"
    }
  },
  {
    id: "hertz",
    name: "Hertz Gold Plus",
    type: "car",
    conversionRatio: 0.3,
    category: "travel",
    membershipDetails: {
      membershipNumber: "HG732914856",
      registeredName: "John Doe",
      email: "john@example.com"
    }
  },
  {
    id: "enterprise",
    name: "Enterprise Plus",
    type: "car",
    conversionRatio: 0.35,
    category: "travel",
    membershipDetails: {
      membershipNumber: "EP123459876",
      registeredName: "John Doe",
      email: "john@example.com"
    }
  },
  {
    id: "ticketmaster",
    name: "Ticketmaster VIP",
    type: "event",
    conversionRatio: 0.25,
    category: "events",
    membershipDetails: {
      membershipNumber: "TM458976231",
      registeredName: "John Doe",
      email: "john@example.com"
    }
  },
  {
    id: "stubhub",
    name: "StubHub Rewards",
    type: "event",
    conversionRatio: 0.3,
    category: "events",
    membershipDetails: {
      membershipNumber: "SH987123456",
      registeredName: "John Doe",
      email: "john@example.com"
    }
  },
  {
    id: "livenation",
    name: "Live Nation Premium",
    type: "event",
    conversionRatio: 0.35,
    category: "events",
    membershipDetails: {
      membershipNumber: "LN753159624",
      registeredName: "John Doe",
      email: "john@example.com"
    }
  }
];

const getPartnerIcon = (type: string): string => {
  switch (type) {
    case 'airline':
      return 'https://images.unsplash.com/photo-1487887235947-a955ef187fcc?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80';
    case 'hotel':
      return 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80';
    case 'car':
      return 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80';
    case 'event':
      return 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80';
    default:
      return 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80';
  }
};

const RedemptionFlow: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId, itemId } = useParams<{ categoryId: string; itemId: string }>();
  const [step, setStep] = useState<number>(1);
  const [pointsToRedeem, setPointsToRedeem] = useState<number>(0);
  const [agreementChecked, setAgreementChecked] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [category, setCategory] = useState<RedemptionCategory | null>(null);
  const [item, setItem] = useState<RedemptionItem | null>(null);
  const [partners, setPartners] = useState<LoyaltyPartner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<LoyaltyPartner | null>(null);
  const [pointsError, setPointsError] = useState<string | null>(null);
  
  const availablePoints = 24530; // This would come from your app state or API
  
  // Find the category and item based on URL parameters
  useEffect(() => {
    if (categoryId) {
      const foundCategory = redemptionCategories.find(cat => cat.id === categoryId);
      if (foundCategory) {
        setCategory(foundCategory);
        
        if (itemId) {
          const foundItem = foundCategory.items.find(item => item.id === itemId);
          if (foundItem) {
            setItem(foundItem);
            // Default redemption to minimum points needed
            setPointsToRedeem(foundItem.pointsCost || foundCategory.pointsNeeded);
          }
        } else if (foundCategory.items.length > 0) {
          // If no itemId is provided, use the first item in the category
          setItem(foundCategory.items[0]);
          setPointsToRedeem(foundCategory.items[0].pointsCost || foundCategory.pointsNeeded);
        }
      }
    }
  }, [categoryId, itemId]);
  
  // Filter partners by category
  useEffect(() => {
    if (category) {
      // Find partners that are relevant to this category
      const relevantPartners = mockPartners.filter(partner => partner.category === category.id);
      if (relevantPartners.length > 0) {
        setPartners(relevantPartners);
        setSelectedPartner(relevantPartners[0]);
      }
    }
  }, [category]);
  
  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setPointsToRedeem(value);
      
      // Validate minimum points
      if (item && value < item.pointsCost) {
        setPointsError(`Minimum should be ${item.pointsCost.toLocaleString()} points`);
      } else {
        setPointsError(null);
      }
    }
  };
  
  const handlePartnerSelect = (partnerId: string) => {
    const partner = partners.find(p => p.id === partnerId);
    if (partner) {
      setSelectedPartner(partner);
    }
  };
  
  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };
  
  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate("/rewards");
    }
  };
  
  const handleSubmit = async () => {
    if (!agreementChecked) {
      toast.error("Please accept the conversion terms");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success(`Successfully redeemed ${pointsToRedeem} points for ${selectedPartner?.name}`);
      setIsSubmitting(false);
      navigate("/rewards", { state: { redemptionCompleted: true } });
    }, 1500);
  };
  
  if (!category || !item) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p>Loading redemption options...</p>
      </div>
    );
  }
  
  // Calculate converted points
  const getConvertedPoints = () => {
    if (selectedPartner) {
      return Math.floor(pointsToRedeem * selectedPartner.conversionRatio);
    }
    return 0;
  };

  return (
    <div className="space-y-8">
      <div>
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={handlePreviousStep}
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" /> 
          {step > 1 ? "Previous Step" : "Back to Rewards"}
        </Button>
        
        <h1 className="text-3xl font-bold tracking-tight animate-slide-up bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Redeem Your Points
        </h1>
        <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: "50ms" }}>
          Convert your PaySphere points to premium rewards
        </p>
      </div>
      
      <div className="w-full mb-8">
        <div className="flex justify-between mb-2">
          {["Select Partner", "Redeem Points", "Confirm Redemption"].map((stepName, idx) => (
            <div 
              key={stepName} 
              className={`flex items-center ${idx + 1 === step ? "text-primary font-medium" : "text-muted-foreground"}`}
            >
              <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-2 
                ${idx + 1 === step ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white" : 
                  idx + 1 < step ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                {idx + 1 < step ? <Check className="h-4 w-4" /> : idx + 1}
              </div>
              <span className="hidden sm:inline">{stepName}</span>
            </div>
          ))}
        </div>
        <Progress value={(step / 3) * 100} className="h-2" />
      </div>
      
      <Card className="border-none shadow-md bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
        <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-white to-blue-50/50 dark:from-slate-800 dark:to-blue-900/20">
          <CardTitle className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              {React.createElement(category.icon, { className: "h-5 w-5 text-primary" })}
            </div>
            <div>
              {category.title} <span className="text-muted-foreground font-normal">/ {item.title}</span>
            </div>
          </CardTitle>
          <CardDescription>
            {item.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg mb-4">Select Your Loyalty Program</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {partners.length > 0 ? (
                    partners.map(partner => (
                      <div 
                        key={partner.id} 
                        className={`group rounded-lg border overflow-hidden cursor-pointer transition-all hover:shadow-md
                          ${selectedPartner?.id === partner.id ? 'border-primary shadow-md bg-primary/5' : 'hover:border-primary/30 hover:bg-primary/5'}`}
                        onClick={() => handlePartnerSelect(partner.id)}
                      >
                        <div className="h-36 relative overflow-hidden">
                          <img 
                            src={getPartnerIcon(partner.type)} 
                            alt={partner.name} 
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                            <div className="font-medium text-white">{partner.name}</div>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <div className="flex justify-between items-center">
                            <div className="text-sm font-medium">Conversion Rate</div>
                            <div className="text-sm">1:{partner.conversionRatio}</div>
                          </div>
                          
                          {selectedPartner?.id === partner.id && (
                            <div className="bg-primary/10 text-primary text-sm font-medium rounded-full px-3 py-1 mt-3 text-center">
                              Selected
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-8 border border-dashed rounded-md col-span-3">
                      <p className="text-muted-foreground mb-2">No linked loyalty programs found</p>
                      <Button onClick={() => navigate("/settings")}>
                        Set Up Partners in Settings
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-lg mb-4">Redeem Points</h3>
                
                {selectedPartner && (
                  <div className="p-5 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/20 rounded-lg border mb-5">
                    <h4 className="font-medium mb-3">Your {selectedPartner.name} Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Membership Number</Label>
                        <p className="font-medium">{selectedPartner.membershipDetails?.membershipNumber || "Not provided"}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Registered Name</Label>
                        <p className="font-medium">{selectedPartner.membershipDetails?.registeredName || "Not provided"}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Registered Email</Label>
                        <p className="font-medium">{selectedPartner.membershipDetails?.email || "Not provided"}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Conversion Rate</Label>
                        <p className="font-medium">1:{selectedPartner.conversionRatio}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/20 p-5 rounded-lg border mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Your Available Points</div>
                      <div className="text-2xl font-bold">{availablePoints.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Minimum Required</div>
                      <div className="text-xl font-medium">{item.pointsCost.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <Progress value={(availablePoints / 30000) * 100} className="h-2 mb-2" />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="pointsToRedeem" className="text-base font-medium block">
                      Points to Redeem
                    </Label>
                    <div className="flex items-center mt-2 space-x-3">
                      <div className="relative w-64">
                        <Input 
                          id="pointsToRedeem" 
                          type="number" 
                          value={pointsToRedeem}
                          onChange={handlePointsChange}
                          min={item.pointsCost}
                          max={availablePoints}
                          className="text-left pr-12 h-10"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          pts
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setPointsToRedeem(availablePoints);
                          setPointsError(null);
                        }}
                        className="h-10"
                      >
                        Max
                      </Button>
                    </div>
                    {pointsError && (
                      <p className="text-destructive text-sm mt-2">
                        {pointsError}
                      </p>
                    )}
                    {pointsToRedeem > availablePoints && (
                      <p className="text-destructive text-sm mt-2">
                        You don't have enough points
                      </p>
                    )}
                  </div>
                  
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/20 rounded-lg border overflow-hidden mt-6">
                    <div className="p-4 border-b bg-white/50 dark:bg-black/10">
                      <h4 className="font-medium">Conversion Preview</h4>
                    </div>
                    
                    <div className="flex items-center justify-center gap-10 p-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold">{pointsToRedeem.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground mt-1">PaySphere Points</div>
                      </div>
                      <div className="text-primary">
                        <ArrowRight className="h-8 w-8" />
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          {getConvertedPoints().toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">{selectedPartner?.name} Points</div>
                      </div>
                    </div>
                    
                    <div className="bg-white/80 dark:bg-black/20 p-3 text-center text-sm text-muted-foreground">
                      Conversion Rate: 1 PaySphere Point = {selectedPartner?.conversionRatio} {selectedPartner?.name} Points
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-5">
              <h3 className="font-medium text-lg mb-4">Confirm Your Redemption</h3>
              
              <div className="rounded-lg border overflow-hidden bg-white dark:bg-slate-800">
                <div className="p-4 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/20 border-b">
                  <h4 className="font-medium">Redemption Summary</h4>
                </div>
                
                <div className="p-5 space-y-4">
                  <div className="flex justify-between pb-3 border-b">
                    <span className="text-muted-foreground">Selected Partner</span>
                    <span className="font-medium">{selectedPartner?.name}</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b">
                    <span className="text-muted-foreground">Membership Number</span>
                    <span className="font-medium">{selectedPartner?.membershipDetails?.membershipNumber}</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b">
                    <span className="text-muted-foreground">Points to Redeem</span>
                    <span className="font-medium">{pointsToRedeem.toLocaleString()} PaySphere Points</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b">
                    <span className="text-muted-foreground">You'll Receive</span>
                    <span className="font-medium">{getConvertedPoints().toLocaleString()} {selectedPartner?.name} Points</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Remaining Balance</span>
                    <span className="font-medium">{(availablePoints - pointsToRedeem).toLocaleString()} PaySphere Points</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-5 border rounded-lg bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/20">
                <div className="flex items-start space-x-3 mb-1">
                  <Checkbox 
                    id="terms" 
                    checked={agreementChecked}
                    onCheckedChange={(checked) => setAgreementChecked(checked as boolean)}
                    className="mt-1"
                  />
                  <Label 
                    htmlFor="terms" 
                    className="text-base leading-relaxed cursor-pointer"
                  >
                    I understand that this conversion is final and cannot be reversed. Points will be 
                    transferred to my loyalty account within 3-5 business days.
                  </Label>
                </div>
                <div className={`ml-7 text-sm ${agreementChecked ? 'text-muted-foreground' : 'text-amber-600'}`}>
                  Please check this box to proceed with your redemption
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between p-6 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/20 border-t">
          <Button 
            variant="outline" 
            onClick={handlePreviousStep}
            className="border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
          >
            {step > 1 ? "Previous" : "Cancel"}
          </Button>
          
          {step < 3 ? (
            <Button 
              onClick={handleNextStep}
              disabled={
                (step === 1 && !selectedPartner) || 
                (step === 2 && (pointsToRedeem < item.pointsCost || pointsToRedeem > availablePoints))
              }
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all min-w-[120px]"
            >
              Continue
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={!agreementChecked || isSubmitting || pointsToRedeem > availablePoints}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all min-w-[150px]"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processing
                </>
              ) : (
                "Convert Points"
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default RedemptionFlow;
