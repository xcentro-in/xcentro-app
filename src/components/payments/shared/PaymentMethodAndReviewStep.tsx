import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatters";
import { CreditCard, Building2, Info, AlertCircle } from "lucide-react";
import { FeatureEnabled } from "@/components/FeatureEnabled";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { usePaymentSources } from "@/hooks/usePaymentSources";
import { PaymentSource } from "@/types/payment-source";
import { useAuth } from "@/contexts/AuthContext";
import { processPaymentAPI } from "@/services/api";
import { toast } from "sonner";
import { canViewFeature } from "@/lib/featureFlags";
import { getCardNetworkLogo } from "@/lib/cardNetworks";

export interface PaymentItem {
  id: string;
  name: string;
  amount: number;
  description?: string;
}

export type SummaryType = "simple" | "list";

interface PaymentMethodAndReviewStepProps {
  totalAmount: number;
  paymentItems: PaymentItem[];
  summaryType: SummaryType;
  scheduleText: string;
  selectedPaymentMethod?: string;
  onPaymentMethodChange: (methodId: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  additionalSummaryData?: Record<string, any>;
  paymentContext?: string; // e.g., "vendor_payment", "payroll", etc.
  voucherIds?: string[]; // Voucher IDs to be paid (changed from single voucherId to array)
  voucherId?: string; // @deprecated - kept for backward compatibility, use voucherIds instead
}

const PaymentMethodAndReviewStep = ({
  totalAmount,
  paymentItems,
  summaryType,
  scheduleText,
  selectedPaymentMethod,
  onPaymentMethodChange,
  onBack,
  onSubmit,
  additionalSummaryData,
  paymentContext = "vendor_payment",
  voucherIds,
  voucherId
}: PaymentMethodAndReviewStepProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    sources,
    cardSources,
    bankSources,
    isLoading,
    error,
    fetchPaymentSources,
    getSourceById
  } = usePaymentSources();

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Support backward compatibility: if voucherId is provided, convert to array
  const vouchers = voucherIds || (voucherId ? [voucherId] : []);

  // Check which payment methods are enabled via feature flags
  const enabledPaymentMethods = useMemo(() => {
    return {
      card: canViewFeature('PAYMENT_METHOD_CARD', user),
      bank: canViewFeature('PAYMENT_METHOD_BANK', user),
    };
  }, [user]);

  // Get the first available payment method as default
  const defaultPaymentMethod = useMemo(() => {
    if (enabledPaymentMethods.card) return 'card';
    if (enabledPaymentMethods.bank) return 'bank';
    return 'card'; // Fallback
  }, [enabledPaymentMethods]);

  // Calculate grid columns based on enabled payment methods count
  const enabledPaymentMethodsCount = useMemo(() => {
    return Object.values(enabledPaymentMethods).filter(Boolean).length;
  }, [enabledPaymentMethods]);

  const gridColsClass = useMemo(() => {
    switch (enabledPaymentMethodsCount) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-2';
      default: return 'grid-cols-2';
    }
  }, [enabledPaymentMethodsCount]);

  // Fetch payment sources when component mounts
  useEffect(() => {
    if (user?.businessId && totalAmount > 0) {
      fetchPaymentSources({
        business_id: user.businessId,
        payment_context: paymentContext,
        base_amount: totalAmount
      });
    }
  }, [user?.businessId, totalAmount, paymentContext, fetchPaymentSources]);

  // Get selected payment source details
  const selectedSource = selectedPaymentMethod
    ? getSourceById(selectedPaymentMethod)
    : undefined;

  // Calculate fees from selected source
  const processingFee = selectedSource?.fee_breakdown?.convenience_fee || 0;
  const gst = selectedSource?.fee_breakdown?.convenience_fee_gst || 0;
  const finalAmount = selectedSource?.fee_breakdown?.total_amount || totalAmount;

  // Detect calling device (web vs mobile)
  const getCallingDevice = (): 'web' | 'mobile' => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

    // Check for mobile devices
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());

    return isMobile ? 'mobile' : 'web';
  };

  // Handle payment confirmation
  const handleConfirmPayment = async () => {
    if (!selectedSource || !user?.businessId) {
      toast.error("Please select a payment method");
      return;
    }

    // Only process card payments (as per requirement)
    if (selectedSource.source_type !== 'card') {
      toast.error("Only card payments are supported at the moment");
      return;
    }

    if (vouchers.length === 0) {
      toast.error("No vouchers to process");
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Prepare payment payload
      const paymentPayload = {
        amount: Math.round(totalAmount * 100), // Convert to paise
        currency: "INR",
        payment_method: "token_card" as const,
        description: "Payment for vouchers",
        calling_device: getCallingDevice(),
        voucher_ids: vouchers,
        token_details: {
          card_id: selectedSource.source_id, // source_id is the stored card ID
        },
      };

      // Make payment API call
      const response = await processPaymentAPI.makeCardPayment(user.businessId, paymentPayload);

      // Extract redirect URL from response
      if (response.data?.redirect_url) {
        const redirectUrl = response.data.redirect_url;

        toast.success("Payment initiated successfully!");

        // Navigate to payment processing page with redirect URL
        navigate('/payment-processing', { state: { redirectUrl } });
      } else {
        // Fallback: if no redirect URL, show success and complete
        toast.success("Payment processed successfully!");
        setIsProcessingPayment(false);
        onSubmit();
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed", {
        description: error instanceof Error ? error.message : "Please try again"
      });
      setIsProcessingPayment(false);
    }
  };

  const renderPaymentSource = (source: PaymentSource) => {
    const isDisabled = !source.is_allowed;
    const isSelected = selectedPaymentMethod === source.source_id;

    const cardContent = (
      <div
        className={`p-4 border rounded-lg transition-colors ${
          isDisabled
            ? 'opacity-50 bg-muted/30'
            : 'cursor-pointer'
        } ${
          isSelected && !isDisabled
            ? 'border-primary bg-primary/5'
            : isDisabled
            ? 'border-border'
            : 'border-border hover:border-primary/50'
        }`}
        onClick={() => !isDisabled && onPaymentMethodChange(source.source_id)}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${
            source.source_type === 'card' ? 'bg-blue-500/10' : 'bg-purple-500/10'
          }`}>
            {source.source_type === 'card' ? (
              (() => {
                const cardLogo = getCardNetworkLogo(source.card_type);
                return cardLogo ? (
                  <img
                    src={cardLogo}
                    alt={source.card_type}
                    className="h-5 w-5 object-contain"
                  />
                ) : (
                  <CreditCard className="h-5 w-5" />
                );
              })()
            ) : (
              <Building2 className="h-5 w-5" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="font-medium">{source.display_name}</div>
              {isDisabled && (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
            </div>
            {source.fee_breakdown && (
              <div className="text-sm text-muted-foreground">
                Processing fee:
                {source.fee_breakdown.convenience_fee_percent > 0 && (
                  <> {source.fee_breakdown.convenience_fee_percent}% </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );

    // Wrap with tooltip if disabled
    if (isDisabled && source.restriction_reason) {
      return (
        <Tooltip key={source.source_id}>
          <TooltipTrigger asChild>
            <div className="cursor-not-allowed">
              {cardContent}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <p>{source.restriction_reason}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return <div key={source.source_id}>{cardContent}</div>;
  };

  const renderSimpleSummary = () => (
    <div className="space-y-3">
      {paymentItems.length === 1 && (
        <>
          <div className="flex justify-between">
            <span className="text-muted-foreground">To: {paymentItems[0].name}</span>
            <span className="font-medium">{formatCurrency(paymentItems[0].amount)}</span>
          </div>
          {paymentItems[0].description && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Description</span>
              <span className="text-sm max-w-32 text-right">{paymentItems[0].description}</span>
            </div>
          )}
        </>
      )}
      <div className="flex justify-between">
        <span className="text-muted-foreground">Settlement Date</span>
        <span className="text-sm">{scheduleText}</span>
      </div>
      {additionalSummaryData?.invoiceReference && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Reference</span>
          <span className="text-sm">{additionalSummaryData.invoiceReference}</span>
        </div>
      )}
    </div>
  );

  const renderListSummary = () => (
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">
          {additionalSummaryData?.itemLabel || "Items"}
        </span>
        <span className="font-medium">{paymentItems.length}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Settlement Date</span>
        <span className="text-sm">{scheduleText}</span>
      </div>
    </div>
  );

  // Show full-page loading state while payment is processing
  if (isProcessingPayment) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Processing Payment</h3>
            <p className="text-muted-foreground">Getting payment info...</p>
            <p className="text-sm text-muted-foreground">
              Please complete the payment verification in the popup window
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Payment Method & Review</h2>
        <p className="text-muted-foreground">
          Select your payment method and review the transaction details
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={defaultPaymentMethod} className="space-y-4">
              <TabsList className={`grid w-full ${gridColsClass}`}>
                {enabledPaymentMethods.bank && (
                  <TabsTrigger value="bank" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Bank
                  </TabsTrigger>
                )}
                {enabledPaymentMethods.card && (
                  <TabsTrigger value="card" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Card
                  </TabsTrigger>
                )}
              </TabsList>

              {enabledPaymentMethods.bank && (
                <TabsContent value="bank" className="space-y-3">
                <div className="text-sm text-muted-foreground mb-3">
                  Bank transfers and UPI payments
                </div>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading payment methods...
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-destructive">
                    {error}
                  </div>
                ) : bankSources.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No bank payment methods available
                  </div>
                ) : (
                  <TooltipProvider>
                    {bankSources.map(renderPaymentSource)}
                  </TooltipProvider>
                )}
              </TabsContent>
              )}

              {enabledPaymentMethods.card && (
                <TabsContent value="card" className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="font-medium">Cards</h4>
                    <Badge variant="secondary" className="text-xs">Higher rewards</Badge>
                  </div>
                  <div className="space-y-3">
                    {isLoading ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Loading payment methods...
                      </div>
                    ) : error ? (
                      <div className="text-center py-8 text-destructive">
                        {error}
                      </div>
                    ) : cardSources.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No card payment methods available
                      </div>
                    ) : (
                      <TooltipProvider>
                        {cardSources.map(renderPaymentSource)}
                      </TooltipProvider>
                    )}
                  </div>
                </div>
              </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {summaryType === "simple" ? renderSimpleSummary() : renderListSummary()}

            <Separator />

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {additionalSummaryData?.amountLabel || "Payment Amount"}
                </span>
                <span className="font-medium">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Processing Fee</span>
                <span className="font-medium">{formatCurrency(processingFee)}</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>GST levied on the processing fee</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span className="font-medium">{formatCurrency(gst)}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold">
                <span>Total Payable</span>
                <span className="text-lg">{formatCurrency(finalAmount)}</span>
              </div>

              <FeatureEnabled featureFlag="REWARD_POINT_SYSTEM">
                <div className="flex justify-between text-primary">
                  <span>Reward Points</span>
                  <span className="font-medium">
                    {Math.floor(totalAmount / 10).toLocaleString()} points
                  </span>
                </div>
              </FeatureEnabled>
            </div>

            {selectedPaymentMethod && selectedSource && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium mb-1">Selected Payment Method</div>
                <div className="text-sm text-muted-foreground">
                  {selectedSource.display_name}
                </div>
              </div>
            )}

            {summaryType === "list" && paymentItems.length > 0 && (
              <div className="mt-6 space-y-4">
                <h4 className="font-medium">
                  {additionalSummaryData?.listTitle || `Items (${paymentItems.length})`}
                </h4>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {paymentItems.map((item) => (
                    <div key={item.id} className="border p-3 rounded-md flex justify-between items-center">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        {item.description && (
                          <div className="text-xs text-muted-foreground">{item.description}</div>
                        )}
                      </div>
                      <div className="font-medium">{formatCurrency(item.amount)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="w-auto"
          disabled={isProcessingPayment}
        >
          Back
        </Button>
        <Button
          onClick={handleConfirmPayment}
          disabled={!selectedPaymentMethod || isProcessingPayment}
          className="w-auto"
        >
          {isProcessingPayment ? "Processing..." : "Confirm Payment"}
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethodAndReviewStep;