import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, CreditCard, Building2, ShieldCheck, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockPaymentMethods } from "@/data/mockPaymentMethods";
import { PaymentMethod } from "@/types/payment-method";
import { toast } from "sonner";

const WalletManagement = () => {
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  
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

  const getUsageLevel = (methodId: string) => {
    // Mock usage data - in real app this would come from API
    const usageData: Record<string, { level: 'high' | 'medium' | 'low'; transactions: number; amount: string; lastUsed: string }> = {
      "1": { level: 'high', transactions: 47, amount: '₹1.2L', lastUsed: '2 hours ago' },
      "2": { level: 'medium', transactions: 12, amount: '₹45K', lastUsed: 'yesterday' },
      "3": { level: 'medium', transactions: 23, amount: '₹89K', lastUsed: 'today' },
      "4": { level: 'low', transactions: 5, amount: '₹25K', lastUsed: '5 days ago' },
      "5": { level: 'low', transactions: 8, amount: '₹35K', lastUsed: '3 days ago' },
    };
    return usageData[methodId] || { level: 'low', transactions: 0, amount: '₹0', lastUsed: 'never' };
  };

  const getCardNetworkIcon = (cardType: string) => {
    switch (cardType.toLowerCase()) {
      case "visa":
        return "/lovable-uploads/b9b4153b-9e1f-4d42-bf1a-d9542c830869.png";
      case "mastercard":
        return "/lovable-uploads/d410a8cf-777f-48c4-8430-bea8af7a96cc.png";
      case "amex":
        return "/lovable-uploads/e5fb902c-794e-4682-8d5a-8acf5a9e0c0d.png";
      default:
        return null;
    }
  };

  const cardMethods = paymentMethods.filter(method => method.type === 'card');
  const bankMethods = paymentMethods.filter(method => method.type === 'bank');

  const renderPaymentMethodCard = (method: PaymentMethod) => {
    const usage = getUsageLevel(method.id);
    
    return (
      <div 
        key={method.id}
        className="flex items-center p-5 hover:bg-slate-50/50 transition-all duration-300 cursor-pointer group border-b border-slate-100 last:border-b-0"
      >
        {/* Icon */}
        <div className="w-12 h-8 rounded-lg flex items-center justify-center mr-5 flex-shrink-0">
          {method.type === 'card' && getCardNetworkIcon(method.cardType) ? (
            <img 
              src={getCardNetworkIcon(method.cardType)} 
              alt={method.cardType}
              className="h-6 w-auto object-contain"
            />
          ) : (
            <div className={`w-12 h-8 rounded-lg flex items-center justify-center ${
              method.type === 'card' 
                ? 'bg-gradient-to-br from-slate-600 to-slate-700'
                : 'bg-gradient-to-br from-emerald-600 to-emerald-700'
            }`}>
              <span className="text-white text-xs font-medium">
                {method.type === 'card' ? method.cardType.toUpperCase().slice(0, 4)
                 : method.type === 'bank' ? (method.bankName?.slice(0, 4).toUpperCase() || 'BANK')
                 : 'BANK'}
              </span>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-base text-slate-900">
                {method.type === 'card' ? method.cardholderName 
                 : method.type === 'bank' ? method.bankName 
                 : 'Bank Account'}
              </h3>
              {method.isDefault && (
                <Badge className="bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs px-2 py-0.5">
                  Primary
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${
                usage.level === 'high' ? 'bg-green-500' 
                : usage.level === 'medium' ? 'bg-amber-500' 
                : 'bg-slate-400'
              }`}></div>
              <span className={`text-xs font-medium uppercase tracking-wide ${
                usage.level === 'high' ? 'text-green-600' 
                : usage.level === 'medium' ? 'text-amber-600' 
                : 'text-slate-500'
              }`}>
                {usage.level === 'high' ? 'High Use' : usage.level === 'medium' ? 'Regular' : 'Occasional'}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-sm text-slate-600">
              {method.type === 'card' ? `•••• •••• •••• ${method.lastFourDigits}` 
               : method.type === 'bank' ? `Account ending ${method.lastFourDigits}`
               : 'Bank Account'}
            </span>
            {method.type === 'card' && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs px-2 py-0.5">
                Credit
              </Badge>
            )}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-5 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Used {usage.lastUsed}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 ml-6">
          <div className="text-center">
            <div className="text-lg font-semibold text-slate-900">{usage.transactions}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider">Uses</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-slate-900">{usage.amount}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider">Amount</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Sources</h1>
          <p className="text-muted-foreground mt-1">Manage your business payment methods</p>
        </div>
        
        <Button 
          className="gap-2" 
          onClick={() => navigate("/wallet/add")}
        >
          <Plus className="h-4 w-4" />
          Add New Payment Method
        </Button>
      </div>

      {/* Payment Methods Tabs */}
      <Card className="animate-scale-in overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="cards" className="w-full">
            <div className="px-6 pb-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="cards" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Cards ({cardMethods.length})
                </TabsTrigger>
                <TabsTrigger value="banks" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Banks ({bankMethods.length})
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="cards" className="mt-0">
              {cardMethods.length > 0 ? (
                <div className="space-y-0">
                  {cardMethods.map((method) => renderPaymentMethodCard(method))}
                </div>
              ) : (
                <div className="text-center py-12 px-6">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No cards added</h3>
                  <p className="text-muted-foreground mb-4">Add your first credit or debit card to get started</p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/wallet/add")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Card
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="banks" className="mt-0">
              {bankMethods.length > 0 ? (
                <div className="space-y-0">
                  {bankMethods.map((method) => renderPaymentMethodCard(method))}
                </div>
              ) : (
                <div className="text-center py-12 px-6">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No bank accounts added</h3>
                  <p className="text-muted-foreground mb-4">Add your bank account for direct transfers</p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/wallet/add")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Bank Account
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Security Notice */}
      <Alert className="bg-primary/5 border-primary/20 shadow-sm animate-fade-in">
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