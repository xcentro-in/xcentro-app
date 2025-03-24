
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CreditCard, BanknoteIcon } from "lucide-react";

interface Transaction {
  id: number;
  vendor: string;
  amount: number;
  status: string;
  date: string;
  method: string;
  category: string;
}

interface TransactionRowProps {
  transaction: Transaction;
  onClick: (id: number) => void;
}

const TransactionRow = ({ transaction, onClick }: TransactionRowProps) => {
  return (
    <div 
      key={transaction.id}
      className="grid grid-cols-[1.5fr_1fr_0.8fr_0.8fr_0.8fr] gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer"
      onClick={() => onClick(transaction.id)}
    >
      <div className="flex items-center gap-2">
        <div className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full",
          transaction.method === "credit" ? "bg-primary/10" : "bg-purple-500/10"
        )}>
          {transaction.method === "credit" ? (
            <CreditCard className="h-4 w-4 text-primary" />
          ) : (
            <BanknoteIcon className="h-4 w-4 text-purple-500" />
          )}
        </div>
        <div>
          <div className="font-medium">{transaction.vendor}</div>
          <div className="text-xs text-muted-foreground capitalize">
            {transaction.method === "credit" ? "Credit Card" : "Bank Transfer"}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col justify-center">
        <div className="text-sm">{transaction.date}</div>
      </div>
      
      <div className="flex items-center justify-end font-medium">
        ${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      
      <div className="flex items-center justify-center">
        <Badge variant="outline" className="capitalize">
          {transaction.category}
        </Badge>
      </div>
      
      <div className="flex items-center justify-center">
        {transaction.status === "completed" && (
          <Badge className="bg-green-500/10 border-green-500/20 text-green-600 text-xs capitalize">
            Completed
          </Badge>
        )}
        {transaction.status === "pending" && (
          <Badge className="bg-amber-500/10 border-amber-500/20 text-amber-600 text-xs capitalize">
            Processing
          </Badge>
        )}
        {transaction.status === "upcoming" && (
          <Badge className="bg-blue-500/10 border-blue-500/20 text-blue-600 text-xs capitalize">
            Scheduled
          </Badge>
        )}
        {transaction.status === "failed" && (
          <Badge className="bg-red-500/10 border-red-500/20 text-red-600 text-xs capitalize">
            Failed
          </Badge>
        )}
      </div>
    </div>
  );
};

export default TransactionRow;
