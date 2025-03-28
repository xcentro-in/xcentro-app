
import { User, Eye } from "lucide-react";
import { Payee } from "@/types/payee";
import { TransactionDetailCard } from "@/components/transactions/TransactionDetailCard";

interface Employee {
  name: string;
  email: string;
  accountNumber: string;
  bankName: string;
  salaryAmount: number;
}

interface PayeeSectionProps {
  payee?: Payee;
  employees?: Employee[];
  onViewEmployees?: () => void;
}

export const PayeeSection = ({
  payee,
  employees = [],
  onViewEmployees,
}: PayeeSectionProps) => {
  const isPayroll = payee?.type === "payroll";
  const isBulkPayment = isPayroll && employees.length > 0;

  return (
    <TransactionDetailCard title="Payee Information" className="h-full">
      {payee ? (
        <div 
          className={`flex items-start gap-3 p-2 ${isBulkPayment ? "cursor-pointer hover:bg-muted/50 rounded-md" : ""}`}
          onClick={() => isBulkPayment && onViewEmployees && onViewEmployees()}
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
                {isBulkPayment && (
                  <div className="flex items-center mt-2 text-primary">
                    <Eye className="h-4 w-4 mr-1" /> 
                    <span className="text-sm">View all {employees.length} {employees.length === 1 ? 'payee' : 'payees'}</span>
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
  );
};
