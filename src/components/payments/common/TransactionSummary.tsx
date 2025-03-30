
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
      
      {/* Two-column layout for Payee and Payment Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Payee Section - Left Column */}
        <PayeeSection 
          payee={payee}
          employees={employees}
          onViewEmployees={() => setShowEmployeesDialog(true)}
        />
        
        {/* Payment Details Section - Right Column */}
        <PaymentDetailsSection 
          paymentType={paymentType}
          scheduledDate={scheduledDate}
          description={description}
          invoiceReference={invoiceReference}
          frequency={frequency}
        />
      </div>
      
      {/* Payment Method Section - Full Width */}
      <PaymentMethodSection 
        paymentMethod={paymentMethod}
      />
      
      {/* Payment Summary Section - Full Width */}
      <PaymentSummarySection 
        amount={amount}
        platformFee={platformFee}
        gatewayFee={gatewayFee}
        totalAmount={totalAmount}
        rewardPoints={rewardPoints}
      />

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack} className="w-auto">Back</Button>
        <Button className="w-auto">Confirm Payment</Button>
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
