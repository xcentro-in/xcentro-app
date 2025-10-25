
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionStatusBadge } from "@/components/transactions/TransactionStatusBadge";
import { TransactionStatus } from "@/types/transaction";
import { format } from "date-fns";
import { RefreshCcw } from "lucide-react";

interface TransactionInfoProps {
  transactionId: string;
  transactionDate: string;
  transactionStatus: TransactionStatus;
  transactionType: 'single' | 'recurring' | 'batch';
}

export const TransactionInfo = ({ transactionId, transactionDate, transactionStatus, transactionType }: TransactionInfoProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Transaction Info</CardTitle>
        <TransactionStatusBadge status={transactionStatus} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm text-muted-foreground">Transaction ID</div>
          <div className="font-medium">{transactionId}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Transaction Date</div>
          <div className="font-medium">{format(new Date(transactionDate), "MMMM d, yyyy 'at' h:mm a")}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Transaction Type</div>
          <div className="flex items-center gap-2 font-medium">
            {transactionType === "recurring" ? (
              <>
                <RefreshCcw className="h-4 w-4 text-blue-500" />
                Recurring Payment
              </>
            ) : transactionType === "batch" ? (
              <>
                <div className="h-4 w-4 flex items-center justify-center">
                  <div className="h-3 w-3 bg-purple-100 rounded-sm border border-purple-300"></div>
                  <div className="h-3 w-3 bg-purple-100 rounded-sm border border-purple-300 -ml-1.5 -mt-1.5"></div>
                </div>
                Batch Payment
              </>
            ) : (
              <>
                <div className="h-4 w-4 flex items-center justify-center">
                  <div className="h-3 w-3 bg-gray-100 rounded-sm border border-gray-300"></div>
                </div>
                Single Payment
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
