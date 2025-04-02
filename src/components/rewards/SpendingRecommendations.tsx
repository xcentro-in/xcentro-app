
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Calendar, Star, TrendingUp } from "lucide-react";

const SpendingRecommendations: React.FC = () => {
  return (
    <Card className="animate-fade-in" style={{ animationDelay: "200ms" }}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recommendations & Earning Tips</CardTitle>
        <CardDescription>
          Smart suggestions to maximize your rewards
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {[
          {
            title: "Pay GST with Credit Card",
            description: "Earn 3x points on all tax payments this month",
            benefit: "Earn 1,800+ points",
            badge: "Recommended",
            badgeColor: "primary",
            icon: CreditCard,
            action: "Schedule Now",
            url: "/new-payment",
            state: { paymentCategory: "gst", paymentMethod: "credit-card" }
          },
          {
            title: "Schedule Monthly Payroll",
            description: "Get 4% bonus points on payroll transactions",
            benefit: "Earn 3,200+ points/mo",
            badge: "Points Booster",
            badgeColor: "amber",
            icon: Calendar,
            action: "Set Up Now",
            url: "/new-payment",
            state: { paymentCategory: "payroll" }
          },
          {
            title: "Use Premium Vendor Program",
            description: "5x points with select premium vendors",
            benefit: "~2,000 extra points/month",
            badge: "Elite Member Offer",
            badgeColor: "green",
            icon: Star,
            action: "View Eligible Vendors",
            url: "/insights"
          },
        ].map((recommendation, index) => (
          <div key={recommendation.title} className="rounded-lg border p-4 hover:border-primary/30 hover:bg-primary/5 transition-all">
            <div className="flex justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-primary/10">
                  <recommendation.icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-medium text-base">{recommendation.title}</h3>
              </div>
              <Badge variant="outline" className={`bg-${recommendation.badgeColor}/10 border-${recommendation.badgeColor}/20 text-${recommendation.badgeColor} text-xs`}>
                {recommendation.badge}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{recommendation.description}</p>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                <TrendingUp className="h-3.5 w-3.5" />
                {recommendation.benefit}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 text-xs bg-white"
                onClick={() => window.location.href = recommendation.url}
              >
                {recommendation.action}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SpendingRecommendations;
