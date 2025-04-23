
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Check, BadgePercent, ArrowRight } from "lucide-react";
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
        {defaultRewardPackages.map((pkg) => (
          <Card 
            key={pkg.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedPackage?.id === pkg.id ? 'ring-2 ring-primary shadow-lg' : ''
            } ${pkg.isPopular ? 'shadow-md' : ''}`}
            onClick={() => setSelectedPackage(pkg)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{pkg.name}</h3>
                {selectedPackage?.id === pkg.id && (
                  <div className="bg-primary w-5 h-5 rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              
              {pkg.label && (
                <div className="bg-primary/10 text-primary text-xs rounded-full px-2 py-1 inline-block mb-2">
                  {pkg.label}
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <BadgePercent className="h-4 w-4 text-primary" />
                  <span className="font-medium">
                    {pkg.multiplier}X Points {pkg.multiplier > 1 ? pkg.multiplier === 2 ? '🔥' : '🚀' : ''}
                  </span>
                </div>
                <div className="text-sm">
                  {formatCurrency(amount * pkg.percentage / 100)} ({pkg.percentage}%)
                </div>
                <ul className="text-sm space-y-1">
                  {pkg.description.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
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
        <Button variant="outline" onClick={onBack} className="w-auto">
          Back
        </Button>
        <Button 
          onClick={() => onNext(selectedPackage)}
          className="w-auto"
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default RewardTopUpStep;
