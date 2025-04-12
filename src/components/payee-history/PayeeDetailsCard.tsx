import { 
  BankPayee, 
  BillerPayee, 
  Payee, 
  PayrollPayee 
} from "@/types/payee";
import { getPayeeIcon } from "@/utils/payeeUtils";
import { TotalPaymentSummaryCard } from "./TotalPaymentSummaryCard"
import { PayeeInfoCard } from "./PayeeInfoCard"

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
  
  // Get payee-specific details
  const getPayeeInfo = () => {
    if (!payee) return [];

    switch (payee.type) {
      case "bank": {
        const bankPayee = payee as BankPayee;
        const info = [
          { label: "Bank Name", value: bankPayee.bankName },
          { label: "Account Number", value: bankPayee.accountNumber },
        ];
        // Optionally add GSTIN if available
        if (bankPayee.gstin) {
          info.push({ label: "GSTIN", value: bankPayee.gstin });
        }
        return info;
      }
      case "biller": {
        const billerPayee = payee as BillerPayee;
        return [
          { label: "Biller Name", value: billerPayee.billerName },
          { label: "Customer ID", value: billerPayee.customerId },
          { label: "Billing Cycle", value: billerPayee.billingCycle },
        ];
      }
      case "payroll": {
        const payrollPayee = payee as PayrollPayee;
        return [
          { label: "Bank Name", value: payrollPayee.bankName },
          { label: "Account Number", value: payrollPayee.accountNumber },
          { label: "Salary Type", value: payrollPayee.salaryType },
        ];
      }
      default:
        return [];
    }
  };

  const payeeInfo = getPayeeInfo();

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2">
          {getPayeeIcon(payee.type)}
          <h1 className="text-3xl font-bold tracking-tight animate-slide-up">
            {payee.name}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <PayeeInfoCard info={payeeInfo} />
        <TotalPaymentSummaryCard totalPaid={totalPaid} lastTransactionDate={lastTransactionDate} />
      </div>
    </div>
  );
};
