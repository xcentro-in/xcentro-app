
import { Button } from "@/components/ui/button";
import { CheckCircle2, X, Flag, PenLine } from "lucide-react";
import { ApprovalTransaction } from "@/types/approval";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface ApprovalTransactionActionsProps {
  transaction: ApprovalTransaction;
  onApprove: (id: string) => void;
  onReject: (transaction: ApprovalTransaction) => void;
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
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showFlagDialog, setShowFlagDialog] = useState(false);
  const [flagReason, setFlagReason] = useState("");

  const handleApproveConfirm = () => {
    onApprove(transaction.id);
    setShowApproveDialog(false);
  };

  const handleFlagConfirm = () => {
    if (flagReason.trim()) {
      onFlag(transaction.id);
      setShowFlagDialog(false);
      setFlagReason("");
    }
  };

  if (transaction.status !== "pending" && 
      transaction.status !== "urgent" && 
      transaction.status !== "flagged") {
    return null;
  }

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
          onClick={(e) => { e.stopPropagation(); setShowApproveDialog(true); }}
          title="Approve"
        >
          <CheckCircle2 className="h-4 w-4" />
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={(e) => { e.stopPropagation(); onReject(transaction); }}
          title="Reject"
        >
          <X className="h-4 w-4" />
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-8 w-8 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
          onClick={(e) => { e.stopPropagation(); setShowFlagDialog(true); }}
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

      <Dialog open={showFlagDialog} onOpenChange={setShowFlagDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Flag Transaction</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Please provide a reason for flagging this transaction..."
            value={flagReason}
            onChange={(e) => setFlagReason(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFlagDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleFlagConfirm}
              disabled={!flagReason.trim()}
              className="bg-amber-500 hover:bg-amber-600"
            >
              Flag Transaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApprovalTransactionActions;
