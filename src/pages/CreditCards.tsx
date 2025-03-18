
import React from "react";
import { 
  CreditCard, 
  Receipt, 
  BarChart2,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function CreditCards() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight animate-slide-up">Credit Cards</h1>
        <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: "50ms" }}>
          Manage your credit cards, pay bills, and analyze your spending patterns
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Receipt className="h-5 w-5 mr-2 text-primary" />
              Card Bill Payment
            </CardTitle>
            <CardDescription>
              Pay your credit card bills, upload statements, and manage payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                <span>View and manage all your credit card bills</span>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                <span>Upload bills for OCR data extraction</span>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                <span>Quick pay option for immediate payments</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/credit-card-bills" className="flex items-center">
                View Card Bills
                <ChevronRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart2 className="h-5 w-5 mr-2 text-primary" />
              Card Insights & Analytics
            </CardTitle>
            <CardDescription>
              Analyze card spending patterns, fees, rewards, and utilization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                <span>Compare spending across different cards</span>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                <span>Track hidden fees and charges</span>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                <span>Get smart recommendations on card usage</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/credit-card-analytics" className="flex items-center">
                View Analytics
                <ChevronRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
