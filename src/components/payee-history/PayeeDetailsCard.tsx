
import { 
  BankPayee, 
  BillerPayee, 
  Payee, 
  PayrollPayee 
} from "@/types/payee";
import { getPayeeIcon } from "@/utils/payeeUtils";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
  
  // Get payee-specific details
  const getPayeeInfo = () => {
    if (!payee) return [];

    switch (payee.type) {
      case "bank": {
        const bankPayee = payee as BankPayee;
        return [
          { label: "Bank Name", value: bankPayee.bankName },
          { label: "Account Number", value: bankPayee.accountNumber },
          { label: "GSTIN", value: bankPayee.gstin || 'N/A' },
        ];
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
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/payees")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Payees
        </Button>
        <div className="flex gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            Export
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            Print
          </Button>
        </div>
      </div>

      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-[#1A1F2C] mb-8">
          {payee.name}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg border p-8">
          {/* Left column - Payee Information */}
          <div className="space-y-8">
            {payeeInfo.map((info, index) => (
              <div key={index} className="space-y-1">
                <p className="text-[#8E9196] text-lg">{info.label}</p>
                <p className="text-2xl text-[#1A1F2C]">{info.value}</p>
              </div>
            ))}
          </div>

          {/* Right column - Payment Information */}
          <div className="space-y-8">
            <div className="space-y-1">
              <p className="text-[#8E9196] text-lg">Total Amount Paid</p>
              <p className="text-2xl text-[#1A1F2C]">₹{totalPaid.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[#8E9196] text-lg">Last Payment</p>
              <p className="text-2xl text-[#1A1F2C]">
                {lastTransactionDate 
                  ? new Date(lastTransactionDate).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
