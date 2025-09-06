import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CreditCard, Building2 } from "lucide-react";
import { mockPaymentMethods } from "@/data/mockPaymentMethods";
import { PaymentMethod } from "@/types/payment-method";
import { Employee } from "./types";
import { PaymentScheduleType } from "../common/PaymentScheduleSelector";
import { formatCurrency } from "@/utils/formatters";
import { format } from "date-fns";

interface PayrollPaymentMethodAndReviewStepProps {
  selectedEmployees: Employee[];
  selectedPaymentMethod: string | undefined;
  paymentType: PaymentScheduleType;
  scheduledDate?: Date;
  frequency: string;
  onPaymentMethodChange: (methodId: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

const PayrollPaymentMethodAndReviewStep = ({
  selectedEmployees,
  selectedPaymentMethod,
  paymentType,
  scheduledDate,
  frequency,
  onPaymentMethodChange,
  onBack,
  onSubmit,
}: PayrollPaymentMethodAndReviewStepProps) => {
  const [activeTab, setActiveTab] = useState<"bank" | "card">("bank");

  // Calculate amounts
  const totalSalary = selectedEmployees.reduce((sum, emp) => sum + emp.salaryAmount, 0);
  
  // Processing fees based on payment method
  const getProcessingFee = (methodId: string) => {
    const method = mockPaymentMethods.find(m => m.id === methodId);
    if (!method) return 0;
    
    if (method.type === "card") {
      // Different rates for different card types
      if (method.cardType === "mastercard" || method.cardType === "visa") {
        return totalSalary * 0.028; // 2.8%
      } else if (method.cardType === "amex") {
        return totalSalary * 0.024; // 2.4%
      }
      return totalSalary * 0.025; // Default 2.5%
    }
    return totalSalary * 0.005; // 0.5% for bank transfers
  };

  const processingFee = selectedPaymentMethod ? getProcessingFee(selectedPaymentMethod) : 0;
  const totalAmount = totalSalary + processingFee;

  // Filter payment methods by type
  const bankMethods = mockPaymentMethods.filter(method => method.type === "bank");
  const cardMethods = mockPaymentMethods.filter(method => method.type === "card");

  // Group cards by type (for demo purposes, we'll treat all as mixed)
  const creditCards = cardMethods.filter(method => method.cardType === "visa" || method.cardType === "mastercard");
  const debitCards = cardMethods.filter(method => method.cardType === "amex" || method.cardType === "discover");

  const selectedMethod = mockPaymentMethods.find(m => m.id === selectedPaymentMethod);

  const renderPaymentMethod = (method: PaymentMethod) => (
    <Card 
      key={method.id} 
      className={`cursor-pointer transition-all ${
        selectedPaymentMethod === method.id 
          ? "ring-2 ring-primary bg-primary/5" 
          : "hover:shadow-md"
      }`}
      onClick={() => onPaymentMethodChange(method.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {method.type === "card" ? 
              <CreditCard className="h-5 w-5" /> : 
              <Building2 className="h-5 w-5" />
            }
            <div>
              <p className="font-medium">
                {method.type === "card" ? method.cardholderName : 
                 method.type === "bank" ? method.accountHolderName :
                 method.type === "bnpl" ? method.provider :
                 method.type === "upi" ? method.upiId : "Unknown"}
              </p>
              <p className="text-sm text-muted-foreground">
                {method.type === "card" ? `•••• ${method.lastFourDigits}` : 
                 method.type === "bank" ? `•••• ${method.lastFourDigits}` :
                 method.type === "bnpl" ? `Credit Limit: ${method.creditLimit}` :
                 method.type === "upi" ? method.linkedBank : ""}
              </p>
            </div>
          </div>
          {method.type === "card" && (
            <Badge variant="outline">
              {creditCards.includes(method) ? "Credit" : "Debit"}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Side - Payment Method Selection */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-medium">Select Payment Method</h3>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "bank" | "card")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bank">Bank Account</TabsTrigger>
            <TabsTrigger value="card">Card Payment</TabsTrigger>
          </TabsList>

          <TabsContent value="bank" className="space-y-3">
            {bankMethods.map(renderPaymentMethod)}
          </TabsContent>

          <TabsContent value="card" className="space-y-4">
            <div>
              <h4 className="font-medium mb-3">Credit Cards</h4>
              <div className="space-y-3">
                {creditCards.map(renderPaymentMethod)}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Debit Cards</h4>
              <div className="space-y-3">
                {debitCards.map(renderPaymentMethod)}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Side - Payment Summary */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Employees ({selectedEmployees.length})</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {selectedEmployees.map((employee) => (
                  <div key={employee.id} className="flex justify-between text-sm">
                    <span>{employee.name}</span>
                    <span>{formatCurrency(employee.salaryAmount)}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">Payment Schedule</h4>
              <div className="text-sm text-muted-foreground">
                {paymentType === "now" && "Pay Now"}
                {paymentType === "later" && scheduledDate && `Pay on ${format(scheduledDate, "PPP")}`}
                {paymentType === "recurring" && `${frequency.charAt(0).toUpperCase() + frequency.slice(1)} payments${scheduledDate ? ` starting ${format(scheduledDate, "PPP")}` : ""}`}
              </div>
            </div>

            {selectedMethod && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Payment Method</h4>
                  <div className="flex items-center gap-2 text-sm">
                    {selectedMethod.type === "card" ? 
                      <CreditCard className="h-4 w-4" /> : 
                      <Building2 className="h-4 w-4" />
                    }
                    <span>
                      {selectedMethod.type === "card" ? selectedMethod.cardholderName : 
                       selectedMethod.type === "bank" ? selectedMethod.accountHolderName :
                       selectedMethod.type === "bnpl" ? selectedMethod.provider :
                       selectedMethod.type === "upi" ? selectedMethod.upiId : "Unknown"}
                    </span>
                    {selectedMethod.type === "card" && (
                      <Badge variant="outline" className="ml-auto">
                        {creditCards.includes(selectedMethod) ? "Credit" : "Debit"}
                      </Badge>
                    )}
                  </div>
                </div>
              </>
            )}

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Salary</span>
                <span>{formatCurrency(totalSalary)}</span>
              </div>
              {processingFee > 0 && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Processing Fee</span>
                  <span>{formatCurrency(processingFee)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total Amount</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <Button 
              className="w-full" 
              onClick={onSubmit}
              disabled={!selectedPaymentMethod}
            >
              Confirm Payment
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PayrollPaymentMethodAndReviewStep;