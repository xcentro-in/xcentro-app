
import { CreditCard, BanknoteIcon, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Transaction {
  id: number;
  vendor: string;
  amount: number;
  status: string;
  date: string;
  method: string;
}

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList = ({ transactions }: TransactionListProps) => {
  return (
    <div className="divide-y">
      {transactions.length > 0 ? (
        transactions.map((transaction) => (
          <div 
            key={transaction.id}
            className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_1fr_auto_auto] items-center gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full",
                transaction.method === "credit" ? "bg-primary/10" : "bg-purple-500/10"
              )}>
                {transaction.method === "credit" ? (
                  <CreditCard className="h-5 w-5 text-primary" />
                ) : (
                  <BanknoteIcon className="h-5 w-5 text-purple-500" />
                )}
              </div>
              <div>
                <div className="font-medium truncate max-w-[150px] sm:max-w-none">{transaction.vendor}</div>
                <div className="text-xs text-muted-foreground">{transaction.date}</div>
              </div>
            </div>
            
            <div className="hidden sm:block"></div>
            
            <div className="text-right font-medium">
              ${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            
            <div className="flex justify-end">
              {transaction.status === "completed" && (
                <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-600 text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              )}
              {transaction.status === "pending" && (
                <Badge variant="outline" className="bg-amber-500/10 border-amber-500/20 text-amber-600 text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  Pending
                </Badge>
              )}
              {transaction.status === "upcoming" && (
                <Badge variant="outline" className="bg-blue-500/10 border-blue-500/20 text-blue-600 text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  Upcoming
                </Badge>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No transactions found matching your filters.</p>
        </div>
      )}
    </div>
  );
};
