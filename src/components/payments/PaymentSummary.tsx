
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { PaymentType } from "./PaymentDetailsStep";
import { Payee } from "@/types/payee";
import { PaymentMethod } from "@/types/payment-method";
import { CreditCard, FileText, User, Wallet, DollarSign, Award, Table, Eye } from "lucide-react";
import { TransactionDetailCard } from "@/components/transactions/TransactionDetailCard";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Employee {
  name: string;
  email: string;
  accountNumber: string;
  bankName: string;
  salaryAmount: number;
}

interface PaymentSummaryProps {
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

export const PaymentSummary = ({
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
}: PaymentSummaryProps) => {
  const [showEmployeesDialog, setShowEmployeesDialog] = useState(false);
  const isPayroll = payee?.type === "payroll";
  const isBulkPayroll = isPayroll && employees.length > 0;

  return (
    <div className="space-y-6">
      <h3 className="font-medium text-lg">Review Payment</h3>
      
      {/* Payment Details Section */}
      <TransactionDetailCard title="Payment Details" className="mt-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-2">
            <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="space-y-1.5">
              <p className="text-sm font-medium">Payment Type</p>
              <p className="text-sm text-muted-foreground">
                {paymentType === "now" ? "Immediate Payment" : 
                 paymentType === "later" ? "Scheduled Payment" : "Recurring Payment"}
              </p>
            </div>
          </div>
          
          {scheduledDate && (
            <div className="flex items-start gap-3 p-2">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1.5">
                <p className="text-sm font-medium">Scheduled Date</p>
                <p className="text-sm text-muted-foreground">{format(scheduledDate, "PPP")}</p>
              </div>
            </div>
          )}
          
          {paymentType === "recurring" && frequency && (
            <div className="flex items-start gap-3 p-2">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1.5">
                <p className="text-sm font-medium">Frequency</p>
                <p className="text-sm text-muted-foreground capitalize">{frequency}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-start gap-3 p-2">
            <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="space-y-1.5">
              <p className="text-sm font-medium">Description</p>
              <p className="text-sm text-muted-foreground">
                {description || <span className="italic">No description provided</span>}
              </p>
            </div>
          </div>
          
          {invoiceReference && (
            <div className="flex items-start gap-3 p-2">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1.5">
                <p className="text-sm font-medium">Invoice Reference</p>
                <p className="text-sm text-muted-foreground">{invoiceReference}</p>
              </div>
            </div>
          )}
        </div>
      </TransactionDetailCard>
      
      {/* Payee Section */}
      <TransactionDetailCard title="Payee Information" className="mt-4">
        {payee ? (
          <div 
            className={`flex items-start gap-3 p-2 ${isBulkPayroll ? "cursor-pointer hover:bg-muted/50 rounded-md" : ""}`}
            onClick={() => isBulkPayroll && setShowEmployeesDialog(true)}
          >
            <User className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="space-y-1.5 flex-1">
              <p className="text-sm font-medium">{payee.name}</p>
              <p className="text-sm text-muted-foreground">
                {payee.email}<br />
                {payee.contactNumber}
              </p>
              {payee.type === "bank" && (
                <p className="text-sm text-muted-foreground">
                  {payee.bankName} - Account ending with {payee.accountNumber.slice(-4)}
                </p>
              )}
              {payee.type === "biller" && (
                <p className="text-sm text-muted-foreground">
                  Biller: {payee.billerName} - Customer ID: {payee.customerId}
                </p>
              )}
              {payee.type === "payroll" && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {payee.bankName} - Account ending with {payee.accountNumber.slice(-4)}
                  </p>
                  {isBulkPayroll && (
                    <div className="flex items-center mt-2 text-primary">
                      <Eye className="h-4 w-4 mr-1" /> 
                      <span className="text-sm">View all {employees.length} employees</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground p-2">No payee selected</p>
        )}
      </TransactionDetailCard>
      
      {/* Payment Method Section */}
      <TransactionDetailCard title="Payment Method" className="mt-4">
        {paymentMethod ? (
          <div className="flex items-start gap-3 p-2">
            <Wallet className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="space-y-1.5">
              {paymentMethod.type === "card" && (
                <>
                  <p className="text-sm font-medium">
                    {paymentMethod.cardType.charAt(0).toUpperCase() + paymentMethod.cardType.slice(1)} ending in {paymentMethod.lastFourDigits}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {paymentMethod.cardholderName} - Expires {paymentMethod.expiryDate}
                  </p>
                </>
              )}
              {paymentMethod.type === "bank" && (
                <>
                  <p className="text-sm font-medium">
                    {paymentMethod.bankName} Account ending in {paymentMethod.lastFourDigits}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {paymentMethod.accountHolderName} - {paymentMethod.transactionType.toUpperCase()}
                  </p>
                </>
              )}
              {paymentMethod.type === "bnpl" && (
                <>
                  <p className="text-sm font-medium">
                    {paymentMethod.provider}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Repayment in {paymentMethod.repaymentTermDays} days
                  </p>
                </>
              )}
              {paymentMethod.type === "upi" && (
                <>
                  <p className="text-sm font-medium">
                    UPI: {paymentMethod.upiId}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {paymentMethod.linkedBank || "Linked bank account"}
                  </p>
                </>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground p-2">No payment method selected</p>
        )}
      </TransactionDetailCard>
      
      {/* Payment Summary Section */}
      <TransactionDetailCard title="Payment Summary" className="mt-4">
        <div className="p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-medium">${amount.toFixed(2)}</span>
          </div>
          
          <Separator className="my-2" />
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Platform Fee</span>
            <span className="font-medium">${platformFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Payment Gateway Fee</span>
            <span className="font-medium">${gatewayFee.toFixed(2)}</span>
          </div>
          
          <Separator className="my-2" />
          
          <div className="flex justify-between font-medium text-base">
            <span>Total Amount</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-sm text-green-600 bg-green-50 p-2 rounded-md items-center mt-3">
            <div className="flex items-center">
              <Award className="h-4 w-4 mr-2" />
              <span>Reward Points to be Earned</span>
            </div>
            <span className="font-medium">{rewardPoints} points</span>
          </div>
        </div>
      </TransactionDetailCard>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button className="flex-1">Confirm Payment</Button>
      </div>

      {/* Employees Dialog */}
      <Dialog open={showEmployeesDialog} onOpenChange={setShowEmployeesDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Employee Payment Details</DialogTitle>
          </DialogHeader>
          
          <div className="border rounded-md overflow-x-auto mt-4">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-2 font-medium text-sm">Name</th>
                  <th className="text-left p-2 font-medium text-sm">Email</th>
                  <th className="text-left p-2 font-medium text-sm">Bank Account</th>
                  <th className="text-left p-2 font-medium text-sm">Bank Name</th>
                  <th className="text-right p-2 font-medium text-sm">Salary Amount</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-muted/20"}>
                    <td className="p-2 text-sm">{employee.name}</td>
                    <td className="p-2 text-sm">{employee.email}</td>
                    <td className="p-2 text-sm">
                      {employee.accountNumber.slice(0, -4).replace(/./g, '•') + employee.accountNumber.slice(-4)}
                    </td>
                    <td className="p-2 text-sm">{employee.bankName}</td>
                    <td className="p-2 text-sm text-right">₹{employee.salaryAmount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-muted-foreground">
              Total Employees: {employees.length}
            </p>
            <p className="text-sm font-medium">
              Total Amount: ₹{employees.reduce((sum, emp) => sum + emp.salaryAmount, 0).toLocaleString()}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
