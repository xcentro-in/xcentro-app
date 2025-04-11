
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EarningHistoryItem {
  date: string;
  description: string;
  points: number;
  isPending?: boolean;
}

interface EarningHistoryProps {
  onViewHistoryClick?: () => void;  // Add the missing prop that was causing the TypeScript error
}

const recentEarnings: EarningHistoryItem[] = [
  {
    date: "Apr 6",
    description: "Flight booking via HDFC Regalia",
    points: 1200,
  },
  {
    date: "Apr 5",
    description: "Office supplies from Amazon Business",
    points: 450,
  },
  {
    date: "Apr 3",
    description: "QuickBooks subscription renewal",
    points: 180,
  },
  {
    date: "Apr 2",
    description: "Monthly GST payment",
    points: 950,
    isPending: true,
  },
  {
    date: "Mar 28",
    description: "Employee lunch reimbursement",
    points: 320,
  },
  {
    date: "Mar 25",
    description: "Azure cloud hosting services",
    points: 740,
  },
];

const EarningHistory: React.FC<EarningHistoryProps> = ({ onViewHistoryClick }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-md">Recent Points Earned</CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <ScrollArea className="h-[260px] pr-4">
          <div className="space-y-4">
            {recentEarnings.map((item, i) => (
              <div key={i} className="flex justify-between items-start pb-3 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                <div>
                  <div className="font-medium text-sm">{item.description}</div>
                  <div className="text-xs text-muted-foreground mt-1 flex items-center">
                    {item.date}
                    {item.isPending && (
                      <span className="ml-2 px-1.5 py-0.5 text-[10px] font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-sm">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-sm font-bold text-green-600 dark:text-green-500">
                  +{item.points.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full mt-4 text-muted-foreground hover:text-primary" 
          onClick={onViewHistoryClick}
        >
          View complete history
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default EarningHistory;
