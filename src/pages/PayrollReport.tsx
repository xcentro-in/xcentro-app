
import { ArrowLeft, Calendar, ChevronRight, CreditCard, Info } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const PayrollReport = () => {
  const navigate = useNavigate();
  const [paymentDate, setPaymentDate] = useState<Date>(new Date(2023, 3, 25)); // April 25, 2023
  
  // Simulate payment date change (would connect to real data in production)
  const handlePaymentDateChange = (days: number) => {
    const newDate = new Date(paymentDate);
    newDate.setDate(newDate.getDate() + days);
    setPaymentDate(newDate);
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Button 
            variant="ghost"
            size="sm"
            className="mb-2 pl-0 hover:bg-transparent"
            onClick={() => navigate("/insights")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Insights
          </Button>
          <h1 className="text-2xl font-bold">Payroll Report</h1>
          <p className="text-muted-foreground">Optimize your salary payments and cash flow</p>
        </div>
      </div>
      
      {/* 1. Upcoming Salary Commitment */}
      <Card className="bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border-purple-100">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-muted-foreground mb-1">Upcoming Salary Commitment</h2>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-primary">₹3,80,000</span>
                <span className="ml-2 text-red-500 font-medium">Due in 6 days</span>
              </div>
            </div>
            <Button 
              size="sm" 
              className="mt-4 md:mt-0"
            >
              Disburse Salary
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* 2. Projected Cash Flow vs Salary Obligation */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <h2 className="text-lg font-medium">Cash Flow vs Salary Obligation</h2>
            
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Incoming before payroll</span>
                <span className="font-medium">₹1,50,000</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total payroll obligation</span>
                <span className="font-medium">₹3,80,000</span>
              </div>
              
              <Separator className="my-2" />
              
              <div className="flex justify-between items-center">
                <span className="font-medium text-red-500">Shortfall</span>
                <span className="font-medium text-red-500">₹2,30,000</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Cash Position</span>
                <span>₹1,50,000 / ₹3,80,000</span>
              </div>
              <Progress value={39} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 3. Smart Payment Suggestion */}
      <Card className="bg-amber-50 border-amber-100">
        <CardContent className="p-6">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-amber-500 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium mb-1">Smart Payment Suggestion</h3>
              <p className="text-muted-foreground">Consider paying <span className="font-medium">₹1,50,000 via credit card</span> and the rest via bank to smooth cash outflows.</p>
              <div className="mt-4 flex space-x-3">
                <Button size="sm" variant="outline" className="flex items-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay with Card
                </Button>
                <Button size="sm" variant="outline" className="flex items-center">
                  Schedule Payment
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 4. Salary Payment Timeliness (Risk Alert) */}
      <Card className="border-red-100">
        <CardContent className="p-6">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
            <div className="space-y-3 w-full">
              <div>
                <h3 className="font-medium">Salary Payment Timeliness</h3>
                <p className="text-red-500">You paid 2 days late last month. Consider using auto-scheduled card payments.</p>
              </div>
              
              <div className="bg-muted p-4 rounded-md">
                <div className="flex justify-between text-sm mb-2">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                </div>
                <div className="relative h-8 bg-muted-foreground/10 rounded-md">
                  <div className="absolute top-0 left-[10%] h-full w-[5%] bg-green-500 rounded-md"></div>
                  <div className="absolute top-0 left-[30%] h-full w-[5%] bg-green-500 rounded-md"></div>
                  <div className="absolute top-0 left-[50%] h-full w-[5%] bg-red-500 rounded-md"></div>
                  <div className="absolute top-0 left-[70%] h-full w-[5%] bg-amber-500 rounded-md"></div>
                  <div className="absolute bottom-full left-[10%] text-xs mb-1">On time</div>
                  <div className="absolute bottom-full left-[30%] text-xs mb-1">On time</div>
                  <div className="absolute bottom-full left-[50%] text-xs mb-1">2d late</div>
                  <div className="absolute bottom-full left-[70%] text-xs mb-1">Due</div>
                </div>
              </div>
              
              <Button size="sm" variant="outline" className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Auto-payment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 5. Payday Simulation Tool */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-medium mb-4">Payday Simulation Tool</h2>
          <p className="text-muted-foreground mb-6">Drag to change payment date → See impact on cash flow / card billing cycle / rewards earned</p>
          
          <div className="space-y-4">
            <div className="relative">
              <div className="h-10 bg-muted rounded-md relative">
                <div 
                  className="absolute top-0 h-full w-5 bg-primary rounded-md cursor-pointer"
                  style={{ left: `40%` }}
                ></div>
                <div className="absolute -bottom-6 w-full flex justify-between text-xs text-muted-foreground">
                  <span>Apr 15</span>
                  <span>Apr 30</span>
                  <span>May 15</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mt-8">
              <div className="md:w-1/3 p-4 bg-muted rounded-md">
                <h4 className="font-medium">Cash Flow Impact</h4>
                <p className="text-green-500">+₹85,000 in buffer</p>
              </div>
              
              <div className="md:w-1/3 p-4 bg-muted rounded-md">
                <h4 className="font-medium">Card Billing Impact</h4>
                <p className="text-amber-500">Falls in next cycle (May 15)</p>
              </div>
              
              <div className="md:w-1/3 p-4 bg-muted rounded-md">
                <h4 className="font-medium">Rewards Potential</h4>
                <p className="font-medium">+1,900 reward points</p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button size="sm" className="mt-2">
                Apply Date Change
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollReport;
