
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Grid2X2, List, Upload, CreditCard, BarChart2 } from "lucide-react";
import { mockCreditCardBills } from "@/data/mockCreditCardBills";
import { CreditCardBill } from "@/types/credit-card-bill";
import BillCard from "@/components/credit-card-bills/BillCard";
import BillTable from "@/components/credit-card-bills/BillTable";
import UploadBillSection from "@/components/credit-card-bills/UploadBillSection";
import QuickPaySection from "@/components/credit-card-bills/QuickPaySection";
import BillPaymentDialog from "@/components/credit-card-bills/BillPaymentDialog";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

export default function CreditCardBills() {
  const navigate = useNavigate();
  const [bills, setBills] = useState<CreditCardBill[]>(mockCreditCardBills);
  const [showUploadBill, setShowUploadBill] = useState(false);
  const [showQuickPay, setShowQuickPay] = useState(false);
  const [view, setView] = useState<"grid" | "table">("grid");
  const [selectedBill, setSelectedBill] = useState<CreditCardBill | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  
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

  const handleGoToQuickPay = () => {
    // Navigate to the payment page with state indicating we want credit card quick pay
    navigate("/new-payment", { 
      state: { 
        paymentCategory: "creditcard",
        paymentMethod: "quick" 
      } 
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
                onClick={handleGoToQuickPay}
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
