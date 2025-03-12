
import React from "react";
import { ExternalLink, CreditCard, Gift, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RedemptionOptionsProps {
  onRedeemClick: () => void;
  onCategorySelect: (category: string | null) => void;
}

const RedemptionOptions: React.FC<RedemptionOptionsProps> = ({ onRedeemClick, onCategorySelect }) => {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Redemption Options</CardTitle>
        <CardDescription>
          Ways to use your reward points
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {[
          { title: "Travel Credits", points: "15,000", cashValue: "$150", icon: ExternalLink, category: "flights" },
          { title: "Statement Credit", points: "10,000", cashValue: "$100", icon: CreditCard, category: null },
          { title: "Gift Cards", points: "5,000", cashValue: "$50", icon: Gift, category: "gifts" },
        ].map((option) => (
          <div 
            key={option.title} 
            className="rounded-md border p-3 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer"
            onClick={() => {
              onRedeemClick();
              onCategorySelect(option.category);
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
          onClick={onRedeemClick}
        >
          <ExternalLink className="h-4 w-4" />
          View All Options
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RedemptionOptions;
