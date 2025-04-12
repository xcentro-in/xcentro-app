
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card className="bg-slate-50/50">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Bank Name</p>
                    <p className="text-lg font-medium">{bankPayee.bankName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account Number</p>
                    <p className="text-lg font-medium tracking-wider font-mono">
                      **** **** {bankPayee.accountNumber.slice(-4)}
                    </p>
                  </div>
                  {bankPayee.gstin && (
                    <div>
                      <p className="text-sm text-muted-foreground">GSTIN</p>
                      <p className="text-lg font-medium tracking-wider font-mono">{bankPayee.gstin}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Amount Paid</p>
                  <p className="text-3xl font-bold text-purple-600">₹{totalPaid.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    Last payment: {lastTransactionDate ? format(new Date(lastTransactionDate), 'dd MMM yyyy') : 'N/A'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "biller":
        const billerPayee = payee as BillerPayee;
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card className="bg-slate-50/50">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Biller Name</p>
                    <p className="text-lg font-medium">{billerPayee.billerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Customer ID</p>
                    <p className="text-lg font-medium tracking-wider font-mono">{billerPayee.customerId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Billing Cycle</p>
                    <p className="text-lg font-medium">{billerPayee.billingCycle}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Amount Paid</p>
                  <p className="text-3xl font-bold text-purple-600">₹{totalPaid.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    Last payment: {lastTransactionDate ? format(new Date(lastTransactionDate), 'dd MMM yyyy') : 'N/A'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "payroll":
        const payrollPayee = payee as PayrollPayee;
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card className="bg-slate-50/50">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Bank Name</p>
                    <p className="text-lg font-medium">{payrollPayee.bankName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account Number</p>
                    <p className="text-lg font-medium tracking-wider font-mono">
                      **** **** {payrollPayee.accountNumber.slice(-4)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Salary Type</p>
                    <p className="text-lg font-medium">{payrollPayee.salaryType}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Amount Paid</p>
                  <p className="text-3xl font-bold text-purple-600">₹{totalPaid.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    Last payment: {lastTransactionDate ? format(new Date(lastTransactionDate), 'dd MMM yyyy') : 'N/A'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
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
      </div>
      {getPayeeDetails()}
    </div>
  );
};
