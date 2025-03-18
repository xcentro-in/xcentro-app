
import React from "react";
import { BarChart2, CreditCard, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { mockCreditCardBills } from "@/data/mockCreditCardBills";

const QuickCreditCardInsightsPanel = () => {
  // Identify the card with highest spending
  const sortedBills = [...mockCreditCardBills].sort((a, b) => b.totalDueAmount - a.totalDueAmount);
  const topCards = sortedBills.slice(0, 3);
  
  // Find cards with high fees or high utilization (would be dynamic in a real app)
  const cardsWithHighFees = [sortedBills[0]]; // Pretend this card has high fees
  const cardsWithHighUtilization = [sortedBills[1]]; // Pretend this card has high utilization
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <BarChart2 className="h-5 w-5 mr-2 text-primary" />
          Quick Credit Card Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Top Cards by Spending</h4>
          <div className="space-y-2">
            {topCards.map((card, index) => (
              <div key={card.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                    {index + 1}
                  </span>
                  <span>{card.cardIssuer} •••• {card.lastFourDigits}</span>
                </div>
                <span className="font-medium">
                  ₹{card.totalDueAmount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {cardsWithHighFees.length > 0 && (
          <div className="bg-red-50 dark:bg-red-950/30 p-3 rounded-md border border-red-100 dark:border-red-900">
            <div className="flex gap-2 text-red-700 dark:text-red-400">
              <div className="flex-shrink-0">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">{cardsWithHighFees[0].cardIssuer} card has excessive late fees</p>
                <p className="text-sm mt-1">Consider setting up auto-payment to avoid future charges.</p>
              </div>
            </div>
          </div>
        )}
        
        {cardsWithHighUtilization.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-md border border-amber-100 dark:border-amber-900">
            <div className="flex gap-2 text-amber-700 dark:text-amber-400">
              <div className="flex-shrink-0">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">{cardsWithHighUtilization[0].cardIssuer} card is above 80% utilization</p>
                <p className="text-sm mt-1">High utilization may impact your business credit score.</p>
              </div>
            </div>
          </div>
        )}
        
        <Button asChild variant="outline" className="w-full">
          <Link to="/credit-card-analytics" className="flex items-center justify-center gap-1">
            <BarChart2 className="h-4 w-4" />
            View Full Analytics
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickCreditCardInsightsPanel;
