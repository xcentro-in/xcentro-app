
import { CreditCardBill } from "@/types/credit-card-bill";
import { format, parseISO } from "date-fns";

interface BillSummaryProps {
  bill: CreditCardBill;
}

export default function BillSummary({ bill }: BillSummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-4 py-2">
      <div>
        <p className="text-sm text-muted-foreground">Statement Date</p>
        <p className="font-medium">
          {bill.statementDate 
            ? format(parseISO(bill.statementDate), "dd MMM yyyy") 
            : "N/A"}
        </p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Due Date</p>
        <p className="font-medium">
          {format(parseISO(bill.dueDate), "dd MMM yyyy")}
        </p>
      </div>
    </div>
  );
}
