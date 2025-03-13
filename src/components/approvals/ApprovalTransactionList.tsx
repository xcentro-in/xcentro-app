
import { useState } from "react";
import { ApprovalTransaction } from "@/types/approval";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  X, 
  Flag, 
  PenLine, 
  AlertTriangle, 
  Clock,
  CreditCard,
  BanknoteIcon,
  CheckCheck
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ApprovalTransactionListProps {
  transactions: ApprovalTransaction[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onFlag: (id: string) => void;
  onRequestChanges: (id: string) => void;
}

const ApprovalTransactionList = ({ 
  transactions,
  onApprove,
  onReject,
  onFlag,
  onRequestChanges
}: ApprovalTransactionListProps) => {
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [dialogTransaction, setDialogTransaction] = useState<ApprovalTransaction | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [changesRequested, setChangesRequested] = useState("");
  const [dialogType, setDialogType] = useState<"reject" | "changes" | "details">("details");

  const handleSelectAll = () => {
    if (selectedTransactions.length === transactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(transactions.map(transaction => transaction.id));
    }
  };

  const handleSelectTransaction = (id: string) => {
    if (selectedTransactions.includes(id)) {
      setSelectedTransactions(prev => prev.filter(txId => txId !== id));
    } else {
      setSelectedTransactions(prev => [...prev, id]);
    }
  };

  const handleBatchApprove = () => {
    selectedTransactions.forEach(id => onApprove(id));
    toast.success(`${selectedTransactions.length} transactions approved`);
    setSelectedTransactions([]);
  };

  const openRejectDialog = (transaction: ApprovalTransaction) => {
    setDialogTransaction(transaction);
    setDialogType("reject");
    setRejectReason("");
  };

  const openChangesDialog = (transaction: ApprovalTransaction) => {
    setDialogTransaction(transaction);
    setDialogType("changes");
    setChangesRequested("");
  };
  
  const openDetailsDialog = (transaction: ApprovalTransaction) => {
    setDialogTransaction(transaction);
    setDialogType("details");
  };

  const handleRejectConfirm = () => {
    if (dialogTransaction && rejectReason) {
      onReject(dialogTransaction.id);
      toast.success(`Transaction ${dialogTransaction.id} rejected`);
      setDialogTransaction(null);
    }
  };

  const handleChangesConfirm = () => {
    if (dialogTransaction && changesRequested) {
      onRequestChanges(dialogTransaction.id);
      toast.success(`Changes requested for transaction ${dialogTransaction.id}`);
      setDialogTransaction(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-blue-500/10 border-blue-500/20 text-blue-600 text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "urgent":
        return (
          <Badge variant="outline" className="bg-red-500/10 border-red-500/20 text-red-600 text-xs">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Urgent
          </Badge>
        );
      case "flagged":
        return (
          <Badge variant="outline" className="bg-amber-500/10 border-amber-500/20 text-amber-600 text-xs">
            <Flag className="h-3 w-3 mr-1" />
            Flagged
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-600 text-xs">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-500/10 border-red-500/20 text-red-600 text-xs">
            <X className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      case "changes_requested":
        return (
          <Badge variant="outline" className="bg-amber-500/10 border-amber-500/20 text-amber-600 text-xs">
            <PenLine className="h-3 w-3 mr-1" />
            Changes Requested
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {transactions.length > 0 ? (
        <div className="rounded-md border">
          {selectedTransactions.length > 0 && (
            <div className="bg-muted/60 p-2 border-b flex items-center justify-between">
              <div className="text-sm">
                <span className="font-medium">{selectedTransactions.length}</span> transactions selected
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                  onClick={handleBatchApprove}
                >
                  <CheckCheck className="h-4 w-4" />
                  Batch Approve
                </Button>
              </div>
            </div>
          )}
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox 
                    checked={selectedTransactions.length === transactions.length && transactions.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-[100px]">Transaction ID</TableHead>
                <TableHead>Payee</TableHead>
                <TableHead>Initiated By</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow 
                  key={transaction.id}
                  className={cn(
                    !transaction.isRead && "bg-muted/30 font-medium",
                    transaction.status === "urgent" && "bg-red-50/50",
                    transaction.status === "flagged" && "bg-amber-50/50"
                  )}
                >
                  <TableCell>
                    <Checkbox 
                      checked={selectedTransactions.includes(transaction.id)}
                      onCheckedChange={() => handleSelectTransaction(transaction.id)}
                    />
                  </TableCell>
                  <TableCell 
                    className="font-medium cursor-pointer hover:text-primary"
                    onClick={() => openDetailsDialog(transaction)}
                  >
                    {transaction.id}
                  </TableCell>
                  <TableCell 
                    className="cursor-pointer hover:text-primary"
                    onClick={() => openDetailsDialog(transaction)}
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
                      <div className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full",
                        transaction.paymentMethod === "credit" ? "bg-primary/10" : "bg-purple-500/10"
                      )}>
                        {transaction.paymentMethod === "credit" ? (
                          <CreditCard className="h-3 w-3 text-primary" />
                        ) : (
                          <BanknoteIcon className="h-3 w-3 text-purple-500" />
                        )}
                      </div>
                      ${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(transaction.status)}</TableCell>
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
                    {(transaction.status === "pending" || transaction.status === "urgent" || transaction.status === "flagged") && (
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => onApprove(transaction.id)}
                          title="Approve"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => openRejectDialog(transaction)}
                          title="Reject"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          onClick={() => onFlag(transaction.id)}
                          title="Flag for Review"
                        >
                          <Flag className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => openChangesDialog(transaction)}
                          title="Request Changes"
                        >
                          <PenLine className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-md border p-8 text-center">
          <p className="text-muted-foreground">No transactions found matching your filters.</p>
        </div>
      )}

      {/* Transaction Details Dialog */}
      <Dialog 
        open={dialogTransaction !== null && dialogType === "details"} 
        onOpenChange={(open) => !open && setDialogTransaction(null)}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Full information about the transaction
            </DialogDescription>
          </DialogHeader>
          
          {dialogTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Transaction ID</p>
                  <p className="font-medium">{dialogTransaction.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="mt-1">{getStatusBadge(dialogTransaction.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payee</p>
                  <p className="font-medium">{dialogTransaction.payee}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium">${dialogTransaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <div className="flex items-center gap-2 mt-1">
                    {dialogTransaction.paymentMethod === "credit" ? (
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
                  <p className="font-medium">{format(new Date(dialogTransaction.requestedDate), "PPP")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Initiated By</p>
                  <p className="font-medium">{dialogTransaction.initiatedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Initiator Role</p>
                  <p className="font-medium">{dialogTransaction.initiatorRole}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p>{dialogTransaction.description}</p>
              </div>
              
              {dialogTransaction.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="p-3 bg-muted/50 rounded-md">{dialogTransaction.notes}</p>
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
                        {format(new Date(dialogTransaction.requestedDate), "PPP 'at' p")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2 flex-row">
            {dialogTransaction && (dialogTransaction.status === "pending" || dialogTransaction.status === "urgent" || dialogTransaction.status === "flagged") && (
              <>
                <Button 
                  variant="outline" 
                  className="gap-1 bg-green-50 border-green-100 text-green-600 hover:bg-green-100 hover:text-green-700"
                  onClick={() => onApprove(dialogTransaction.id)}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Approve
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-1 bg-red-50 border-red-100 text-red-600 hover:bg-red-100 hover:text-red-700"
                  onClick={() => { setDialogType("reject"); setRejectReason(""); }}
                >
                  <X className="h-4 w-4" />
                  Reject
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-1"
                  onClick={() => { setDialogType("changes"); setChangesRequested(""); }}
                >
                  <PenLine className="h-4 w-4" />
                  Request Changes
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog 
        open={dialogTransaction !== null && dialogType === "reject"} 
        onOpenChange={(open) => !open && setDialogTransaction(null)}
      >
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
              onClick={() => dialogType === "details" ? setDialogTransaction(null) : setDialogType("details")}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRejectConfirm}
              disabled={rejectReason.trim() === ""}
            >
              Reject Transaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Changes Dialog */}
      <Dialog 
        open={dialogTransaction !== null && dialogType === "changes"} 
        onOpenChange={(open) => !open && setDialogTransaction(null)}
      >
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
              onClick={() => dialogType === "details" ? setDialogTransaction(null) : setDialogType("details")}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleChangesConfirm}
              disabled={changesRequested.trim() === ""}
              className="bg-amber-500 hover:bg-amber-600"
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApprovalTransactionList;
