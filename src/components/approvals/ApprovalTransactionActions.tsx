
import { Button } from "@/components/ui/button";
import { CheckCircle2, X, PenLine, MoreVertical } from "lucide-react";
import { ApprovalTransaction } from "@/types/approval";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface ApprovalTransactionActionsProps {
  transaction: ApprovalTransaction;
  onApprove: (id: string) => void;
  onReject: (transaction: ApprovalTransaction) => void;
  onRequestChanges: (transaction: ApprovalTransaction) => void;
}

const ApprovalTransactionActions = ({
  transaction,
  onApprove,
  onReject,
  onRequestChanges
}: ApprovalTransactionActionsProps) => {
  const [showApproveDialog, setShowApproveDialog] = useState(false);

  const handleApproveConfirm = () => {
    onApprove(transaction.id);
    setShowApproveDialog(false);
  };

  if (transaction.status !== "pending" && transaction.status !== "request_changes") {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="text-green-600"
            onClick={(e) => { e.stopPropagation(); setShowApproveDialog(true); }}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Approve
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600"
            onClick={(e) => { e.stopPropagation(); onReject(transaction); }}
          >
            <X className="h-4 w-4 mr-2" />
            Reject
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-blue-600"
            onClick={(e) => { e.stopPropagation(); onRequestChanges(transaction); }}
          >
            <PenLine className="h-4 w-4 mr-2" />
            Request Changes
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Approval</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to approve this transaction?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>Cancel</Button>
            <Button onClick={handleApproveConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApprovalTransactionActions;
