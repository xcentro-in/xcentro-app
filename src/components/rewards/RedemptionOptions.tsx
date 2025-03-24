
import React from "react";
import { ExternalLink, CreditCard, Gift, Plane, Hotel, Ticket, Package, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface RedemptionOptionsProps {
  onRedeemClick: (category: string | null) => void;
  onCategorySelect: (category: string | null) => void;
}

const RedemptionOptions: React.FC<RedemptionOptionsProps> = ({ onRedeemClick, onCategorySelect }) => {
  return (
    <Card className="animate-fade-in overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 border-b">
        <CardTitle className="text-lg font-semibold">Premium Redemption Options</CardTitle>
        <CardDescription>
          Exclusive ways to use your reward points
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {[
          { title: "Flight Partners", points: "10,000", cashValue: "Premium travel", icon: Plane, category: "flights" },
          { title: "Hotel Partners", points: "8,000", cashValue: "Luxury stays", icon: Hotel, category: "hotels" },
          { title: "Gift Cards", points: "5,000", cashValue: "Premium rewards", icon: Gift, category: "gifts" },
        ].map((option) => (
          <HoverCard key={option.title}>
            <HoverCardTrigger asChild>
              <div 
                className="group rounded-md border p-4 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1 duration-300"
                onClick={() => {
                  onCategorySelect(option.category);
                  onRedeemClick(option.category);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <option.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-base">{option.title}</div>
                      <div className="text-sm text-muted-foreground">Starting from {option.points} points</div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-primary opacity-70 group-hover:opacity-100 transition-opacity group-hover:translate-x-1 duration-200" />
                </div>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 p-0 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 text-white">
                <h4 className="font-medium">{option.title}</h4>
                <p className="text-xs text-white/80">Premium rewards experience</p>
              </div>
              <div className="p-3">
                <p className="text-sm">Redeem your points for {option.cashValue.toLowerCase()} with our exclusive partners.</p>
                <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                  Starting from {option.points} points
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </CardContent>
      <CardFooter className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 border-t mt-2 py-4">
        <Button 
          variant="outline" 
          className="w-full gap-1.5 bg-white hover:bg-white/80 dark:bg-slate-800 dark:hover:bg-slate-700"
          onClick={() => onRedeemClick(null)}
        >
          <ExternalLink className="h-4 w-4" />
          View All Redemption Options
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RedemptionOptions;
