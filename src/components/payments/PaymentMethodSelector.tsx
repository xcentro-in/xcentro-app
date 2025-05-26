
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, BanknoteIcon, IndianRupee, PhoneIcon } from "lucide-react";
import { mockPaymentMethods } from "@/data/mockPaymentMethods";
import { PaymentMethod, PaymentMethodType, CardPaymentMethod } from "@/types/payment-method";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

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
  const getMethodIcon = (type: PaymentMethodType) => {
    switch (type) {
      case "card":
        return <CreditCard className="h-4 w-4" />;
      case "bank":
        return <BanknoteIcon className="h-4 w-4" />;
      case "bnpl":
        return <IndianRupee className="h-4 w-4" />;
      case "upi":
        return <PhoneIcon className="h-4 w-4" />;
    }
  };

  const getCardNetworkLogo = (cardType: string) => {
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
  
  const getMethodDetails = (method: PaymentMethod) => {
    switch (method.type) {
      case "card":
        return {
          title: `HDFC Millenia`,
          subtitle: `**** ${method.lastFourDigits}`,
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

  const getMethodTypeTitle = (type: PaymentMethodType) => {
    switch (type) {
      case "card":
        return "Credit/Debit Cards";
      case "bank":
        return "Bank Accounts";
      case "bnpl":
        return "Buy Now Pay Later";
      case "upi":
        return "UPI";
    }
  };

  // Group methods by type
  const groupedMethods = showOnlyCards 
    ? { card: mockPaymentMethods.filter(method => method.type === "card") }
    : mockPaymentMethods.reduce((acc, method) => {
        if (!acc[method.type]) {
          acc[method.type] = [];
        }
        acc[method.type].push(method);
        return acc;
      }, {} as Record<PaymentMethodType, PaymentMethod[]>);

  // Render all payment methods in list view
  const renderMethodsList = (methods: PaymentMethod[]) => {
    if (methods.length === 0) {
      return (
        <div className="text-center py-4 text-muted-foreground">
          <p className="text-sm">No payment methods found</p>
        </div>
      );
    }
    
    return (
      <RadioGroup value={selectedMethodId} onValueChange={onSelect} className="space-y-2">
        {methods.map((method) => {
          const details = getMethodDetails(method);
          const isSelected = selectedMethodId === method.id;
          
          return (
            <div key={method.id}>
              <Label
                htmlFor={method.id}
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all hover:bg-accent/50",
                  isSelected ? "border-primary bg-primary/5" : "border-border"
                )}
              >
                <div className={`h-8 w-8 rounded-full ${details.bgColor} flex items-center justify-center flex-shrink-0`}>
                  {method.type === "card" ? (
                    <img 
                      src={getCardNetworkLogo((method as CardPaymentMethod).cardType)} 
                      alt={(method as CardPaymentMethod).cardType}
                      className="h-5 w-5 object-contain"
                    />
                  ) : (
                    getMethodIcon(method.type)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-sm truncate">
                      {details.title}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{details.subtitle}</div>
                </div>
                <RadioGroupItem 
                  value={method.id} 
                  id={method.id}
                  className={cn(
                    "flex-shrink-0",
                    method.isDefault && isSelected ? "border-green-500 text-green-500" : ""
                  )}
                />
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    );
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedMethods).map(([type, methods]) => (
        <div key={type} className="space-y-3">
          <div className="flex items-center gap-2">
            {getMethodIcon(type as PaymentMethodType)}
            <h3 className="font-medium text-base">{getMethodTypeTitle(type as PaymentMethodType)}</h3>
          </div>
          
          {renderMethodsList(methods)}
        </div>
      ))}
    </div>
  );
};

export default PaymentMethodSelector;
