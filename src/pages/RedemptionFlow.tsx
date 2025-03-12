
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
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { RedemptionCategory, RedemptionItem, LoyaltyPartner } from "@/types/rewards";
import { redemptionCategories } from "@/data/redemptionCategories";

// Mock data for loyalty partners
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
  }
];

const RedemptionFlow: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId, itemId } = useParams<{ categoryId: string; itemId: string }>();
  const [step, setStep] = useState<number>(1);
  const [pointsToRedeem, setPointsToRedeem] = useState<number>(0);
  const [agreementChecked, setAgreementChecked] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [category, setCategory] = useState<RedemptionCategory | null>(null);
  const [item, setItem] = useState<RedemptionItem | null>(null);
  const [partners, setPartners] = useState<LoyaltyPartner[]>(mockPartners);
  const [selectedPartner, setSelectedPartner] = useState<LoyaltyPartner | null>(null);
  
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
        
        <h1 className="text-3xl font-bold tracking-tight animate-slide-up">Redeem Your Points</h1>
        <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: "50ms" }}>
          Convert your PaySphere points to premium rewards
        </p>
      </div>
      
      <div className="w-full mb-8">
        <div className="flex justify-between mb-2">
          {["Select Partner", "Choose Amount", "Confirm Redemption"].map((stepName, idx) => (
            <div 
              key={stepName} 
              className={`flex items-center ${idx + 1 === step ? "text-primary font-medium" : "text-muted-foreground"}`}
            >
              <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-2 
                ${idx + 1 === step ? "bg-primary text-white" : idx + 1 < step ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                {idx + 1 < step ? <Check className="h-4 w-4" /> : idx + 1}
              </div>
              <span className="hidden sm:inline">{stepName}</span>
            </div>
          ))}
        </div>
        <Progress value={(step / 3) * 100} className="h-2" />
      </div>
      
      <Card className="border-none shadow-md bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <CardHeader>
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
        
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-3">Select Your Loyalty Program</h3>
                <div className="space-y-3">
                  {partners.length > 0 ? (
                    partners.map(partner => (
                      <div 
                        key={partner.id} 
                        className={`p-4 rounded-md border cursor-pointer transition-all
                          ${selectedPartner?.id === partner.id ? 'border-primary bg-primary/5' : 'hover:border-primary/30 hover:bg-primary/5'}`}
                        onClick={() => handlePartnerSelect(partner.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-lg">
                              {partner.name.substring(0, 2)}
                            </div>
                            <div>
                              <div className="font-medium">{partner.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {partner.membershipDetails?.membershipNumber || "No membership number"}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            1 PaySphere Point = {partner.conversionRatio} {partner.name} Points
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-8 border border-dashed rounded-md">
                      <p className="text-muted-foreground mb-2">No linked loyalty programs found</p>
                      <Button onClick={() => navigate("/settings")}>
                        Set Up Partners in Settings
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              {selectedPartner && (
                <div className="p-4 bg-primary/5 rounded-md">
                  <h4 className="font-medium mb-2">Your {selectedPartner.name} Details</h4>
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
                      <p className="font-medium">1:${selectedPartner.conversionRatio}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-3">Choose Points to Convert</h3>
                <div className="bg-primary/5 p-4 rounded-md mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Your Available Points</span>
                    <span className="font-medium">{availablePoints.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Minimum Required</span>
                    <span className="font-medium">{item.pointsCost.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="pointsToRedeem">Points to Redeem</Label>
                    <div className="flex items-center mt-1.5 space-x-2">
                      <Input 
                        id="pointsToRedeem" 
                        type="number" 
                        value={pointsToRedeem}
                        onChange={handlePointsChange}
                        min={item.pointsCost}
                        max={availablePoints}
                        className="text-right"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => setPointsToRedeem(availablePoints)}
                      >
                        Max
                      </Button>
                    </div>
                    {pointsToRedeem > availablePoints && (
                      <p className="text-destructive text-sm mt-1">
                        You don't have enough points
                      </p>
                    )}
                  </div>
                  
                  <div className="p-4 bg-primary/5 rounded-md">
                    <h4 className="font-medium mb-3">Conversion Preview</h4>
                    <div className="flex items-center justify-center space-x-6 p-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold">{pointsToRedeem.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">PaySphere Points</div>
                      </div>
                      <div className="text-primary">
                        <ArrowRight className="h-6 w-6" />
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold">{getConvertedPoints().toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{selectedPartner?.name} Points</div>
                      </div>
                    </div>
                    <div className="text-center text-sm text-muted-foreground mt-2">
                      Conversion Rate: 1 PaySphere Point = {selectedPartner?.conversionRatio} {selectedPartner?.name} Points
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-5">
              <h3 className="font-medium mb-3">Confirm Your Redemption</h3>
              
              <div className="rounded-md border p-4 space-y-4">
                <div className="flex justify-between pb-2 border-b">
                  <span className="text-muted-foreground">Selected Partner</span>
                  <span className="font-medium">{selectedPartner?.name}</span>
                </div>
                <div className="flex justify-between pb-2 border-b">
                  <span className="text-muted-foreground">Membership Number</span>
                  <span className="font-medium">{selectedPartner?.membershipDetails?.membershipNumber}</span>
                </div>
                <div className="flex justify-between pb-2 border-b">
                  <span className="text-muted-foreground">Points to Redeem</span>
                  <span className="font-medium">{pointsToRedeem.toLocaleString()} PaySphere Points</span>
                </div>
                <div className="flex justify-between pb-2 border-b">
                  <span className="text-muted-foreground">You'll Receive</span>
                  <span className="font-medium">{getConvertedPoints().toLocaleString()} {selectedPartner?.name} Points</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Remaining Balance</span>
                  <span className="font-medium">{(availablePoints - pointsToRedeem).toLocaleString()} PaySphere Points</span>
                </div>
              </div>
              
              <div className="pt-2">
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox 
                    id="terms" 
                    checked={agreementChecked}
                    onCheckedChange={(checked) => setAgreementChecked(checked as boolean)}
                  />
                  <label 
                    htmlFor="terms" 
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I understand that this conversion is final and cannot be reversed. Points will be 
                    transferred to my loyalty account within 3-5 business days.
                  </label>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePreviousStep}
          >
            {step > 1 ? "Previous" : "Cancel"}
          </Button>
          
          {step < 3 ? (
            <Button 
              onClick={handleNextStep}
              disabled={step === 1 && !selectedPartner || step === 2 && (pointsToRedeem < item.pointsCost || pointsToRedeem > availablePoints)}
            >
              Continue
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={!agreementChecked || isSubmitting || pointsToRedeem > availablePoints}
              className="min-w-[120px]"
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
