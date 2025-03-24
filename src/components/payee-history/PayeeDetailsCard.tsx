
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { 
  BankPayee, 
  BillerPayee, 
  Payee, 
  PayrollPayee 
} from "@/types/payee";

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
  const getPayeeDetails = () => {
    if (!payee) return null;
    
    switch (payee.type) {
      case "bank":
        const bankPayee = payee as BankPayee;
        return (
          <div className="flex flex-col gap-1 text-sm">
            <div><span className="font-medium">Bank:</span> {bankPayee.bankName}</div>
            <div><span className="font-medium">Account:</span> ****{bankPayee.accountNumber.slice(-4)}</div>
            {bankPayee.gstin && <div><span className="font-medium">GSTIN:</span> {bankPayee.gstin}</div>}
          </div>
        );
      case "biller":
        const billerPayee = payee as BillerPayee;
        return (
          <div className="flex flex-col gap-1 text-sm">
            <div><span className="font-medium">Biller:</span> {billerPayee.billerName}</div>
            <div><span className="font-medium">Customer ID:</span> {billerPayee.customerId}</div>
            <div><span className="font-medium">Billing Cycle:</span> {billerPayee.billingCycle}</div>
          </div>
        );
      case "payroll":
        const payrollPayee = payee as PayrollPayee;
        return (
          <div className="flex flex-col gap-1 text-sm">
            <div><span className="font-medium">Bank:</span> {payrollPayee.bankName}</div>
            <div><span className="font-medium">Account:</span> ****{payrollPayee.accountNumber.slice(-4)}</div>
            <div><span className="font-medium">Salary Type:</span> {payrollPayee.salaryType}</div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight animate-slide-up">
          {payee.name}
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="capitalize">{payee.type}</Badge>
          {payee.type === "bank" && (payee as BankPayee).gstin && (
            <Badge variant="outline">GST Registered</Badge>
          )}
        </div>
        <div className="mt-2">
          {getPayeeDetails()}
        </div>
      </div>
    </div>
  );
};
