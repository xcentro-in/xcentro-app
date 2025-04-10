
import React from "react";
import { ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/formatters";

interface SmartPaymentSuggestionCardProps {
  cardPaymentSuggestion: number;
  bankPaymentSuggestion: number;
}

const SmartPaymentSuggestionCard: React.FC<SmartPaymentSuggestionCardProps> = ({
  cardPaymentSuggestion,
  bankPaymentSuggestion
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Smart Payment Suggestion</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm">Consider this optimized payment method split:</p>
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Credit Card</span>
            <span className="font-medium">{formatCurrency(cardPaymentSuggestion)}</span>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Bank Transfer</span>
            <span className="font-medium">{formatCurrency(bankPaymentSuggestion)}</span>
          </div>
        </div>
        <Button>
          Disburse Salary
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default SmartPaymentSuggestionCard;
