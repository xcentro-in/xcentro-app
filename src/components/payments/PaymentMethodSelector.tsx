
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, BanknoteIcon, IndianRupee, PhoneIcon, Check } from "lucide-react";
import { mockPaymentMethods } from "@/data/mockPaymentMethods";
import { PaymentMethod, PaymentMethodType } from "@/types/payment-method";
import { cn } from "@/lib/utils";

interface PaymentMethodSelectorProps {
  onSelect: (paymentMethodId: string) => void;
  selectedMethodId?: string;
  showOnlyCards?: boolean;
}

const PaymentMethodSelector = ({ 
  onSelect, 
  selectedMethodId,
  showOnlyCards = false 
}: PaymentMethodSelectorProps) => {
  const [activeTab, setActiveTab] = useState<PaymentMethodType>("card");
  
  const filteredMethods = mockPaymentMethods.filter(method => 
    showOnlyCards ? method.type === "card" : method.type === activeTab
  );
  
  const getMethodIcon = (type: PaymentMethodType) => {
    switch (type) {
      case "card":
        return <CreditCard className="h-5 w-5" />;
      case "bank":
        return <BanknoteIcon className="h-5 w-5" />;
      case "bnpl":
        return <IndianRupee className="h-5 w-5" />;
      case "upi":
        return <PhoneIcon className="h-5 w-5" />;
    }
  };
  
  const getMethodDetails = (method: PaymentMethod) => {
    switch (method.type) {
      case "card":
        return {
          title: `${method.cardType.toUpperCase()} •••• ${method.lastFourDigits}`,
          subtitle: `${method.cardholderName} | Exp: ${method.expiryDate}`,
          bgColor: "bg-primary/10",
          textColor: "text-primary"
        };
      case "bank":
        return {
          title: `${method.bankName} •••• ${method.lastFourDigits}`,
          subtitle: `${method.accountHolderName} | ${method.transactionType.toUpperCase()}`,
          bgColor: "bg-purple-500/10",
          textColor: "text-purple-500"
        };
      case "bnpl":
        return {
          title: `${method.provider}`,
          subtitle: `Available Credit: ₹${method.availableCredit.toLocaleString()}`,
          bgColor: "bg-green-500/10",
          textColor: "text-green-500"
        };
      case "upi":
        return {
          title: `${method.upiId}`,
          subtitle: method.linkedBank ? `Linked to ${method.linkedBank}` : "UPI Payment",
          bgColor: "bg-blue-500/10",
          textColor: "text-blue-500"
        };
    }
  };

  return (
    <div className="space-y-4">
      {!showOnlyCards && (
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as PaymentMethodType)}>
          <TabsList className="grid grid-cols-4 mb-4 w-full">
            <TabsTrigger 
              value="card" 
              className="flex items-center gap-2 py-2 h-auto w-full px-2"
            >
              <CreditCard className="h-4 w-4" />
              <span className="text-xs">Card</span>
            </TabsTrigger>
            <TabsTrigger 
              value="bank" 
              className="flex items-center gap-2 py-2 h-auto w-full px-2"
            >
              <BanknoteIcon className="h-4 w-4" />
              <span className="text-xs">Bank</span>
            </TabsTrigger>
            <TabsTrigger 
              value="bnpl" 
              className="flex items-center gap-2 py-2 h-auto w-full px-2"
            >
              <IndianRupee className="h-4 w-4" />
              <span className="text-xs">BNPL</span>
            </TabsTrigger>
            <TabsTrigger 
              value="upi" 
              className="flex items-center gap-2 py-2 h-auto w-full px-2"
            >
              <PhoneIcon className="h-4 w-4" />
              <span className="text-xs">UPI</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      <div className="space-y-3">
        {filteredMethods.length > 0 ? (
          filteredMethods.map((method) => {
            const details = getMethodDetails(method);
            const isSelected = selectedMethodId === method.id;
            return (
              <Card 
                key={method.id}
                className={cn(
                  "border transition-all cursor-pointer hover:shadow-md relative",
                  isSelected ? "ring-2 ring-primary bg-green-50" : ""
                )}
                onClick={() => onSelect(method.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full ${details.bgColor} flex items-center justify-center`}>
                      {getMethodIcon(method.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium flex items-center gap-2">
                        {details.title}
                        {method.isDefault && (
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{details.subtitle}</div>
                    </div>
                    {isSelected && (
                      <div className="absolute right-4 flex items-center">
                        <div className="bg-green-500 text-white rounded-full p-1">
                          <Check className="h-4 w-4" />
                        </div>
                        <span className="text-green-500 text-sm font-medium ml-1">Selected</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>No {showOnlyCards ? "credit card" : activeTab} payment methods found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
