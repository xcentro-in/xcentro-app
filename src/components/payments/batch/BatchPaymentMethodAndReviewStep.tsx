import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatters";
import { PaymentRow } from "./types";
import { mockPaymentMethods } from "@/data/mockPaymentMethods";
import { PaymentMethod } from "@/types/payment-method";
import { PaymentScheduleType } from "../common/PaymentScheduleSelector";
import PaymentScheduleSelector from "../common/PaymentScheduleSelector";
import { CreditCard, Building2, Smartphone } from "lucide-react";

interface BatchPaymentMethodAndReviewStepProps {
  selectedRows: string[];
  paymentRows: PaymentRow[];
  onBack: () => void;
  onSubmit: () => void;
  paymentType: PaymentScheduleType;
  scheduledDate?: Date;
  frequency: string;
  onPaymentTypeChange: (value: PaymentScheduleType) => void;
  onScheduledDateChange: (date?: Date) => void;
  onFrequencyChange: (value: string) => void;
}

const BatchPaymentMethodAndReviewStep = ({
  selectedRows,
  paymentRows,
  onBack,
  onSubmit,
  paymentType,
  scheduledDate,
  frequency,
  onPaymentTypeChange,
  onScheduledDateChange,
  onFrequencyChange
}: BatchPaymentMethodAndReviewStepProps) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");

  const selectedPaymentRows = useMemo(
    () => paymentRows.filter(row => selectedRows.includes(row.id)),
    [paymentRows, selectedRows]
  );
  
  const totalAmount = useMemo(
    () => selectedPaymentRows.reduce((sum, row) => sum + row.amount, 0),
    [selectedPaymentRows]
  );

  const paymentMethodDetails = selectedPaymentMethod 
    ? mockPaymentMethods.find(method => method.id === selectedPaymentMethod)
    : undefined;

  // Processing fees based on payment method
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
  const finalAmount = totalAmount + processingFee;

  const formatScheduleText = () => {
    if (paymentType === "now") return "Immediate";
    if (paymentType === "later" && scheduledDate) {
      return `Scheduled for ${scheduledDate.toLocaleDateString()}`;
    }
    if (paymentType === "recurring" && scheduledDate) {
      return `Recurring ${frequency} starting ${scheduledDate.toLocaleDateString()}`;
    }
    return "Not specified";
  };

  const bankMethods = mockPaymentMethods.filter(method => method.type === 'bank' || method.type === 'upi');
  const cardMethods = mockPaymentMethods.filter(method => method.type === 'card');
  const creditCards = cardMethods; // Assuming all cards are credit cards for now
  const debitCards: PaymentMethod[] = []; // No debit cards in mock data

  const renderPaymentMethod = (method: PaymentMethod) => (
    <div
      key={method.id}
      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
        selectedPaymentMethod === method.id 
          ? 'border-primary bg-primary/5' 
          : 'border-border hover:border-primary/50'
      }`}
      onClick={() => setSelectedPaymentMethod(method.id)}
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
            Processing fee: {formatCurrency(getProcessingFee(method))} 
            ({method.type === 'card' && method.cardType === 'amex' ? '2.4%' : 
              method.type === 'card' ? '2.8%' : 
              method.type === 'bank' ? '1%' : 
              method.type === 'upi' ? '0.5%' : '2%'})
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Payment Method & Review</h2>
        <p className="text-muted-foreground">
          Select your payment method and review the batch payment details
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
                {creditCards.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="font-medium">Credit Cards</h4>
                      <Badge variant="secondary" className="text-xs">Higher rewards</Badge>
                    </div>
                    <div className="space-y-3">
                      {creditCards.map(renderPaymentMethod)}
                    </div>
                  </div>
                )}
                
                {debitCards.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Debit Cards</h4>
                    <div className="space-y-3">
                      {debitCards.map(renderPaymentMethod)}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <PaymentScheduleSelector
                paymentType={paymentType}
                scheduledDate={scheduledDate}
                frequency={frequency}
                onPaymentTypeChange={onPaymentTypeChange}
                onScheduledDateChange={onScheduledDateChange}
                onFrequencyChange={onFrequencyChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Number of Transactions</span>
                <span className="font-medium">{selectedPaymentRows.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Schedule</span>
                <span className="text-sm">{formatScheduleText()}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Amount</span>
                <span className="font-medium">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Processing Fee</span>
                <span className="font-medium">{formatCurrency(processingFee)}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-semibold">
                <span>Total Payable</span>
                <span className="text-lg">{formatCurrency(finalAmount)}</span>
              </div>
              
              <div className="flex justify-between text-primary">
                <span>Reward Points</span>
                <span className="font-medium">
                  {Math.floor(totalAmount / 10).toLocaleString()} points
                </span>
              </div>
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

            <div className="mt-6 space-y-4">
              <h4 className="font-medium">Payment Transactions ({selectedPaymentRows.length})</h4>
              
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedPaymentRows.map(row => (
                  <div key={row.id} className="border p-3 rounded-md flex justify-between items-center">
                    <div>
                      <div className="font-medium">{row.payee}</div>
                      <div className="text-xs text-muted-foreground">{row.description}</div>
                    </div>
                    <div className="font-medium">{formatCurrency(row.amount)}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between gap-4">
        <Button variant="outline" onClick={onBack} className="w-auto">
          Back
        </Button>
        <Button 
          onClick={onSubmit}
          disabled={!selectedPaymentMethod || (paymentType === "later" && !scheduledDate) || (paymentType === "recurring" && (!scheduledDate || !frequency))}
          className="w-auto"
        >
          Confirm Payment
        </Button>
      </div>
    </div>
  );
};

export default BatchPaymentMethodAndReviewStep;