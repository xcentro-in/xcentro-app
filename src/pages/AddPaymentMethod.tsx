
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  BanknoteIcon,
  IndianRupee,
  PhoneIcon,
  ArrowRight,
  Check,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  Loader2
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
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { processPaymentAPI } from "@/services/api";
import { canViewFeature } from "@/lib/featureFlags";
import CardValidator from "@/lib/card-validator";
import { getCardNetworkLogo } from "@/lib/cardNetworks";
import { cn } from "@/lib/utils";

const FloatingLabelInput = ({ label, id, className, ...props }: { label: string; id: string; className?: string } & React.ComponentProps<typeof Input>) => {
  return (
    <div className="relative">
      <Input
        id={id}
        placeholder=" "
        className={cn(
          "peer h-12 border-2 border-gray-300 rounded-lg bg-transparent focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 hover:border-gray-400 transition-colors",
          className
        )}
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
  const { user, userRoles } = useAuth();
  const { businessId, businessName } = useCurrentBusiness();

  // Get user's role for the current business
  const currentUserRole = userRoles.find(role => role.businessId === businessId)?.role || '';

  // Create feature flag compatible user object
  const featureFlagUser = { id: user?.id || '', role: currentUserRole as any };

  // Check which payment methods are enabled via feature flags
  const enabledPaymentMethods = useMemo(() => {
    return {
      card: canViewFeature('PAYMENT_METHOD_CARD', featureFlagUser),
      bank: canViewFeature('PAYMENT_METHOD_BANK', featureFlagUser),
      bnpl: canViewFeature('PAYMENT_METHOD_BNPL', featureFlagUser),
      upi: canViewFeature('PAYMENT_METHOD_UPI', featureFlagUser),
    };
  }, [featureFlagUser.id, featureFlagUser.role]);

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
  const [detectedCardNetwork, setDetectedCardNetwork] = useState<string>("unknown");
  const [cardValidation, setCardValidation] = useState<{
    valid: boolean;
    luhn_valid: boolean;
    length_valid: boolean;
    cvv_length: number[];
    max_length: number | null;
  } | null>(null);
  const [cardCategory, setCardCategory] = useState("credit");
  const [cardholderName, setCardholderName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real-time card validation as user types
  useEffect(() => {
    if (cardNumber.length > 0) {
      try {
        const cleanNumber = cardNumber.replace(/\s/g, "");
        const validator = new CardValidator(cleanNumber);
        const details = validator.getCardDetails();

        setDetectedCardNetwork(details.card_type);
        setCardValidation(details);
      } catch (error) {
        console.error("Card validation error:", error);
        setDetectedCardNetwork("unknown");
        setCardValidation(null);
      }
    } else {
      setDetectedCardNetwork("unknown");
      setCardValidation(null);
    }
  }, [cardNumber]);

  // Format card number with spaces for better readability
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, ""); // Remove existing spaces
    const numericValue = value.replace(/[^0-9]/g, ""); // Keep only numbers

    // Apply formatting with spaces every 4 digits
    let formattedValue = "";
    for (let i = 0; i < numericValue.length; i += 4) {
      if (i > 0) formattedValue += " ";
      formattedValue += numericValue.substring(i, Math.min(i + 4, numericValue.length));
    }

    setCardNumber(formattedValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Only handle card tokenization for card tab
    if (currentTab === "card") {
      if (!businessId) {
        toast.error("Business ID not found. Please log in again.");
        return;
      }

      setIsSubmitting(true);

      try {
        // Remove spaces from card number
        const cleanCardNumber = cardNumber.replace(/\s/g, "");

        // STEP 1: Validate card number using CardValidator
        const validator = new CardValidator(cleanCardNumber);

        // Check if card number is valid
        const isCardValid = validator.validateCard();
        if (!isCardValid) {
          toast.error("Invalid card number", {
            description: "Please check your card number and try again"
          });
          setIsSubmitting(false);
          return;
        }

        // STEP 2: Validate expiry date
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

        // Convert YY to YYYY format for validation
        const currentYear = new Date().getFullYear();
        const currentCentury = Math.floor(currentYear / 100) * 100;
        const fullYear = currentCentury + parseInt(expiryYear);
        const expiryString = `${expiryMonth}/${fullYear}`;

        try {
          const isExpiryValid = validator.validateExpiry(expiryString);
          if (!isExpiryValid) {
            toast.error("Card has expired or invalid expiry date");
            setIsSubmitting(false);
            return;
          }
        } catch (error: any) {
          toast.error("Invalid expiry date format");
          setIsSubmitting(false);
          return;
        }

        // STEP 3: Validate CVV
        if (!cvv) {
          toast.error("Please enter CVV");
          setIsSubmitting(false);
          return;
        }

        try {
          const isCvvValid = validator.validateCvv(cvv);
          if (!isCvvValid) {
            toast.error("Invalid CVV", {
              description: `Please enter a valid ${cardValidation?.cvv_length?.[0] || 3}-digit CVV`
            });
            setIsSubmitting(false);
            return;
          }
        } catch (error: any) {
          toast.error(error.message || "Invalid CVV");
          setIsSubmitting(false);
          return;
        }

        // STEP 4: Check if card network was detected
        if (detectedCardNetwork === "unknown") {
          toast.error("Unable to detect card network", {
            description: "This card type is not supported"
          });
          setIsSubmitting(false);
          return;
        }

        // All validations passed - proceed with tokenization
        // Call tokenize API
        const response = await processPaymentAPI.tokenize(businessId, {
          card_number: cleanCardNumber,
          expiry_month: expiryMonth,
          expiry_year: expiryYear,
          cvv: cvv,
          holder_name: cardholderName,
          card_type: detectedCardNetwork, // Use detected network instead of dropdown value
          card_category: cardCategory,
        }) as {
          status: string;
          message?: string;
          data?: {
            redirect_url?: string;
          };
        };

        // Handle redirection URL from response
        if (response.status === "success") {
          // If there's a redirect URL (3DS authentication required), navigate to payment processing page
          if (response.data?.redirect_url) {
            navigate("/payment-processing", {
              state: {
                redirectUrl: response.data.redirect_url,
                redirectTarget: "/wallet", // Redirect to wallet after popup closes
                flowType: "tokenization", // Indicate this is tokenization flow
              },
            });
          } else {
            // No 3DS required, card tokenized successfully
            toast.success("Card added successfully!");
            navigate("/wallet");
          }
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
                  <div className="md:col-span-2 space-y-2">
                    <div className="relative">
                      <FloatingLabelInput
                        id="cardNumber"
                        label="Card Number"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9 ]*"
                        maxLength={19}
                        required
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        className={cn(
                          "pr-16", // Always add padding for logo/icon space
                          cardNumber.length > 0 && cardValidation?.valid && "border-green-500 focus-visible:border-green-500",
                          cardNumber.length > 0 && !cardValidation?.valid && "border-red-500 focus-visible:border-red-500"
                        )}
                      />
                      {/* Card Network Logo Display */}
                      {cardNumber.length > 0 && detectedCardNetwork !== "unknown" && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                          {getCardNetworkLogo(detectedCardNetwork) ? (
                            <img
                              src={getCardNetworkLogo(detectedCardNetwork)!}
                              alt={detectedCardNetwork}
                              className="h-6 w-auto object-contain"
                            />
                          ) : (
                            <div className="w-10 h-6 rounded flex items-center justify-center bg-gradient-to-br from-slate-600 to-slate-700">
                              <span className="text-white text-xs font-medium">
                                {detectedCardNetwork.toUpperCase().slice(0, 4)}
                              </span>
                            </div>
                          )}
                          {cardValidation?.valid && (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      )}
                      {/* Error Icon when no network detected but has input */}
                      {cardNumber.length > 0 && detectedCardNetwork === "unknown" && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {cardValidation && !cardValidation.valid && cardNumber.length >= 13 && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {!cardValidation.luhn_valid
                          ? "Invalid card number (failed checksum)"
                          : !cardValidation.length_valid
                          ? `Invalid length (expected ${cardValidation.max_length} digits)`
                          : "Invalid card number"}
                      </p>
                    )}
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

                  <div className="space-y-2">
                    <FloatingLabelInput
                      id="cvv"
                      label="CVV"
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={cardValidation?.cvv_length?.[cardValidation.cvv_length.length - 1] || 4}
                      required
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                    />
                    {cardValidation && cardValidation.cvv_length.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {cardValidation.cvv_length.length > 1
                          ? `${cardValidation.cvv_length.join(" or ")} digits`
                          : `${cardValidation.cvv_length[0]} digits`}
                      </p>
                    )}
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

                {/* Card Verification Info */}
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-1">
                        Card Verification
                      </p>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        ₹1 will be debited from your card to verify it's active.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-end gap-4 pt-4 border-t">
                  {/* <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="defaultCard" />
                      <Label htmlFor="defaultCard" className="font-medium">Set as default payment method</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="enableRecurring" defaultChecked />
                      <Label htmlFor="enableRecurring" className="font-medium">Enable for recurring payments</Label>
                    </div>
                  </div> */}

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                    >
                      {isSubmitting ? (
                        <>
                          Processing...
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        </>
                      ) : (
                        <>
                          Add Card
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
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
