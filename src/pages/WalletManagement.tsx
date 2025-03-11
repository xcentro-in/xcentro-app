
import { useState } from "react";
import { Plus, CreditCard, BanknoteIcon, IndianRupee, PhoneIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PaymentMethodCard from "@/components/wallet/PaymentMethodCard";
import AddPaymentMethodForm from "@/components/wallet/AddPaymentMethodForm";
import { mockPaymentMethods } from "@/data/mockPaymentMethods";
import { PaymentMethod, PaymentMethodType } from "@/types/payment-method";
import { toast } from "sonner";

const WalletManagement = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [activeTab, setActiveTab] = useState<PaymentMethodType | "all">("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  
  const filteredPaymentMethods = activeTab === "all" 
    ? paymentMethods 
    : paymentMethods.filter(method => method.type === activeTab);
  
  const handleDelete = (id: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
    toast.success("Payment method removed successfully");
  };
  
  const handleSetDefault = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === id ? true : method.type === prev.find(m => m.id === id)?.type ? false : method.isDefault
      }))
    );
  };
  
  const handleEdit = (id: string) => {
    toast.info("Edit functionality will be implemented in a future update");
  };
  
  const handleToggleRecurring = (id: string, enabled: boolean) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        enabledForRecurring: method.id === id ? enabled : method.enabledForRecurring
      }))
    );
  };
  
  const handlePaymentMethodAdded = () => {
    setAddDialogOpen(false);
    // In a real app, this would update the payment methods from the backend
  };
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight animate-slide-up">Wallet & Payment Sources</h1>
          <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: "50ms" }}>
            Manage your business payment methods in one place
          </p>
        </div>
        
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 animate-slide-down" style={{ animationDelay: "100ms" }}>
              <Plus className="h-4 w-4" />
              Add New Payment Method
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Payment Method</DialogTitle>
              <DialogDescription>
                Add a new payment source to use for your business transactions.
              </DialogDescription>
            </DialogHeader>
            <AddPaymentMethodForm onPaymentMethodAdded={handlePaymentMethodAdded} />
          </DialogContent>
        </Dialog>
      </div>
      
      <Card className="animate-scale-in">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Payment Methods</CardTitle>
          <CardDescription>
            Manage your cards, bank accounts, and other payment sources
          </CardDescription>
          
          <Tabs 
            defaultValue="all" 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as PaymentMethodType | "all")}
            className="mt-3"
          >
            <TabsList className="grid grid-cols-5 mb-2">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="card" className="flex items-center gap-1">
                <CreditCard className="h-3.5 w-3.5" />
                <span>Cards</span>
              </TabsTrigger>
              <TabsTrigger value="bank" className="flex items-center gap-1">
                <BanknoteIcon className="h-3.5 w-3.5" />
                <span>Bank</span>
              </TabsTrigger>
              <TabsTrigger value="bnpl" className="flex items-center gap-1">
                <IndianRupee className="h-3.5 w-3.5" />
                <span>BNPL</span>
              </TabsTrigger>
              <TabsTrigger value="upi" className="flex items-center gap-1">
                <PhoneIcon className="h-3.5 w-3.5" />
                <span>UPI</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent>
          {filteredPaymentMethods.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPaymentMethods.map(method => (
                <PaymentMethodCard 
                  key={method.id}
                  paymentMethod={method}
                  onDelete={handleDelete}
                  onSetDefault={handleSetDefault}
                  onEdit={handleEdit}
                  onToggleRecurring={handleToggleRecurring}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No payment methods found for this type.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setAddDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="border-t py-4 mt-4">
        <p className="text-sm text-muted-foreground">
          📌 <strong>Note:</strong> For security, card numbers are masked and CVV values are never stored. 
          All payment data is encrypted and stored in compliance with PCI DSS standards.
        </p>
      </div>
    </div>
  );
};

export default WalletManagement;
