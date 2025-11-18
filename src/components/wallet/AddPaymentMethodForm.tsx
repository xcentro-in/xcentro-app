
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  CreditCard,
  BanknoteIcon,
  IndianRupee,
  PhoneIcon,
  ArrowRight,
  Check,
  X
} from "lucide-react";
import { PaymentMethodType } from "@/types/payment-method";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface AddPaymentMethodFormProps {
  onPaymentMethodAdded: () => void;
}

const AddPaymentMethodForm = ({ onPaymentMethodAdded }: AddPaymentMethodFormProps) => {
  const [currentTab, setCurrentTab] = useState<PaymentMethodType>("card");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`New payment method added successfully!`);

    // Flag will be updated automatically when WalletManagement renders and detects payment methods exist
    onPaymentMethodAdded();
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Add New Payment Method</h3>
      
      <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as PaymentMethodType)}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="card" className="flex flex-col gap-1 py-3 h-auto">
            <CreditCard className="h-5 w-5" />
            <span className="text-xs">Card</span>
          </TabsTrigger>
          <TabsTrigger value="bank" className="flex flex-col gap-1 py-3 h-auto">
            <BanknoteIcon className="h-5 w-5" />
            <span className="text-xs">Bank</span>
          </TabsTrigger>
          <TabsTrigger value="bnpl" className="flex flex-col gap-1 py-3 h-auto">
            <IndianRupee className="h-5 w-5" />
            <span className="text-xs">BNPL</span>
          </TabsTrigger>
          <TabsTrigger value="upi" className="flex flex-col gap-1 py-3 h-auto">
            <PhoneIcon className="h-5 w-5" />
            <span className="text-xs">UPI</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input 
                id="cardNumber"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="XXXX XXXX XXXX XXXX" 
                maxLength={19}
                required 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input 
                  id="expiryDate"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9/]*"
                  placeholder="MM/YY" 
                  maxLength={5} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input 
                  id="cvv" 
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="XXX" 
                  maxLength={4} 
                  required 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cardType">Card Type</Label>
              <Select defaultValue="visa">
                <SelectTrigger id="cardType">
                  <SelectValue placeholder="Select card type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visa">Visa</SelectItem>
                  <SelectItem value="mastercard">Mastercard</SelectItem>
                  <SelectItem value="amex">American Express</SelectItem>
                  <SelectItem value="diners">Diners Club</SelectItem>
                  <SelectItem value="rupay">RuPay</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input 
                id="cardholderName"
                type="text"
                placeholder="As it appears on the card" 
                required 
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="defaultCard" />
              <Label htmlFor="defaultCard">Set as default payment method</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="enableRecurring" defaultChecked />
              <Label htmlFor="enableRecurring">Enable for recurring payments</Label>
            </div>
            
            <Button type="submit" className="w-full mt-2">
              Add Card 
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="bank">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountHolderName">Account Holder Name</Label>
                <Input 
                  id="accountHolderName"
                  type="text"
                  placeholder="Full name on the account" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Select>
                  <SelectTrigger id="bankName">
                    <SelectValue placeholder="Select your bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hdfc">HDFC Bank</SelectItem>
                    <SelectItem value="icici">ICICI Bank</SelectItem>
                    <SelectItem value="sbi">State Bank of India</SelectItem>
                    <SelectItem value="axis">Axis Bank</SelectItem>
                    <SelectItem value="kotak">Kotak Mahindra Bank</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input 
                  id="accountNumber"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Enter account number" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ifscCode">IFSC Code</Label>
                <Input 
                  id="ifscCode"
                  type="text"
                  placeholder="XXXX0000000" 
                  required 
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="defaultBank" />
              <Label htmlFor="defaultBank">Set as default payment method</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="enableRecurringBank" defaultChecked />
              <Label htmlFor="enableRecurringBank">Enable for recurring payments</Label>
            </div>
            
            <Button type="submit" className="w-full mt-2">
              Link Bank Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="bnpl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-md flex gap-3 items-start mb-2">
              <Check className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Pre-approved for BNPL</p>
                <p className="text-xs text-muted-foreground">Based on your business profile, you're eligible for Buy Now, Pay Later credit.</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bnplProvider">BNPL Provider</Label>
              <Select defaultValue="paylater">
                <SelectTrigger id="bnplProvider">
                  <SelectValue placeholder="Select BNPL provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paylater">PayLater Business</SelectItem>
                  <SelectItem value="flexipay">FlexiPay</SelectItem>
                  <SelectItem value="creditsphere">CreditSphere</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Available Credit Limit</Label>
              <div className="text-2xl font-bold">₹100,000</div>
              <p className="text-xs text-muted-foreground">AI-recommended based on your business profile</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="repaymentTerm">Repayment Term</Label>
              <Select defaultValue="30">
                <SelectTrigger id="repaymentTerm">
                  <SelectValue placeholder="Select repayment term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="45">45 Days</SelectItem>
                  <SelectItem value="60">60 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="autoDebit" defaultChecked />
              <Label htmlFor="autoDebit">Enable auto-debit for repayments</Label>
            </div>
            
            <Button type="submit" className="w-full mt-2">
              Activate BNPL
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="upi">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="upiId">UPI ID</Label>
              <Input id="upiId" placeholder="businessname@bank" required />
              <p className="text-xs text-muted-foreground">Enter your registered UPI ID, e.g., businessname@okicici</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkedBank">Linked Bank (Optional)</Label>
              <Select>
                <SelectTrigger id="linkedBank">
                  <SelectValue placeholder="Select linked bank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sbi">State Bank of India</SelectItem>
                  <SelectItem value="hdfc">HDFC Bank</SelectItem>
                  <SelectItem value="icici">ICICI Bank</SelectItem>
                  <SelectItem value="axis">Axis Bank</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="defaultUpi" />
              <Label htmlFor="defaultUpi">Set as default UPI payment method</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="enableRecurringUpi" defaultChecked />
              <Label htmlFor="enableRecurringUpi">Enable for recurring payments</Label>
            </div>
            
            <Button type="submit" className="w-full mt-2">
              Add UPI ID
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddPaymentMethodForm;
