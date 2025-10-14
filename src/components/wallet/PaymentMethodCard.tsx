
import { CreditCard, BanknoteIcon, IndianRupee, PhoneIcon, Trash2, Star, StarOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { PaymentMethod } from "@/types/payment-method";
import { useState } from "react";
import CreditCardDisplay from "@/components/payments/CreditCardDisplay";

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleRecurring: (id: string, enabled: boolean) => void;
}

const PaymentMethodCard = ({ 
  paymentMethod, 
  onSetDefault, 
  onDelete, 
  onToggleRecurring 
}: PaymentMethodCardProps) => {
  const [recurring, setRecurring] = useState(paymentMethod.enabledForRecurring);
  
  // For non-card payment methods
  const getIcon = () => {
    switch (paymentMethod.type) {
      case "bank":
        return <BanknoteIcon className="h-5 w-5 text-purple-500" />;
      case "bnpl":
        return <IndianRupee className="h-5 w-5 text-green-500" />;
      case "upi":
        return <PhoneIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <CreditCard className="h-5 w-5 text-primary" />;
    }
  };

  const getTitle = () => {
    switch (paymentMethod.type) {
      case "bank":
        return `${paymentMethod.bankName} •••• ${paymentMethod.lastFourDigits}`;
      case "bnpl":
        return `${paymentMethod.provider}`;
      case "upi":
        return `${paymentMethod.upiId}`;
      default:
        return `${paymentMethod.cardType.toUpperCase()} •••• ${paymentMethod.lastFourDigits}`;
    }
  };

  const getSubtitle = () => {
    switch (paymentMethod.type) {
      case "bank":
        return `${paymentMethod.accountHolderName} | IFSC: ${paymentMethod.ifscCode}`;
      case "bnpl":
        return `Available: ₹${paymentMethod.availableCredit.toLocaleString()}`;
      case "upi":
        return paymentMethod.linkedBank || "UPI Payment";
      default:
        return "";
    }
  };

  const handleRecurringToggle = (checked: boolean) => {
    setRecurring(checked);
    onToggleRecurring(paymentMethod.id, checked);
    toast.success(`${checked ? 'Enabled' : 'Disabled'} recurring payments for ${getTitle()}`);
  };

  const handleDelete = () => {
    if (paymentMethod.isDefault) {
      toast.error("Cannot delete default payment method");
      return;
    }
    onDelete(paymentMethod.id);
  };

  const handleSetDefault = () => {
    if (!paymentMethod.isDefault) {
      onSetDefault(paymentMethod.id);
      toast.success(`Set ${getTitle()} as default payment method`);
    }
  };

  // Render credit card using CreditCardDisplay component
  if (paymentMethod.type === "card") {
    return (
      <div className="mb-4">
        <CreditCardDisplay 
          card={paymentMethod}
          isSelected={false}
          onClick={() => {}} // Empty function since we don't need selection here
        />
        <div className="flex items-center justify-between mt-2 border-t pt-2">
          <div className="flex items-center space-x-2">
            <Switch 
              id={`recurring-${paymentMethod.id}`} 
              checked={recurring}
              onCheckedChange={handleRecurringToggle}
            />
            <Label htmlFor={`recurring-${paymentMethod.id}`} className="text-xs">
              Recurring
            </Label>
          </div>
          
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={handleSetDefault}
              disabled={paymentMethod.isDefault}
            >
              {paymentMethod.isDefault ? 
                <Star className="h-4 w-4 text-primary" fill="currentColor" /> : 
                <StarOff className="h-4 w-4" />
              }
              <span className="sr-only">Set as default</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-destructive hover:text-destructive" 
              onClick={handleDelete}
              disabled={paymentMethod.isDefault}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // For other payment methods (bank, bnpl, upi)
  return (
    <Card className="overflow-hidden mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`h-12 w-12 rounded-full ${
              paymentMethod.type === 'bank' ? 'bg-purple-500/10' : 
              paymentMethod.type === 'bnpl' ? 'bg-green-500/10' : 
              'bg-blue-500/10'
            } flex items-center justify-center`}>
              {getIcon()}
            </div>
            <div>
              <div className="font-medium text-base">{getTitle()}</div>
              <div className="text-sm text-muted-foreground">{getSubtitle()}</div>
            </div>
          </div>
          {paymentMethod.isDefault && (
            <div className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
              Default
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between border-t pt-3">
          <div className="flex items-center space-x-2">
            <Switch 
              id={`recurring-${paymentMethod.id}`} 
              checked={recurring}
              onCheckedChange={handleRecurringToggle}
            />
            <Label htmlFor={`recurring-${paymentMethod.id}`} className="text-xs">
              Recurring
            </Label>
          </div>
          
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={handleSetDefault}
              disabled={paymentMethod.isDefault}
            >
              {paymentMethod.isDefault ? 
                <Star className="h-4 w-4 text-primary" fill="currentColor" /> : 
                <StarOff className="h-4 w-4" />
              }
              <span className="sr-only">Set as default</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-destructive hover:text-destructive" 
              onClick={handleDelete}
              disabled={paymentMethod.isDefault}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodCard;
