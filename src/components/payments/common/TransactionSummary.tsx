
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PaymentType } from "../PaymentDetailsStep";
import { Payee } from "@/types/payee";
import { PaymentMethod } from "@/types/payment-method";

// Import components
import { PaymentDetailsSection } from "../summary/PaymentDetailsSection";
import { PayeeSection } from "../summary/PayeeSection";
import { PaymentMethodSection } from "../summary/PaymentMethodSection";
import { PaymentSummarySection } from "../summary/PaymentSummarySection";
import { EmployeesDialog } from "../summary/EmployeesDialog";

interface Employee {
  name: string;
  email: string;
  accountNumber: string;
  bankName: string;
  salaryAmount: number;
}

interface TransactionSummaryProps {
  paymentType: PaymentType;
  scheduledDate?: Date;
  amount: number;
  description: string;
  invoiceReference: string;
  frequency?: string;
  payee?: Payee;
  paymentMethod?: PaymentMethod;
  platformFee: number;
  gatewayFee: number;
  totalAmount: number;
  rewardPoints: number;
  employees?: Employee[];
  onBack: () => void;
}

export const TransactionSummary = ({
  paymentType,
  scheduledDate,
  amount,
  description,
  invoiceReference,
  frequency,
  payee,
  paymentMethod,
  platformFee,
  gatewayFee,
  totalAmount,
  rewardPoints,
  employees = [],
  onBack,
}: TransactionSummaryProps) => {
  const [showEmployeesDialog, setShowEmployeesDialog] = useState(false);
  
  return (
    <div className="space-y-6">
      <h3 className="font-medium text-lg">Review Payment</h3>
      
      {/* Payment Details Section */}
      <PaymentDetailsSection 
        paymentType={paymentType}
        scheduledDate={scheduledDate}
        description={description}
        invoiceReference={invoiceReference}
        frequency={frequency}
      />
      
      {/* Payee Section */}
      <PayeeSection 
        payee={payee}
        employees={employees}
        onViewEmployees={() => setShowEmployeesDialog(true)}
      />
      
      {/* Payment Method Section */}
      <PaymentMethodSection 
        paymentMethod={paymentMethod}
      />
      
      {/* Payment Summary Section */}
      <PaymentSummarySection 
        amount={amount}
        platformFee={platformFee}
        gatewayFee={gatewayFee}
        totalAmount={totalAmount}
        rewardPoints={rewardPoints}
      />

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button className="flex-1">Confirm Payment</Button>
      </div>

      {/* Employees Dialog */}
      <EmployeesDialog 
        open={showEmployeesDialog}
        onOpenChange={setShowEmployeesDialog}
        employees={employees}
      />
    </div>
  );
};
