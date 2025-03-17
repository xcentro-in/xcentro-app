
import { Button } from "@/components/ui/button";
import { CheckCircle2, X, Flag, PenLine } from "lucide-react";
import { ApprovalTransaction } from "@/types/approval";

interface ApprovalTransactionActionsProps {
  transaction: ApprovalTransaction;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onFlag: (id: string) => void;
  onRequestChanges: (transaction: ApprovalTransaction) => void;
}

const ApprovalTransactionActions = ({
  transaction,
  onApprove,
  onReject,
  onFlag,
  onRequestChanges
}: ApprovalTransactionActionsProps) => {
  if (transaction.status !== "pending" && 
      transaction.status !== "urgent" && 
      transaction.status !== "flagged") {
    return null;
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Button 
        size="sm" 
        variant="ghost" 
        className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
        onClick={(e) => { e.stopPropagation(); onApprove(transaction.id); }}
        title="Approve"
      >
        <CheckCircle2 className="h-4 w-4" />
      </Button>
      <Button 
        size="sm" 
        variant="ghost" 
        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={(e) => { e.stopPropagation(); onReject(transaction.id); }}
        title="Reject"
      >
        <X className="h-4 w-4" />
      </Button>
      <Button 
        size="sm" 
        variant="ghost" 
        className="h-8 w-8 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
        onClick={(e) => { e.stopPropagation(); onFlag(transaction.id); }}
        title="Flag for Review"
      >
        <Flag className="h-4 w-4" />
      </Button>
      <Button 
        size="sm" 
        variant="ghost" 
        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        onClick={(e) => { e.stopPropagation(); onRequestChanges(transaction); }}
        title="Request Changes"
      >
        <PenLine className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ApprovalTransactionActions;
