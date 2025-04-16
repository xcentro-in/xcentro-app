import { format, formatDistanceToNow } from "date-fns";
import { TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ApprovalTransaction } from "@/types/approval";
import ApprovalStatusBadge from "./ApprovalStatusBadge";
import ApprovalTransactionActions from "./ApprovalTransactionActions";
import { TransactionPaymentMethod } from "@/components/transactions/TransactionPaymentMethod";

interface ApprovalTransactionRowProps {
  transaction: ApprovalTransaction;
  isSelected: boolean;
  onSelectTransaction: (id: string) => void;
  onRowClick: (transaction: ApprovalTransaction) => void;
  onApprove: (id: string) => void;
  onReject: (transaction: ApprovalTransaction) => void;
  onFlag: (id: string) => void;
  onRequestChanges: (transaction: ApprovalTransaction) => void;
}

const ApprovalTransactionRow = ({
  transaction,
  isSelected,
  onSelectTransaction,
  onRowClick,
  onApprove,
  onReject,
  onFlag,
  onRequestChanges
}: ApprovalTransactionRowProps) => {
  return (
    <TableRow 
      className={cn(
        !transaction.isRead && "bg-muted/30 font-medium",
        transaction.status === "urgent" && "bg-red-50/50",
        transaction.status === "flagged" && "bg-amber-50/50"
      )}
    >
      <TableCell>
        <Checkbox 
          checked={isSelected}
          onCheckedChange={() => onSelectTransaction(transaction.id)}
          onClick={(e) => e.stopPropagation()}
        />
      </TableCell>
      <TableCell 
        className="font-medium cursor-pointer hover:text-primary"
        onClick={() => onRowClick(transaction)}
      >
        <div className="flex items-center gap-2">
          <TransactionPaymentMethod method={transaction.paymentMethod} variant="icon" size="sm" />
          <span className="capitalize">{transaction.paymentMethod}</span>
        </div>
      </TableCell>
      <TableCell 
        className="cursor-pointer hover:text-primary"
        onClick={() => onRowClick(transaction)}
      >
        {transaction.payee}
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span>{transaction.initiatedBy}</span>
          <span className="text-xs text-muted-foreground">{transaction.initiatorRole}</span>
        </div>
      </TableCell>
      <TableCell className="text-right font-medium">
        <div className="flex items-center justify-end gap-2">
          <TransactionPaymentMethod method={transaction.paymentMethod} variant="icon" size="sm" />
          ${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
      </TableCell>
      <TableCell><ApprovalStatusBadge status={transaction.status} /></TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span>
            {format(new Date(transaction.requestedDate), "MMM d, yyyy")}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(transaction.requestedDate), { addSuffix: true })}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <ApprovalTransactionActions 
          transaction={transaction}
          onApprove={onApprove}
          onReject={onReject}
          onFlag={onFlag}
          onRequestChanges={onRequestChanges}
        />
      </TableCell>
    </TableRow>
  );
};

export default ApprovalTransactionRow;