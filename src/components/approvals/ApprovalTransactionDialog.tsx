
import { format } from "date-fns";
import { Clock, CreditCard, BanknoteIcon, CheckCircle2, X, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ApprovalTransaction } from "@/types/approval";
import ApprovalStatusBadge from "./ApprovalStatusBadge";

interface ApprovalTransactionDialogProps {
  transaction: ApprovalTransaction | null;
  dialogType: "reject" | "changes" | "details";
  rejectReason: string;
  changesRequested: string;
  setRejectReason: (value: string) => void;
  setChangesRequested: (value: string) => void;
  onClose: () => void;
  onDialogTypeChange: (type: "reject" | "changes" | "details") => void;
  onApprove: (id: string) => void;
  onRejectConfirm: () => void;
  onChangesConfirm: () => void;
  onViewFullDetails: (id: string) => void;
}

const ApprovalTransactionDialog = ({
  transaction,
  dialogType,
  rejectReason,
  changesRequested,
  setRejectReason,
  setChangesRequested,
  onClose,
  onDialogTypeChange,
  onApprove,
  onRejectConfirm,
  onChangesConfirm,
  onViewFullDetails
}: ApprovalTransactionDialogProps) => {
  if (!transaction) return null;

  // Transaction Details Dialog
  if (dialogType === "details") {
    return (
      <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Full information about the transaction
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Transaction ID</p>
                <p className="font-medium">{transaction.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="mt-1"><ApprovalStatusBadge status={transaction.status} /></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payee</p>
                <p className="font-medium">{transaction.payee}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-medium">${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <div className="flex items-center gap-2 mt-1">
                  {transaction.paymentMethod === "credit" ? (
                    <>
                      <CreditCard className="h-4 w-4 text-primary" />
                      <span>Credit Card</span>
                    </>
                  ) : (
                    <>
                      <BanknoteIcon className="h-4 w-4 text-purple-500" />
                      <span>Bank Transfer</span>
                    </>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Requested Date</p>
                <p className="font-medium">{format(new Date(transaction.requestedDate), "PPP")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Initiated By</p>
                <p className="font-medium">{transaction.initiatedBy}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Initiator Role</p>
                <p className="font-medium">{transaction.initiatorRole}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p>{transaction.description}</p>
            </div>
            
            {transaction.notes && (
              <div>
                <p className="text-sm text-muted-foreground">Notes</p>
                <p className="p-3 bg-muted/50 rounded-md">{transaction.notes}</p>
              </div>
            )}
            
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-2">Transaction Timeline</p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-blue-500/10 flex items-center justify-center mt-0.5">
                    <Clock className="h-3 w-3 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Transaction Created</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(transaction.requestedDate), "PPP 'at' p")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-2 flex-row">
            {(transaction.status === "pending" || transaction.status === "urgent" || transaction.status === "flagged") && (
              <>
                <Button 
                  variant="outline" 
                  className="gap-1 bg-green-50 border-green-100 text-green-600 hover:bg-green-100 hover:text-green-700"
                  onClick={() => onApprove(transaction.id)}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Approve
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-1 bg-red-50 border-red-100 text-red-600 hover:bg-red-100 hover:text-red-700"
                  onClick={() => onDialogTypeChange("reject")}
                >
                  <X className="h-4 w-4" />
                  Reject
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-1"
                  onClick={() => onDialogTypeChange("changes")}
                >
                  <PenLine className="h-4 w-4" />
                  Request Changes
                </Button>
              </>
            )}
            <Button
              variant="default"
              className="ml-auto"
              onClick={() => onViewFullDetails(transaction.id)}
            >
              View Full Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Reject Dialog
  if (dialogType === "reject") {
    return (
      <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reject Transaction</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this transaction.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-24"
            />
          </div>
          
          <DialogFooter>
            <Button
              variant="outline" 
              onClick={() => onDialogTypeChange("details")}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={onRejectConfirm}
              disabled={rejectReason.trim() === ""}
            >
              Reject Transaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Request Changes Dialog
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Changes</DialogTitle>
          <DialogDescription>
            Specify what changes are needed for this transaction.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Textarea
            placeholder="Describe the changes needed..."
            value={changesRequested}
            onChange={(e) => setChangesRequested(e.target.value)}
            className="min-h-24"
          />
        </div>
        
        <DialogFooter>
          <Button
            variant="outline" 
            onClick={() => onDialogTypeChange("details")}
          >
            Cancel
          </Button>
          <Button 
            onClick={onChangesConfirm}
            disabled={changesRequested.trim() === ""}
            className="bg-amber-500 hover:bg-amber-600"
          >
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApprovalTransactionDialog;
