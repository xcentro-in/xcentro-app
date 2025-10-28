import { ApprovalTransaction } from "@/types/approval";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, X, PenLine, ExternalLink, Calendar, FileText, User, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { formatCurrency } from "@/utils/formatters";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BillQuickPreviewProps {
  transaction: ApprovalTransaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (id: string) => void;
  onReject: (transaction: ApprovalTransaction) => void;
  onRequestChanges: (transaction: ApprovalTransaction) => void;
}

const BillQuickPreview = ({
  transaction,
  open,
  onOpenChange,
  onApprove,
  onReject,
  onRequestChanges
}: BillQuickPreviewProps) => {
  const navigate = useNavigate();

  if (!transaction) return null;

  const handleViewFullDetails = () => {
    // Navigate to bill detail page
    navigate(`/bills/${transaction.id}`);
    onOpenChange(false);
  };

  const canTakeAction = transaction.status === "pending" || transaction.status === "request_changes";

  // Helper to get action icon and color
  const getActionDisplay = (action: string) => {
    switch (action) {
      case 'approved':
        return { icon: CheckCircle, color: 'text-green-600', label: 'Approved' };
      case 'rejected':
        return { icon: X, color: 'text-red-600', label: 'Rejected' };
      case 'request_changes':
        return { icon: AlertCircle, color: 'text-blue-600', label: 'Requested Changes' };
      case 'pending':
        return { icon: Clock, color: 'text-yellow-600', label: 'Pending Approval' };
      default:
        return { icon: Clock, color: 'text-gray-600', label: action };
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[500px] sm:w-[540px] sm:max-w-[540px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Bill Approval Request</SheetTitle>
          <SheetDescription>
            Review invoice snapshot and take action
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="py-6 space-y-6">
          {/* Invoice Snapshot */}
          <div className="space-y-4">
            {/* Amount - Large and prominent */}
            <div className="bg-primary/5 rounded-lg p-6 text-center border border-primary/20">
              <p className="text-sm text-muted-foreground mb-2">Bill Amount</p>
              <p className="text-4xl font-bold text-primary">
                {formatCurrency(transaction.amount)}
              </p>
            </div>

            <Separator />

            {/* Invoice Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Invoice Number</span>
                </div>
                <p className="font-medium font-mono">{transaction.invoiceNumber}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Due Date</span>
                </div>
                <p className="font-medium">
                  {transaction.dueDate ? format(new Date(transaction.dueDate), "MMM d, yyyy") : "N/A"}
                </p>
              </div>
            </div>

            <Separator />

            {/* Vendor Information */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Vendor</span>
              </div>
              <p className="font-semibold text-lg">{transaction.payee}</p>
              {transaction.description && (
                <p className="text-sm text-muted-foreground">{transaction.description}</p>
              )}
            </div>

            {/* Requested By */}
            {/* <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">Requested By</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{transaction.initiatedBy}</p>
                  <p className="text-xs text-muted-foreground">{transaction.initiatorRole}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {format(new Date(transaction.requestedDate), "MMM d, yyyy")}
                </Badge>
              </div>
              {transaction.notes && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">Notes:</p>
                  <p className="text-sm">{transaction.notes}</p>
                </div>
              )}
            </div> */}

            {/* Approval History */}
            {transaction.approvalHistory && transaction.approvalHistory.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">Approval Timeline</p>
                  <div className="space-y-3">
                    {transaction.approvalHistory.map((history, index) => {
                      const actionDisplay = getActionDisplay(history.action);
                      const ActionIcon = actionDisplay.icon;

                      return (
                        <div key={history.approvalId} className="flex gap-3">
                          {/* Timeline dot and line */}
                          <div className="flex flex-col items-center">
                            <div className={`rounded-full p-1.5 bg-background border-2 ${actionDisplay.color.replace('text-', 'border-')}`}>
                              <ActionIcon className={`h-3 w-3 ${actionDisplay.color}`} />
                            </div>
                            {index < transaction.approvalHistory!.length - 1 && (
                              <div className="w-0.5 flex-1 bg-border mt-1 min-h-[20px]" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 pb-3">
                            <div className="flex items-start justify-between mb-1">
                              <div>
                                <p className="text-sm font-medium">{actionDisplay.label}</p>
                                <p className="text-xs text-muted-foreground">
                                  by {history.requesterName}
                                  {history.approverName && history.approverName !== history.requesterName && (
                                    <> → {history.approverName}</>
                                  )}
                                </p>
                              </div>
                              <p className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                {formatDistanceToNow(new Date(history.createdAt), { addSuffix: true })}
                              </p>
                            </div>
                            {history.remarks && (
                              <p className="text-xs text-muted-foreground bg-muted/30 rounded p-2 mt-2">
                                "{history.remarks}"
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
          </div>
        </ScrollArea>

        <SheetFooter className="flex-col space-y-3 sm:space-y-3 sm:flex-col">
          {/* Action Buttons */}
          {canTakeAction && (
            <div className="grid grid-cols-3 gap-2 w-full">
              <Button
                size="sm"
                variant="outline"
                className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800 px-2"
                onClick={() => {
                  onApprove(transaction.id);
                  onOpenChange(false);
                }}
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                <span className="truncate text-xs">Approve</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:text-red-800 px-2"
                onClick={() => {
                  onReject(transaction);
                  onOpenChange(false);
                }}
              >
                <X className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                <span className="truncate text-xs">Reject</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 hover:text-amber-800 px-2"
                onClick={() => {
                  onRequestChanges(transaction);
                  onOpenChange(false);
                }}
              >
                <PenLine className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                <span className="truncate text-xs">Changes</span>
              </Button>
            </div>
          )}

          {/* View Full Details Button */}
          <Button
            size="sm"
            variant="default"
            className="w-full"
            onClick={handleViewFullDetails}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            <span className="text-sm">View Full Details</span>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default BillQuickPreview;
