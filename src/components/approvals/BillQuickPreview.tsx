import { ApprovalTransaction } from "@/types/approval";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, X, PenLine, ExternalLink, Calendar, FileText, User } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/utils/formatters";
import { useNavigate } from "react-router-dom";
import ApprovalStatusBadge from "./ApprovalStatusBadge";

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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[500px] sm:w-[540px] sm:max-w-[540px]">
        <SheetHeader>
          <SheetTitle>Bill Approval Request</SheetTitle>
          <SheetDescription>
            Review invoice snapshot and take action
          </SheetDescription>
        </SheetHeader>

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

            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Status</span>
              <ApprovalStatusBadge status={transaction.status} />
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
            <div className="bg-muted/50 rounded-lg p-4">
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
            </div>
          </div>
        </div>

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
