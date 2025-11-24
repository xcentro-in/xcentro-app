import { TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ApprovalTransaction } from "@/types/approval";
import ApprovalTransactionActions from "./ApprovalTransactionActions";
import { formatCurrency } from "@/utils/formatters";
import { formatPaymentDate } from "@/utils/dateFormatting";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

interface ApprovalTransactionRowProps {
  transaction: ApprovalTransaction;
  isSelected: boolean;
  onSelectTransaction: (id: string) => void;
  onRowClick: (transaction: ApprovalTransaction) => void;
  onApprove: (id: string) => void;
  onReject: (transaction: ApprovalTransaction) => void;
  onRequestChanges: (transaction: ApprovalTransaction) => void;
  showActions?: boolean;
}

const ApprovalTransactionRow = ({
  transaction,
  isSelected,
  onSelectTransaction,
  onRowClick,
  onApprove,
  onReject,
  onRequestChanges,
  showActions = true
}: ApprovalTransactionRowProps) => {
  // Helper to get approval status badge
  const getApprovalStatusBadge = () => {
    switch (transaction.status) {
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      case 'request_changes':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Changes Requested
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <TableRow
      className="hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={() => onRowClick(transaction)}
    >
      {showActions && (
        <TableCell onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelectTransaction(transaction.id)}
            onClick={(e) => e.stopPropagation()}
          />
        </TableCell>
      )}

      {/* Vendor */}
      <TableCell className="font-medium">
        <div className="font-semibold">{transaction.payee}</div>
      </TableCell>

      {/* Invoice # */}
      <TableCell>
        <div className="font-mono text-sm">{transaction.invoiceNumber}</div>
      </TableCell>

      {/* Due Date */}
      <TableCell>
        <div className="text-sm">
          {formatPaymentDate(transaction.dueDate)}
        </div>
      </TableCell>

      {/* Amount */}
      <TableCell className="text-right font-medium">
        {formatCurrency(transaction.amount)}
      </TableCell>

      {/* Approval Status */}
      <TableCell>
        <div className="flex items-center justify-center">
          {getApprovalStatusBadge()}
        </div>
      </TableCell>

      {/* Actions */}
      {showActions && (
        <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
          <ApprovalTransactionActions
            transaction={transaction}
            onApprove={onApprove}
            onReject={onReject}
            onRequestChanges={onRequestChanges}
          />
        </TableCell>
      )}
    </TableRow>
  );
};

export default ApprovalTransactionRow;