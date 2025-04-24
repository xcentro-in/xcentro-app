
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Check, Gift, Shield } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/formatters";

export interface RewardPackage {
  id: string;
  name: string;
  label?: string;
  multiplier: number;
  percentage: number;
  description: string[];
  isPopular?: boolean;
}

export interface RewardTopUpProps {
  amount: number;
  onBack: () => void;
  onNext: (selectedPackage: RewardPackage | null) => void;
}

const defaultRewardPackages: RewardPackage[] = [
  {
    id: "basic",
    name: "Basic",
    multiplier: 1,
    percentage: 0.75,
    description: ["Standard Points"]
  },
  {
    id: "premium",
    name: "Premium",
    label: "Most Popular",
    multiplier: 2,
    percentage: 1.5,
    description: ["Double Points", "Priority Support"],
    isPopular: true
  },
  {
    id: "elite",
    name: "Elite",
    multiplier: 3,
    percentage: 2.25,
    description: ["Triple Points", "Concierge Services", "Early Access"]
  }
];

const RewardTopUpStep = ({ amount, onBack, onNext }: RewardTopUpProps) => {
  const [selectedPackage, setSelectedPackage] = useState<RewardPackage | null>(null);
  
  const basePoints = Math.floor(amount / 10); // Base 1 point per ₹10 spent
  
  const getPackageCost = (pkg: RewardPackage | null) => {
    if (!pkg) return 0;
    return amount * (pkg.percentage / 100);
  };
  
  const getTotalPoints = (pkg: RewardPackage | null) => {
    if (!pkg) return basePoints;
    return basePoints * pkg.multiplier;
  };
  
  const packageCost = getPackageCost(selectedPackage);
  const totalPoints = getTotalPoints(selectedPackage);
  const bonusPoints = selectedPackage ? (totalPoints - basePoints) : 0;
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Enhance Your Rewards</h2>
        <p className="text-muted-foreground">
          Add reward points to maximize benefits on your transactions
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {defaultRewardPackages.map((pkg) => {
          const isBasic = pkg.id === 'basic';
          const isPremium = pkg.id === 'premium';
          const isElite = pkg.id === 'elite';
          
          return (
            <Card 
              key={pkg.id}
              className={`cursor-pointer transition-all transform hover:scale-105 overflow-hidden ${
                selectedPackage?.id === pkg.id ? 'ring-2 ring-primary shadow-lg' : ''
              } relative`}
              style={{
                background: isBasic 
                  ? 'linear-gradient(145deg, #e6e6e6 0%, #ffffff 100%)'
                  : isPremium
                  ? 'linear-gradient(145deg, #ffd700 0%, #ffb347 100%)'
                  : 'linear-gradient(145deg, #1a2b4d 0%, #2c4c7c 100%)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              }}
              onClick={() => setSelectedPackage(pkg)}
            >
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <h3 className={`font-semibold text-lg tracking-wider ${
                  isElite ? 'text-white' : ''
                }`}>
                  {pkg.name.toUpperCase()}
                </h3>
                
                <div className={`text-4xl font-bold ${isElite ? 'text-white' : ''}`}>
                  {pkg.id === 'basic' ? '5,000' : pkg.id === 'premium' ? '10,000' : '25,000'}
                </div>
                
                <div className={`text-sm ${isElite ? 'text-white/80' : 'text-muted-foreground'}`}>
                  Cost: {pkg.id === 'basic' ? '10,000' : pkg.id === 'premium' ? '20,000' : '50,000'} pts
                </div>
                
                <div className="flex items-center justify-center h-12">
                  {isBasic ? (
                    <Check className={`h-6 w-6 ${isElite ? 'text-white' : ''}`} />
                  ) : isPremium ? (
                    <Gift className="h-6 w-6" />
                  ) : (
                    <Shield className="h-6 w-6 text-white" />
                  )}
                </div>
                
                <div className={`text-sm font-medium ${isElite ? 'text-white' : ''}`}>
                  {pkg.id === 'basic' ? 'Standard perks' : pkg.id === 'premium' ? 'Premium perks' : 'All perks'}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <Card className="bg-muted/30">
        <CardContent className="p-4 space-y-3">
          <h3 className="font-medium">Transaction Summary</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Transaction Amount:</span>
              <span>{formatCurrency(amount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Selected Reward Package {selectedPackage ? `(${selectedPackage.name} ${selectedPackage.percentage}%)` : ''}:</span>
              <span>{formatCurrency(packageCost)}</span>
            </div>
            <Separator className="my-1" />
            <div className="flex justify-between font-medium">
              <span>Total Payable:</span>
              <span>{formatCurrency(amount + packageCost)}</span>
            </div>
            <div className="flex justify-between text-sm text-primary font-medium">
              <span>Total Rewards Earned:</span>
              <span>
                {totalPoints.toLocaleString()} points
                {bonusPoints > 0 && (
                  <span className="text-green-500 ml-1">(+{bonusPoints} bonus points)</span>
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={() => onNext(selectedPackage)}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default RewardTopUpStep;
