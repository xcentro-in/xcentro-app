
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Grid2X2, List, Upload, CreditCard, BarChart2, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { mockCreditCardBills } from "@/data/mockCreditCardBills";
import { CreditCardBill } from "@/types/credit-card-bill";
import BillCard from "@/components/credit-card-bills/BillCard";
import BillTable from "@/components/credit-card-bills/BillTable";
import UploadBillSection from "@/components/credit-card-bills/UploadBillSection";
import QuickPaySection from "@/components/credit-card-bills/QuickPaySection";
import BillPaymentDialog from "@/components/credit-card-bills/BillPaymentDialog";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Simple component for the collapsible insights panel
const QuickInsightsPanel = () => {
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

export default function CreditCardBills() {
  const [bills, setBills] = useState<CreditCardBill[]>(mockCreditCardBills);
  const [showUploadBill, setShowUploadBill] = useState(false);
  const [showQuickPay, setShowQuickPay] = useState(false);
  const [view, setView] = useState<"grid" | "table">("grid");
  const [selectedBill, setSelectedBill] = useState<CreditCardBill | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [showInsights, setShowInsights] = useState(true);
  
  const handleUploadSuccess = () => {
    setShowUploadBill(false);
    toast.success("Bill uploaded and processed successfully", {
      description: "The bill details have been extracted and added to your account."
    });
    
    // In a real app, this would add the new bill to the list
  };
  
  const handlePaymentSuccess = () => {
    toast.success("Payment completed successfully", {
      description: "Your credit card bill payment has been processed."
    });
    
    // Update the paid bill's status
    if (selectedBill) {
      setBills(prevBills => 
        prevBills.map(bill => 
          bill.id === selectedBill.id 
            ? { ...bill, status: "paid" as const, isPaid: true } 
            : bill
        )
      );
    }
  };
  
  const handlePayClick = (bill: CreditCardBill) => {
    setSelectedBill(bill);
    setPaymentDialogOpen(true);
  };
  
  const handleQuickPaySuccess = () => {
    setShowQuickPay(false);
    toast.success("Quick payment completed successfully", {
      description: "Your credit card bill payment has been processed."
    });
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight animate-slide-up">Credit Card Bills</h1>
        <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: "50ms" }}>
          Manage and pay your credit card bills
        </p>
      </div>
      
      {!showUploadBill && !showQuickPay ? (
        <>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                className="flex items-center gap-2" 
                onClick={() => setShowUploadBill(true)}
              >
                <Upload className="h-4 w-4" /> Upload Bill
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setShowQuickPay(true)}
              >
                <CreditCard className="h-4 w-4" /> Quick Pay
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                asChild
              >
                <Link to="/credit-card-analytics">
                  <BarChart2 className="h-4 w-4" /> View Analytics
                </Link>
              </Button>
            </div>
            
            <div className="flex gap-2 self-end sm:self-auto">
              <Button
                variant="outline"
                size="icon"
                className={view === "grid" ? "bg-muted" : ""}
                onClick={() => setView("grid")}
                aria-label="Grid view"
              >
                <Grid2X2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={view === "table" ? "bg-muted" : ""}
                onClick={() => setView("table")}
                aria-label="Table view"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Collapsible
            open={showInsights}
            onOpenChange={setShowInsights}
            className="w-full"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Card Insights</h3>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {showInsights ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <QuickInsightsPanel />
            </CollapsibleContent>
          </Collapsible>
          
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Bills</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
            </TabsList>
            
            {["all", "pending", "paid", "overdue"].map((tabValue) => (
              <TabsContent key={tabValue} value={tabValue} className="mt-6">
                {view === "grid" ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {bills
                      .filter(bill => tabValue === "all" || bill.status === tabValue)
                      .map(bill => (
                        <BillCard 
                          key={bill.id} 
                          bill={bill} 
                          onPayClick={handlePayClick} 
                        />
                      ))}
                  </div>
                ) : (
                  <BillTable 
                    bills={bills.filter(bill => tabValue === "all" || bill.status === tabValue)} 
                    onPayClick={handlePayClick} 
                  />
                )}
                
                {bills.filter(bill => tabValue === "all" || bill.status === tabValue).length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No {tabValue} bills found</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
          
          <BillPaymentDialog 
            bill={selectedBill} 
            open={paymentDialogOpen} 
            onOpenChange={setPaymentDialogOpen}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </>
      ) : showUploadBill ? (
        <UploadBillSection onUploadSuccess={handleUploadSuccess} />
      ) : (
        <QuickPaySection onPaymentSuccess={handleQuickPaySuccess} />
      )}
      
      {(showUploadBill || showQuickPay) && (
        <div className="flex justify-start">
          <Button 
            variant="outline" 
            onClick={() => {
              setShowUploadBill(false);
              setShowQuickPay(false);
            }}
          >
            Back to All Bills
          </Button>
        </div>
      )}
    </div>
  );
}
