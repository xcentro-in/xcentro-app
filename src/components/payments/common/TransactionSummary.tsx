
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PaymentMethodSection } from "../summary/PaymentMethodSection";
import { PayeeSection } from "../summary/PayeeSection";
import { PaymentDetailsSection } from "../summary/PaymentDetailsSection";
import { PaymentSummarySection } from "../summary/PaymentSummarySection";
import { PaymentScheduleType } from "./PaymentScheduleSelector";
import { PaymentMethod } from "@/types/payment-method";
import { Payee } from "@/types/payee";
import { RewardPackage } from "./RewardTopUpStep";
import { Employee } from "../payroll/types";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/formatters";

export interface TransactionSummaryProps {
  paymentType: PaymentScheduleType;
  scheduledDate?: Date;
  amount: number;
  description: string;
  invoiceReference: string;
  payee: Payee;
  paymentMethod?: PaymentMethod;
  platformFee: number;
  gatewayFee: number;
  rewardPackage?: RewardPackage | null;
  totalAmount: number;
  rewardPoints: number;
  frequency?: string;
  onBack: () => void;
  onSubmit?: () => void;
  employees?: Employee[];
}

export const TransactionSummary = ({
  paymentType,
  scheduledDate,
  amount,
  description,
  invoiceReference,
  payee,
  paymentMethod,
  platformFee,
  gatewayFee,
  rewardPackage,
  totalAmount,
  rewardPoints,
  frequency,
  onBack,
  onSubmit,
  employees = []
}: TransactionSummaryProps) => {
  const [isEmployeesDialogOpen, setIsEmployeesDialogOpen] = useState(false);
  const { bankName, accountNumber } = payee as any;

  const renderBankInfo = () => {
    return (
      <>
        {bankName && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Bank Name</span>
            <span>
              {payee.type === "bank" || payee.type === "payroll" 
                ? payee.bankName 
                : "-"}
            </span>
          </div>
        )}

        {accountNumber && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Account Number</span>
            <span>
              {payee.type === "bank" || payee.type === "payroll"
                ? '••••' + payee.accountNumber.slice(-4)
                : "-"}
            </span>
          </div>
        )}
      </>
    );
  };

  // Calculate total reward cost if applicable
  const rewardCost = rewardPackage ? (amount * (rewardPackage.percentage / 100)) : 0;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">Review & Confirm</h2>
        <p className="text-muted-foreground">
          Please verify all payment details before proceeding
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PayeeSection 
          payee={payee}
          employees={employees}
          onViewEmployees={() => setIsEmployeesDialogOpen(true)}
        />
        <PaymentDetailsSection 
          paymentType={paymentType}
          scheduledDate={scheduledDate}
          description={description}
          invoiceReference={invoiceReference}
          frequency={frequency}
        />
      </div>

      <PaymentMethodSection paymentMethod={paymentMethod} />

      {/* Reward package info */}
      {rewardPackage && (
        <Card className="mt-4">
          <div className="p-4">
            <h3 className="font-medium mb-2">Reward Top-Up</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Package</span>
                <span>{rewardPackage.name} ({rewardPackage.percentage}%)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span>{formatCurrency(rewardCost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Points Multiplier</span>
                <span>x{rewardPackage.multiplier}</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      <PaymentSummarySection
        amount={amount}
        platformFee={platformFee}
        gatewayFee={gatewayFee}
        totalAmount={totalAmount}
        rewardPoints={rewardPoints}
      />

      {renderBankInfo()}

      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="w-auto"
        >
          Back
        </Button>
        {onSubmit && (
          <Button 
            onClick={onSubmit}
            className="w-auto"
          >
            Confirm Payment
          </Button>
        )}
      </div>

      {/* Dialog for showing employee details in bulk payments */}
      <Dialog open={isEmployeesDialogOpen} onOpenChange={setIsEmployeesDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Employee Payment Details</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Bank Name</TableHead>
                  <TableHead>Account Number</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {employee.name}
                      <div className="text-xs text-muted-foreground">{employee.email}</div>
                    </TableCell>
                    <TableCell>{employee.bankName}</TableCell>
                    <TableCell>••••{employee.accountNumber.slice(-4)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(employee.salaryAmount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
