
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, CreditCard, BanknoteIcon, IndianRupee, PhoneIcon, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PaymentMethodCard from "@/components/wallet/PaymentMethodCard";
import { mockPaymentMethods } from "@/data/mockPaymentMethods";
import { PaymentMethod, PaymentMethodType } from "@/types/payment-method";
import { toast } from "sonner";

const WalletManagement = () => {
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [activeTab, setActiveTab] = useState<PaymentMethodType>("card");
  
  const filteredPaymentMethods = paymentMethods.filter(method => method.type === activeTab);
  
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
  
  const handleToggleRecurring = (id: string, enabled: boolean) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        enabledForRecurring: method.id === id ? enabled : method.enabledForRecurring
      }))
    );
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight animate-slide-up">Wallet & Payment Sources</h1>
        <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: "50ms" }}>
          Manage your business payment methods in one place
        </p>
      </div>
      
      <Card className="animate-scale-in">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Payment Methods</CardTitle>
          <CardDescription>
            Manage your cards, bank accounts, and other payment sources
          </CardDescription>
          
          <Tabs 
            defaultValue="card" 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as PaymentMethodType)}
            className="mt-3"
          >
            <TabsList className="grid grid-cols-4 mb-2">
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
                  onToggleRecurring={handleToggleRecurring}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No payment methods found for this type.</p>
            </div>
          )}
          
          <div className="mt-4 flex justify-start">
            <Button 
              className="inline-flex items-center gap-2" 
              size="sm"
              onClick={() => navigate("/wallet/add")}
            >
              <Plus className="h-4 w-4" />
              Add Payment Method
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Alert className="bg-primary/5 border-primary/20 shadow-sm">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <AlertDescription className="flex items-center text-sm font-medium text-primary/90">
          <span>
            For security, card numbers are masked and CVV values are never stored. 
            All payment data is encrypted and stored in compliance with PCI DSS standards.
          </span>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default WalletManagement;
