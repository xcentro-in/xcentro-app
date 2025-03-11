
import { CreditCard, BanknoteIcon, IndianRupee, PhoneIcon, Trash2, Edit, Star, StarOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { PaymentMethod } from "@/types/payment-method";
import { useState } from "react";

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onToggleRecurring: (id: string, enabled: boolean) => void;
}

const PaymentMethodCard = ({ 
  paymentMethod, 
  onSetDefault, 
  onDelete, 
  onEdit,
  onToggleRecurring 
}: PaymentMethodCardProps) => {
  const [recurring, setRecurring] = useState(paymentMethod.enabledForRecurring);
  
  const getIcon = () => {
    switch (paymentMethod.type) {
      case "card":
        return <CreditCard className="h-5 w-5 text-primary" />;
      case "bank":
        return <BanknoteIcon className="h-5 w-5 text-purple-500" />;
      case "bnpl":
        return <IndianRupee className="h-5 w-5 text-green-500" />;
      case "upi":
        return <PhoneIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getTitle = () => {
    switch (paymentMethod.type) {
      case "card":
        return `${paymentMethod.cardType.toUpperCase()} •••• ${paymentMethod.lastFourDigits}`;
      case "bank":
        return `${paymentMethod.bankName} •••• ${paymentMethod.lastFourDigits}`;
      case "bnpl":
        return `${paymentMethod.provider}`;
      case "upi":
        return `${paymentMethod.upiId}`;
    }
  };

  const getSubtitle = () => {
    switch (paymentMethod.type) {
      case "card":
        return `Exp: ${paymentMethod.expiryDate}`;
      case "bank":
        return `IFSC: ${paymentMethod.ifscCode}`;
      case "bnpl":
        return `Available: ₹${paymentMethod.availableCredit.toLocaleString()}`;
      case "upi":
        return paymentMethod.linkedBank || "UPI";
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

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-full bg-${paymentMethod.type === 'card' ? 'primary' : paymentMethod.type === 'bank' ? 'purple' : paymentMethod.type === 'bnpl' ? 'green' : 'blue'}-500/10 flex items-center justify-center`}>
              {getIcon()}
            </div>
            <div>
              <div className="font-medium">{getTitle()}</div>
              <div className="text-xs text-muted-foreground">{getSubtitle()}</div>
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
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onEdit(paymentMethod.id)}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            
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
