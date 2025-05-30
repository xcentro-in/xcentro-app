
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, CreditCard, BanknoteIcon, IndianRupee, PhoneIcon, ShieldCheck, Clock, Star, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import PaymentMethodCard from "@/components/wallet/PaymentMethodCard";
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

  return (
    <div className="space-y-0">
      {/* Header Section with Stats */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-8 mb-8 relative overflow-hidden animate-fade-in">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="relative z-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Payment Sources</h1>
            <p className="text-slate-300 text-lg">Manage and optimize your business payments</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center md:text-left">
              <div className="text-2xl font-bold mb-1">₹2.4L</div>
              <div className="text-slate-300 text-sm font-medium">Monthly spend</div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-2xl font-bold mb-1">127</div>
              <div className="text-slate-300 text-sm font-medium">Transactions</div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-2xl font-bold mb-1">4.2K</div>
              <div className="text-slate-300 text-sm font-medium">Points earned</div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods Section */}
      <Card className="animate-scale-in overflow-hidden">
        <div className="p-6 border-b bg-slate-50/50">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold">Payment Methods</h2>
              <p className="text-muted-foreground mt-1">
                Manage your cards, bank accounts, and other payment sources
              </p>
            </div>
            
            <Button 
              className="gap-2" 
              onClick={() => navigate("/wallet/add")}
            >
              <Plus className="h-4 w-4" />
              Add New Payment Method
            </Button>
          </div>
        </div>
        
        <div className="p-0">
          {paymentMethods.length > 0 ? (
            <div className="space-y-0">
              {paymentMethods.map((method, index) => {
                const usage = getUsageLevel(method.id);
                const isLast = index === paymentMethods.length - 1;
                
                return (
                  <div 
                    key={method.id}
                    className={`flex items-center p-5 hover:bg-slate-50/50 transition-all duration-300 cursor-pointer group ${
                      method.isDefault ? 'bg-blue-50/50 border-l-4 border-l-blue-500' : ''
                    } ${!isLast ? 'border-b border-slate-100' : ''}`}
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
                            : method.type === 'bank' ? 'bg-gradient-to-br from-emerald-600 to-emerald-700'
                            : method.type === 'bnpl' ? 'bg-gradient-to-br from-purple-600 to-purple-700'
                            : 'bg-gradient-to-br from-indigo-600 to-indigo-700'
                        }`}>
                          <span className="text-white text-xs font-medium">
                            {method.type === 'card' ? method.cardType.toUpperCase().slice(0, 4)
                             : method.type === 'bank' ? (method.bankName?.slice(0, 4).toUpperCase() || 'BANK')
                             : method.type === 'bnpl' ? 'BNPL'
                             : 'UPI'}
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
                            {method.type === 'card' ? `${method.cardholderName}`
                             : method.type === 'bank' ? `${method.bankName}`
                             : method.type === 'bnpl' ? method.provider
                             : method.upiId}
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
                           : method.type === 'bnpl' ? `Available: ₹${method.availableCredit.toLocaleString()}`
                           : method.linkedBank || 'UPI Payment'}
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
                        {method.type === 'card' && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            <span>2% cashback on utilities</span>
                            {method.isDefault && (
                              <Badge className="ml-1 bg-amber-100 text-amber-700 text-xs px-1 py-0">
                                Best Rate
                              </Badge>
                            )}
                          </div>
                        )}
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
                      <div className="text-center">
                        <div className="text-lg font-semibold text-slate-900">
                          {method.type === 'card' ? '2.1K' : '₹0'}
                        </div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider">
                          {method.type === 'card' ? 'Points' : 'Fees'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No payment methods found.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate("/wallet/add")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Smart Recommendations */}
      <Card className="animate-fade-in bg-slate-50/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-2xl">💡</div>
            <h3 className="text-lg font-semibold text-slate-900">Smart Recommendations</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border-l-4 border-l-green-500 shadow-sm">
              <p className="text-sm text-slate-600 leading-relaxed">
                <span className="font-semibold text-slate-900">Optimize rewards:</span> Use HDFC for your next ₹15K utility payment to maximize 2% cashback earnings.
              </p>
            </div>
            
            <div className="bg-white p-5 rounded-xl border-l-4 border-l-amber-500 shadow-sm">
              <p className="text-sm text-slate-600 leading-relaxed">
                <span className="font-semibold text-slate-900">Statement reminder:</span> ICICI statement due in 5 days. Consider setting up auto-pay to avoid fees.
              </p>
            </div>
            
            <div className="bg-white p-5 rounded-xl border-l-4 border-l-blue-500 shadow-sm">
              <p className="text-sm text-slate-600 leading-relaxed">
                <span className="font-semibold text-slate-900">Cost efficiency:</span> Bank transfers save you ₹2,400/month in fees compared to credit card processing.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Payment Source */}
      <div 
        className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center transition-all duration-300 hover:border-blue-400 hover:bg-slate-50/50 cursor-pointer"
        onClick={() => navigate("/wallet/add")}
      >
        <Button 
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Payment Source
        </Button>
      </div>
      
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
