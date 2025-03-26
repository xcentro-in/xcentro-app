
import { CreditCard, BanknoteIcon } from "lucide-react";
import { Transaction } from "@/types/transaction";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TransactionRowProps {
  transaction: Transaction;
  onClick: (id: number | string) => void;
}

const TransactionRow = ({ transaction, onClick }: TransactionRowProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div 
      className="grid grid-cols-[1.5fr_1fr_0.8fr_0.8fr_0.8fr] gap-4 p-4 hover:bg-muted/50 cursor-pointer"
      onClick={() => onClick(transaction.id)}
    >
      <div className="flex flex-col">
        <span className="font-medium">{transaction.vendor}</span>
        <div className="flex items-center mt-1 text-sm text-muted-foreground">
          {transaction.method === "credit" ? (
            <CreditCard className="h-3 w-3 mr-1" />
          ) : (
            <BanknoteIcon className="h-3 w-3 mr-1" />
          )}
          <span>
            {transaction.method === "credit" ? "Credit Card" : "Bank Transfer"}
          </span>
        </div>
      </div>
      
      <div className="flex items-center">
        <span className="text-sm">{transaction.date}</span>
      </div>
      
      <div className="flex items-center justify-end font-medium">
        ${transaction.amount.toFixed(2)}
      </div>
      
      <div className="flex items-center justify-center">
        <span className="capitalize text-sm">
          {transaction.category ?? "N/A"}
        </span>
      </div>
      
      <div className="flex items-center justify-center">
        <Badge 
          variant="outline" 
          className={cn("capitalize", getStatusColor(transaction.status))}
        >
          {transaction.status}
        </Badge>
      </div>
    </div>
  );
};

export default TransactionRow;
