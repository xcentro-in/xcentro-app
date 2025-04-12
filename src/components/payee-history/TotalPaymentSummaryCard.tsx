import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

interface TotalPaymentSummaryCardProps {
  totalPaid: number;
  lastTransactionDate: string | null;
}

export const TotalPaymentSummaryCard = ({ totalPaid, lastTransactionDate }: TotalPaymentSummaryCardProps) => (
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
);
