
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SpendingRecommendations: React.FC = () => {
  return (
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
        ].map((recommendation) => (
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
  );
};

export default SpendingRecommendations;
