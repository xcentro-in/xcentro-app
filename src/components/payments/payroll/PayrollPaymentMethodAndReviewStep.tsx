import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Building2, Smartphone } from "lucide-react";
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
  // Calculate amounts
  const totalSalary = selectedEmployees.reduce((sum, emp) => sum + emp.salaryAmount, 0);
  
  // Find selected payment method
  const selectedMethod = mockPaymentMethods.find(m => m.id === selectedPaymentMethod);

  // Processing fees based on payment method
  const getProcessingFee = (method: PaymentMethod | undefined) => {
    if (!method) return 0;
    
    switch (method.type) {
      case 'card':
        if (method.cardType === 'amex') return totalSalary * 0.024;
        return totalSalary * 0.028;
      case 'bank':
        return totalSalary * 0.01;
      case 'upi':
        return totalSalary * 0.005;
      case 'bnpl':
        return totalSalary * 0.02;
      default:
        return 0;
    }
  };

  const processingFee = getProcessingFee(selectedMethod);
  const totalAmount = totalSalary + processingFee;

  // Filter payment methods by type
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Payment Method & Review</h2>
        <p className="text-muted-foreground">
          Select your payment method and review the payroll details
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
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Employees</span>
                <span className="font-medium">{selectedEmployees.length} selected</span>
              </div>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {selectedEmployees.map((employee) => (
                  <div key={employee.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{employee.name}</span>
                    <span>{formatCurrency(employee.salaryAmount)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Schedule</span>
                <span className="text-sm">{formatScheduleText()}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Salary</span>
                <span className="font-medium">{formatCurrency(totalSalary)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Processing Fee</span>
                <span className="font-medium">{formatCurrency(processingFee)}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-semibold">
                <span>Total Payable</span>
                <span className="text-lg">{formatCurrency(totalAmount)}</span>
              </div>
              
              <div className="flex justify-between text-primary">
                <span>Reward Points</span>
                <span className="font-medium">
                  {Math.floor(totalSalary / 10).toLocaleString()} points
                </span>
              </div>
            </div>

            {selectedPaymentMethod && selectedMethod && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium mb-1">Selected Payment Method</div>
                <div className="text-sm text-muted-foreground">
                  {selectedMethod.type === 'card' ? `${selectedMethod.cardType} **** ${selectedMethod.lastFourDigits}` :
                   selectedMethod.type === 'bank' ? `${selectedMethod.bankName} **** ${selectedMethod.lastFourDigits}` :
                   selectedMethod.type === 'upi' ? selectedMethod.upiId :
                   selectedMethod.provider}
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

export default PayrollPaymentMethodAndReviewStep;