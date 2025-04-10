
import React from "react";
import { Calendar, CreditCard, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface PaydaySimulationCardProps {
  payDate: number;
  onPayDateChange: (newDate: number) => void;
}

const PaydaySimulationCard: React.FC<PaydaySimulationCardProps> = ({
  payDate,
  onPayDateChange
}) => {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Payday Simulation Tool</CardTitle>
        <CardDescription>
          Adjust your payment date to see impact on cash flow
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Earlier</span>
            <span>Current: Day {payDate}</span>
            <span>Later</span>
          </div>
          <Slider
            value={[payDate]}
            min={1}
            max={31}
            step={1}
            onValueChange={(value) => onPayDateChange(value[0])}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Cash Flow Impact</span>
            </div>
            <p className="text-sm">
              {payDate < 25 ? 
                "Moving payday earlier increases cash flow pressure." : 
                payDate > 25 ? 
                  "Moving payday later improves immediate cash flow." :
                  "Current payday is optimal for your cash flow."
              }
            </p>
          </div>
          
          <div className="bg-muted p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Card Billing Impact</span>
            </div>
            <p className="text-sm">
              {payDate < 20 ? 
                "Falls in current billing cycle." : 
                payDate > 20 ? 
                  "Falls in next billing cycle, giving 25+ days float." :
                  "Current payday aligns with billing cycle."
              }
            </p>
          </div>
          
          <div className="bg-muted p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Rewards Optimization</span>
            </div>
            <p className="text-sm">
              {payDate < 15 ? 
                "Suboptimal for maximizing quarterly rewards." : 
                payDate > 25 ? 
                  "Optimal timing for quarterly reward calculation." :
                  "Good balance for reward accumulation."
              }
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" disabled={payDate === 25}>
          Apply New Payment Date
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaydaySimulationCard;
