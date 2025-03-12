
import React from "react";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const EarningHistory: React.FC = () => {
  return (
    <Card className="animate-fade-in" style={{ animationDelay: "150ms" }}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Earning History</CardTitle>
        <CardDescription>
          Recent reward point transactions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border">
          <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 p-3 bg-muted/50">
            <div className="font-medium">Transaction</div>
            <div className="text-right font-medium">Points</div>
            <div className="text-right font-medium">Date</div>
          </div>
          
          <div className="divide-y">
            {[
              { vendor: "Office Supplies Co.", points: 250, date: "Today" },
              { vendor: "Cloud Services", points: 90, date: "Yesterday" },
              { vendor: "Marketing Agency", points: 600, date: "Aug 12" },
              { vendor: "IT Support", points: 130, date: "Aug 10" },
              { vendor: "Office Furniture", points: 475, date: "Aug 5" },
            ].map((transaction) => (
              <div 
                key={transaction.vendor}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-4 p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="font-medium truncate">{transaction.vendor}</div>
                <div className="text-right font-medium text-green-500">+{transaction.points}</div>
                <div className="text-right text-sm text-muted-foreground">{transaction.date}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="gap-1 mx-auto">
          View Complete History <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EarningHistory;
