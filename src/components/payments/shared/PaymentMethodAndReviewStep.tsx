import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatters";
import { mockPaymentMethods } from "@/data/mockPaymentMethods";
import { PaymentMethod } from "@/types/payment-method";
import { CreditCard, Building2, Smartphone } from "lucide-react";
import { FeatureEnabled } from "@/components/FeatureEnabled";

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
  additionalSummaryData
}: PaymentMethodAndReviewStepProps) => {
  const paymentMethodDetails = selectedPaymentMethod
    ? mockPaymentMethods.find(method => method.id === selectedPaymentMethod)
    : undefined;

  const getProcessingFee = (method: PaymentMethod | undefined) => {
    if (!method) return 0;

    switch (method.type) {
      case 'card':
        if (method.cardType === 'amex') return totalAmount * 0.024;
        return totalAmount * 0.028;
      case 'bank':
        return totalAmount * 0.01;
      case 'upi':
        return totalAmount * 0.005;
      case 'bnpl':
        return totalAmount * 0.02;
      default:
        return 0;
    }
  };

  const processingFee = getProcessingFee(paymentMethodDetails);
  const gst = processingFee * 0.18;
  const finalAmount = totalAmount + processingFee + gst;

  const bankMethods = mockPaymentMethods.filter(method => method.type === 'bank' || method.type === 'upi');
  const cardMethods = mockPaymentMethods.filter(method => method.type === 'card');

  const renderPaymentMethod = (method: PaymentMethod) => (
    <div
      key={method.id}
      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
        selectedPaymentMethod === method.id
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50'
      }`}
      onClick={() => onPaymentMethodChange(method.id)}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${
          method.type === 'card' ? 'bg-blue-500/10' :
          method.type === 'bank' ? 'bg-purple-500/10' :
          'bg-green-500/10'
        }`}>
          {method.type === 'card' ? <CreditCard className="h-5 w-5" /> :
           method.type === 'bank' ? <Building2 className="h-5 w-5" /> :
           <Smartphone className="h-5 w-5" />}
        </div>
        <div className="flex-1">
          <div className="font-medium">
            {method.type === 'card' ? `${method.cardType} **** ${method.lastFourDigits}` :
             method.type === 'bank' ? `${method.bankName} **** ${method.lastFourDigits}` :
             method.type === 'upi' ? method.upiId :
             method.provider}
          </div>
          <div className="text-sm text-muted-foreground">
            Processing fee: {formatCurrency(getProcessingFee(method) + getProcessingFee(method) * 0.18)} incl. GST
            ({method.type === 'card' && method.cardType === 'amex' ? '2.4%' :
              method.type === 'card' ? '2.8%' :
              method.type === 'bank' ? '1%' :
              method.type === 'upi' ? '0.5%' : '2%'} + 18% GST)
          </div>
        </div>
      </div>
    </div>
  );

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
        <span className="text-muted-foreground">Schedule</span>
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
        <span className="text-muted-foreground">Schedule</span>
        <span className="text-sm">{scheduleText}</span>
      </div>
    </div>
  );

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
            <Tabs defaultValue="bank" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="bank" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Bank
                </TabsTrigger>
                <TabsTrigger value="card" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Card
                </TabsTrigger>
              </TabsList>

              <TabsContent value="bank" className="space-y-3">
                <div className="text-sm text-muted-foreground mb-3">
                  Bank transfers and UPI payments
                </div>
                {bankMethods.map(renderPaymentMethod)}
              </TabsContent>

              <TabsContent value="card" className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="font-medium">Cards</h4>
                    <Badge variant="secondary" className="text-xs">Higher rewards</Badge>
                  </div>
                  <div className="space-y-3">
                    {cardMethods.map(renderPaymentMethod)}
                  </div>
                </div>
              </TabsContent>
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
                <span className="text-muted-foreground">GST (18%)</span>
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

            {selectedPaymentMethod && paymentMethodDetails && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium mb-1">Selected Payment Method</div>
                <div className="text-sm text-muted-foreground">
                  {paymentMethodDetails.type === 'card' ? `${paymentMethodDetails.cardType} **** ${paymentMethodDetails.lastFourDigits}` :
                   paymentMethodDetails.type === 'bank' ? `${paymentMethodDetails.bankName} **** ${paymentMethodDetails.lastFourDigits}` :
                   paymentMethodDetails.type === 'upi' ? paymentMethodDetails.upiId :
                   paymentMethodDetails.provider}
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
        <Button variant="outline" onClick={onBack} className="w-auto">
          Back
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!selectedPaymentMethod}
          className="w-auto"
        >
          Confirm Payment
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethodAndReviewStep;