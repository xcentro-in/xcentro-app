
import { format } from "date-fns";
import { FileText } from "lucide-react";
import { PaymentType } from "../PaymentDetailsStep";
import { TransactionDetailCard } from "@/components/transactions/TransactionDetailCard";

interface PaymentDetailsSectionProps {
  paymentType: PaymentType;
  scheduledDate?: Date;
  description: string;
  invoiceReference: string;
  frequency?: string;
}

export const PaymentDetailsSection = ({
  paymentType,
  scheduledDate,
  description,
  invoiceReference,
  frequency,
}: PaymentDetailsSectionProps) => {
  return (
    <TransactionDetailCard title="Payment Details" className="h-full">
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
  );
};
