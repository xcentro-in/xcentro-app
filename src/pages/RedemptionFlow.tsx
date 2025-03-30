import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { RedemptionCategory, RedemptionItem, LoyaltyPartner } from "@/types/rewards";
import { redemptionCategories } from "@/data/redemptionCategories";

const mockPartners: LoyaltyPartner[] = [
  {
    id: "emirates",
    name: "Emirates Skywards",
    type: "airline",
    conversionRatio: 0.5,
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
    conversionRatio: 0.3,
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
  
  const availablePoints = 24530;

  useEffect(() => {
    if (categoryId) {
      const foundCategory = redemptionCategories.find(cat => cat.id === categoryId);
      if (foundCategory) {
        setCategory(foundCategory);
        
        if (itemId) {
          const foundItem = foundCategory.items.find(item => item.id === itemId);
          if (foundItem) {
            setItem(foundItem);
            setPointsToRedeem(foundItem.pointsCost || foundCategory.pointsNeeded);
          }
        } else if (foundCategory.items.length > 0) {
          setItem(foundCategory.items[0]);
          setPointsToRedeem(foundCategory.items[0].pointsCost || foundCategory.pointsNeeded);
        }
      }
    }
  }, [categoryId, itemId]);
  
  useEffect(() => {
    if (category) {
      const relevantPartners = mockPartners.filter(partner => partner.category === category.id);
      if (relevantPartners.length > 0) {
        setPartners(relevantPartners);
        setSelectedPartner(relevantPartners[0]);
      }
    }
  }, [category]);
  
  const handlePartnerSelect = (partnerId: string) => {
    const partner = partners.find(p => p.id === partnerId);
    if (partner) {
      setSelectedPartner(partner);
      handleNextStep();
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

  return (
    <div className="space-y-8">
      <RedemptionHeader 
        title="Redeem Your Points" 
        description="Convert your PaySphere points to premium rewards" 
      />
      
      <ProgressSteps step={step} />
      
      <Card className="border-none shadow-md bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
        <CardContent className="space-y-6 p-6">
          {step === 1 && (
            <PartnerSelectionStep 
              partners={partners} 
              onPartnerSelect={handlePartnerSelect} 
            />
          )}
          
          {step === 2 && (
            <PointsRedemptionStep 
              selectedPartner={selectedPartner}
              item={item}
              availablePoints={availablePoints}
              pointsToRedeem={pointsToRedeem}
              onPointsChange={setPointsToRedeem}
            />
          )}
          
          {step === 3 && (
            <ConfirmationStep 
              selectedPartner={selectedPartner}
              pointsToRedeem={pointsToRedeem}
              availablePoints={availablePoints}
              agreementChecked={agreementChecked}
              onAgreementChange={setAgreementChecked}
            />
          )}
        </CardContent>
        
        <CardFooter>
          <FooterActions 
            step={step}
            isSubmitting={isSubmitting}
            agreementChecked={agreementChecked}
            pointsToRedeem={pointsToRedeem}
            availablePoints={availablePoints}
            item={item}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
            onSubmit={handleSubmit}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default RedemptionFlow;
