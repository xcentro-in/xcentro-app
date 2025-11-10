
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  BanknoteIcon,
  IndianRupee,
  PhoneIcon,
  ArrowRight,
  Check,
  X,
  ChevronLeft
} from "lucide-react";
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
import { PaymentMethodType } from "@/types/payment-method";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { processPaymentAPI } from "@/services/api";
import { canViewFeature } from "@/lib/featureFlags";

const FloatingLabelInput = ({ label, id, ...props }: { label: string; id: string } & React.ComponentProps<typeof Input>) => {
  return (
    <div className="relative">
      <Input
        id={id}
        placeholder=" "
        className="peer h-12 border-2 border-gray-300 rounded-lg bg-transparent focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 hover:border-gray-400 transition-colors"
        {...props}
      />
      <Label
        htmlFor={id}
        className="absolute text-muted-foreground left-3 top-3.5 transition-all duration-200 ease-in-out peer-focus:-top-2 peer-focus:left-2 peer-focus:text-primary peer-focus:text-xs peer-focus:bg-white dark:peer-focus:bg-gray-950 px-1 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-2 peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-white dark:peer-[:not(:placeholder-shown)]:bg-gray-900"
      >
        {label}
      </Label>
    </div>
  );
};

const AddPaymentMethod = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check which payment methods are enabled via feature flags
  const enabledPaymentMethods = useMemo(() => {
    return {
      card: canViewFeature('PAYMENT_METHOD_CARD', user),
      bank: canViewFeature('PAYMENT_METHOD_BANK', user),
      bnpl: canViewFeature('PAYMENT_METHOD_BNPL', user),
      upi: canViewFeature('PAYMENT_METHOD_UPI', user),
    };
  }, [user]);

  // Get the first available payment method as default
  const defaultPaymentMethod = useMemo(() => {
    if (enabledPaymentMethods.card) return 'card';
    if (enabledPaymentMethods.bank) return 'bank';
    if (enabledPaymentMethods.bnpl) return 'bnpl';
    if (enabledPaymentMethods.upi) return 'upi';
    return 'card'; // Fallback
  }, [enabledPaymentMethods]);

  const [currentTab, setCurrentTab] = useState<PaymentMethodType>(defaultPaymentMethod as PaymentMethodType);

  // Calculate grid columns based on enabled payment methods count
  const enabledPaymentMethodsCount = useMemo(() => {
    return Object.values(enabledPaymentMethods).filter(Boolean).length;
  }, [enabledPaymentMethods]);

  const gridColsClass = useMemo(() => {
    switch (enabledPaymentMethodsCount) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-2';
      case 3: return 'grid-cols-3';
      case 4: return 'grid-cols-4';
      default: return 'grid-cols-4';
    }
  }, [enabledPaymentMethodsCount]);

  // Card form state
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardType, setCardType] = useState("visa");
  const [cardCategory, setCardCategory] = useState("credit");
  const [cardholderName, setCardholderName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Only handle card tokenization for card tab
    if (currentTab === "card") {
      if (!user?.businessId) {
        toast.error("Business ID not found. Please log in again.");
        return;
      }

      setIsSubmitting(true);

      try {
        // Validate expiry month and year
        if (!expiryMonth || !expiryYear) {
          toast.error("Please enter both expiry month and year");
          setIsSubmitting(false);
          return;
        }

        if (expiryMonth.length !== 2 || expiryYear.length !== 2) {
          toast.error("Please enter valid expiry date (MM and YY)");
          setIsSubmitting(false);
          return;
        }

        // Remove spaces from card number
        const cleanCardNumber = cardNumber.replace(/\s/g, "");

        // Call tokenize API
        const response = await processPaymentAPI.tokenize(user.businessId, {
          card_number: cleanCardNumber,
          expiry_month: expiryMonth,
          expiry_year: expiryYear,
          cvv: cvv,
          holder_name: cardholderName,
          card_type: cardType,
          card_category: cardCategory,
        });

        // TODO: Handle redirection URL from response
        // For now, just show success message
        if (response.status === "success") {
          toast.success("Card tokenized successfully!");
          navigate("/wallet");
        } else {
          toast.error(response.message || "Failed to tokenize card");
        }
      } catch (error: any) {
        console.error("Card tokenization error:", error);
        toast.error(error.message || "Failed to tokenize card. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // For other tabs, use the default behavior
      toast.success(`New payment method added successfully!`);
      navigate("/wallet");
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/wallet")}
          className="rounded-full"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight animate-slide-up">Add Payment Method</h1>
          <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: "50ms" }}>
            Connect a new payment source to your business account
          </p>
        </div>
      </div>
      
      <Card className="shadow-lg border-none bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
        <CardContent className="p-6 md:p-8">
          <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as PaymentMethodType)}>
            <TabsList className={`grid ${gridColsClass} mb-8 bg-muted/70 p-1`}>
              {enabledPaymentMethods.card && (
                <TabsTrigger
                  value="card"
                  className="flex items-center gap-2 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Card</span>
                </TabsTrigger>
              )}
              {enabledPaymentMethods.bank && (
                <TabsTrigger
                  value="bank"
                  className="flex items-center gap-2 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
                >
                  <BanknoteIcon className="h-4 w-4" />
                  <span>Bank</span>
                </TabsTrigger>
              )}
              {enabledPaymentMethods.bnpl && (
                <TabsTrigger
                  value="bnpl"
                  className="flex items-center gap-2 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
                >
                  <IndianRupee className="h-4 w-4" />
                  <span>BNPL</span>
                </TabsTrigger>
              )}
              {enabledPaymentMethods.upi && (
                <TabsTrigger
                  value="upi"
                  className="flex items-center gap-2 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
                >
                  <PhoneIcon className="h-4 w-4" />
                  <span>UPI</span>
                </TabsTrigger>
              )}
            </TabsList>
            
            <div className="p-0.5 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent rounded-md mb-6"></div>

            {enabledPaymentMethods.card && (
              <TabsContent value="card">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <FloatingLabelInput
                      id="cardNumber"
                      label="Card Number"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={19}
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative w-20">
                      <Input
                        id="expiryMonth"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder=" "
                        maxLength={2}
                        required
                        value={expiryMonth}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          // Allow empty or values that could become valid months (0, 1-12, 01-09)
                          if (value === "" || value.length === 1 || (parseInt(value) >= 1 && parseInt(value) <= 12)) {
                            setExpiryMonth(value);
                          }
                        }}
                        onBlur={(e) => {
                          // Auto-pad single digit to MM format on blur
                          if (expiryMonth.length === 1) {
                            setExpiryMonth(expiryMonth.padStart(2, "0"));
                          }
                        }}
                        className="h-12 border-2 border-gray-300 rounded-lg bg-transparent focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 hover:border-gray-400 transition-colors w-20 text-center peer"
                      />
                      <Label
                        htmlFor="expiryMonth"
                        className="absolute text-muted-foreground left-1/2 -translate-x-1/2 top-3.5 transition-all duration-200 ease-in-out peer-focus:-top-2 peer-focus:text-primary peer-focus:text-xs peer-focus:bg-white dark:peer-focus:bg-gray-900 px-1 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-white dark:peer-[:not(:placeholder-shown)]:bg-gray-900"
                      >
                        MM
                      </Label>
                    </div>
                    <span className="text-muted-foreground font-medium">/</span>
                    <div className="relative w-20">
                      <Input
                        id="expiryYear"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder=" "
                        maxLength={2}
                        required
                        value={expiryYear}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          setExpiryYear(value);
                        }}
                        className="h-12 border-2 border-gray-300 rounded-lg bg-transparent focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 hover:border-gray-400 transition-colors w-20 text-center peer"
                      />
                      <Label
                        htmlFor="expiryYear"
                        className="absolute text-muted-foreground left-1/2 -translate-x-1/2 top-3.5 transition-all duration-200 ease-in-out peer-focus:-top-2 peer-focus:text-primary peer-focus:text-xs peer-focus:bg-white dark:peer-focus:bg-gray-900 px-1 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-white dark:peer-[:not(:placeholder-shown)]:bg-gray-900"
                      >
                        YY
                      </Label>
                    </div>
                  </div>

                  <div>
                    <FloatingLabelInput
                      id="cvv"
                      label="CVV"
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={4}
                      required
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardType" className="text-sm font-medium">Card Type</Label>
                    <Select value={cardType} onValueChange={setCardType}>
                      <SelectTrigger id="cardType" className="h-12 border-2 border-gray-300 rounded-lg bg-transparent focus:border-primary focus:ring-0 focus:ring-offset-0 hover:border-gray-400 transition-colors">
                        <SelectValue placeholder="Select card type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visa">Visa</SelectItem>
                        <SelectItem value="mastercard">Mastercard</SelectItem>
                        <SelectItem value="amex">American Express</SelectItem>
                        <SelectItem value="dinersclub">Diners Club</SelectItem>
                        <SelectItem value="rupay">RuPay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardCategory" className="text-sm font-medium">Card Category</Label>
                    <Select value={cardCategory} onValueChange={setCardCategory}>
                      <SelectTrigger id="cardCategory" className="h-12 border-2 border-gray-300 rounded-lg bg-transparent focus:border-primary focus:ring-0 focus:ring-offset-0 hover:border-gray-400 transition-colors">
                        <SelectValue placeholder="Select card category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit">Credit Card</SelectItem>
                        <SelectItem value="debit">Debit Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <FloatingLabelInput
                      id="cardholderName"
                      label="Cardholder Name"
                      type="text"
                      required
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-4 border-t">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="defaultCard" />
                      <Label htmlFor="defaultCard" className="font-medium">Set as default payment method</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="enableRecurring" defaultChecked />
                      <Label htmlFor="enableRecurring" className="font-medium">Enable for recurring payments</Label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                    >
                      {isSubmitting ? "Processing..." : "Add Card"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </form>
            </TabsContent>
            )}

            {enabledPaymentMethods.bank && (
              <TabsContent value="bank">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="accountHolderName">Account Holder Name</Label>
                    <Input 
                      id="accountHolderName"
                      type="text"
                      placeholder="Full name on the account" 
                      required 
                      className="bg-white dark:bg-gray-950"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Select>
                      <SelectTrigger id="bankName" className="bg-white dark:bg-gray-950">
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
                      className="bg-white dark:bg-gray-950"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ifscCode">IFSC Code</Label>
                    <Input 
                      id="ifscCode"
                      type="text"
                      placeholder="XXXX0000000" 
                      required 
                      className="bg-white dark:bg-gray-950"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-4 border-t">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="defaultBank" />
                      <Label htmlFor="defaultBank" className="font-medium">Set as default payment method</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="enableRecurringBank" defaultChecked />
                      <Label htmlFor="enableRecurringBank" className="font-medium">Enable for recurring payments</Label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      size="lg"
                      className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                    >
                      Link Bank Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </form>
            </TabsContent>
            )}

            {enabledPaymentMethods.bnpl && (
              <TabsContent value="bnpl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-green-500/10 p-4 rounded-md flex gap-3 items-start mb-6 border border-green-500/20">
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Pre-approved for BNPL</p>
                    <p className="text-xs text-muted-foreground">Based on your business profile, you're eligible for Buy Now, Pay Later credit.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bnplProvider">BNPL Provider</Label>
                    <Select defaultValue="paylater">
                      <SelectTrigger id="bnplProvider" className="bg-white dark:bg-gray-950">
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
                    <Label htmlFor="repaymentTerm">Repayment Term</Label>
                    <Select defaultValue="30">
                      <SelectTrigger id="repaymentTerm" className="bg-white dark:bg-gray-950">
                        <SelectValue placeholder="Select repayment term" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 Days</SelectItem>
                        <SelectItem value="45">45 Days</SelectItem>
                        <SelectItem value="60">60 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="md:px-4 py-6 bg-muted/30 rounded-lg">
                  <div className="space-y-1 mb-6">
                    <Label>Available Credit Limit</Label>
                    <div className="text-3xl font-bold">₹100,000</div>
                    <p className="text-xs text-muted-foreground">AI-recommended based on your business profile</p>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>₹0</span>
                    <span>₹100,000</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Switch id="autoDebit" defaultChecked />
                    <Label htmlFor="autoDebit" className="font-medium">Enable auto-debit for repayments</Label>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      size="lg"
                      className="gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    >
                      Activate BNPL
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </form>
            </TabsContent>
            )}

            {enabledPaymentMethods.upi && (
              <TabsContent value="upi">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="upiId">UPI ID</Label>
                    <Input 
                      id="upiId" 
                      placeholder="businessname@bank" 
                      required 
                      className="bg-white dark:bg-gray-950"
                    />
                    <p className="text-xs text-muted-foreground">Enter your registered UPI ID, e.g., businessname@okicici</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="linkedBank">Linked Bank (Optional)</Label>
                    <Select>
                      <SelectTrigger id="linkedBank" className="bg-white dark:bg-gray-950">
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
                </div>
                
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg my-4">
                  <h3 className="text-sm font-medium mb-2">UPI Benefits</h3>
                  <ul className="text-xs space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-blue-500" />
                      Instant transfers with no processing fees
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-blue-500" />
                      Available 24/7, including holidays
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-blue-500" />
                      Secure and regulated by NPCI
                    </li>
                  </ul>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-4 border-t">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="defaultUpi" />
                      <Label htmlFor="defaultUpi" className="font-medium">Set as default UPI payment method</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="enableRecurringUpi" defaultChecked />
                      <Label htmlFor="enableRecurringUpi" className="font-medium">Enable for recurring payments</Label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      size="lg"
                      className="gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    >
                      Add UPI ID
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </form>
            </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPaymentMethod;
