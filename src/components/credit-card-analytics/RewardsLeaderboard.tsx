
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency } from "./utils/chartUtils";

interface RewardsLeaderboardProps {
  data: Array<{
    name: string;
    value: number;
    fill: string;
  }>;
}

export const RewardsLeaderboard: React.FC<RewardsLeaderboardProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Rewards Earned Per Card</CardTitle>
        <CardDescription>Cards ranked by total rewards earned</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((card, index) => (
            <div key={card.name} className="flex items-center gap-4">
              <div className="flex-shrink-0 w-8 text-center font-bold">
                #{index + 1}
              </div>
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" 
                style={{ backgroundColor: card.fill }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
              </div>
              <div className="flex-grow">
                <div className="text-sm font-medium">{card.name}</div>
                <div className="w-full bg-muted rounded-full h-2.5 mt-1">
                  <div 
                    className="h-2.5 rounded-full" 
                    style={{ 
                      width: `${(card.value / data[0].value) * 100}%`,
                      backgroundColor: card.fill
                    }}
                  ></div>
                </div>
              </div>
              <div className="text-right font-semibold">
                {formatCurrency(card.value)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
