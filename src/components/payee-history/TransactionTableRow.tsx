import { format } from "date-fns";
import { TableCell, TableRow } from "@/components/ui/table";
import { Transaction } from "@/types/transaction";
import { TransactionStatusBadge } from "@/components/transactions/TransactionStatusBadge";
import { TransactionPaymentMethod } from "@/components/transactions/TransactionPaymentMethod";

interface TransactionTableRowProps {
  transaction: Transaction;
  onRowClick: (transactionId: string) => void;
}

export const TransactionTableRow = ({ 
  transaction, 
  onRowClick 
}: TransactionTableRowProps) => {
  return (
    <TableRow 
      key={transaction.id}
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => onRowClick(transaction.transactionId)}
    >
      <TableCell className="font-medium">
        {transaction.invoice || transaction.transactionId}
      </TableCell>
      <TableCell className="text-right">
        ₹{transaction.amount.toLocaleString()}
      </TableCell>
      <TableCell>
        {format(new Date(transaction.date), 'dd MMM yyyy')}
      </TableCell>
      <TableCell>
        <TransactionStatusBadge status={transaction.status} />
      </TableCell>
      <TableCell>
        <TransactionPaymentMethod method={transaction.method} variant="badge" />
      </TableCell>
      <TableCell className="max-w-[200px] truncate">
        {transaction.description || "N/A"}
      </TableCell>
    </TableRow>
  );
};
