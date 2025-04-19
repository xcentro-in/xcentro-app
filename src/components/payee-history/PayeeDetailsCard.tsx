import { 
  BankPayee, 
  BillerPayee, 
  Payee, 
  PayrollPayee 
} from "@/types/payee";
import { getPayeeIcon } from "@/utils/payeeUtils";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PayeeInfoCard } from "./PayeeInfoCard"; // Corrected import path

interface PayeeDetailsCardProps {
  payee: Payee;
  totalPaid: number;
  lastTransactionDate: string | null;
}

export const PayeeDetailsCard = ({ 
  payee, 
  totalPaid, 
  lastTransactionDate 
}: PayeeDetailsCardProps) => {
  const navigate = useNavigate();

  const getPayeeInfo = () => {
    if (!payee) return [];

    switch (payee.type) {
      case "bank": {
        const bankPayee = payee as BankPayee;
        return [
          { label: "Bank Name", value: bankPayee.bankName },
          { label: "Account Number", value: bankPayee.accountNumber },
          { label: "Total Amount Paid", value: `₹ ${totalPaid.toLocaleString()}` },
          { label: "Last Payment", value: lastTransactionDate ? new Date(lastTransactionDate).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }) : "No payments yet" }
        ];
      }
      case "biller": {
        const billerPayee = payee as BillerPayee;
        return [
          { label: "Biller Name", value: billerPayee.billerName },
          { label: "Customer ID", value: billerPayee.customerId },
          { label: "Billing Cycle", value: billerPayee.billingCycle },
          { label: "Total Amount Paid", value: `₹ ${totalPaid.toLocaleString()}` },
          { label: "Last Payment", value: lastTransactionDate ? new Date(lastTransactionDate).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }) : "No payments yet" }
        ];
      }
      case "payroll": {
        const payrollPayee = payee as PayrollPayee;
        return [
          { label: "Bank Name", value: payrollPayee.bankName },
          { label: "Account Number", value: payrollPayee.accountNumber },
          { label: "Salary Type", value: payrollPayee.salaryType },
          { label: "Total Amount Paid", value: `₹ ${totalPaid.toLocaleString()}` },
          { label: "Last Payment", value: lastTransactionDate ? new Date(lastTransactionDate).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }) : "No payments yet" }
        ];
      }
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">{payee.name}</h1>
      </div>
      <Card className="border-0 shadow-none">
        <PayeeInfoCard info={getPayeeInfo()} />
      </Card>
    </div>
  );
};