
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
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ApprovalTransactionRow from "./ApprovalTransactionRow";
import ApprovalTransactionDialog from "./ApprovalTransactionDialog";
import ApprovalBatchActions from "./ApprovalBatchActions";
import BillQuickPreview from "./BillQuickPreview";

interface ApprovalTransactionListProps {
  transactions: ApprovalTransaction[];
  onApprove: (id: string) => void;
  onReject: (transaction: ApprovalTransaction, reason: string) => void;
  onRequestChanges: (transaction: ApprovalTransaction, reason: string) => void;
  onBatchApprove: (voucherIds: string[]) => void;
  showActions?: boolean; // Whether to show action buttons and column
}

const ApprovalTransactionList = ({
  transactions,
  onApprove,
  onReject,
  onRequestChanges,
  onBatchApprove,
  showActions = true
}: ApprovalTransactionListProps) => {
  const navigate = useNavigate();
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<ApprovalTransaction | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
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
    onBatchApprove(selectedTransactions);
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
  
  const openDetailsSheet = (transaction: ApprovalTransaction) => {
    setSelectedTransaction(transaction);
    setSheetOpen(true);
  };

  const handleRejectConfirm = () => {
    if (dialogTransaction && rejectReason) {
      onReject(dialogTransaction, rejectReason);
      setDialogTransaction(null);
      setRejectReason("");
    }
  };

  const handleChangesConfirm = () => {
    if (dialogTransaction && changesRequested) {
      onRequestChanges(dialogTransaction, changesRequested);
      setDialogTransaction(null);
      setChangesRequested("");
    }
  };

  const handleDialogClose = () => {
    setDialogTransaction(null);
  };

  const handleDialogTypeChange = (type: "reject" | "changes" | "details") => {
    setDialogType(type);
    if (type === "reject") {
      setRejectReason("");
    } else if (type === "changes") {
      setChangesRequested("");
    }
  };

  // These wrapper functions ensure we're passing the correct parameter types
  const handleRowApprove = (id: string) => {
    onApprove(id);
  };
  const handleRowReject = (transaction: ApprovalTransaction) => openRejectDialog(transaction);
  const handleRowRequestChanges = (transaction: ApprovalTransaction) => openChangesDialog(transaction);

  return (
    <>
      {transactions.length > 0 ? (
        <div className="rounded-md border">
          {showActions && (
            <ApprovalBatchActions
              selectedCount={selectedTransactions.length}
              onBatchApprove={handleBatchApprove}
            />
          )}

          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                {showActions && (
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={selectedTransactions.length === transactions.length && transactions.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                )}
                <TableHead>Vendor</TableHead>
                <TableHead>Invoice #</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-center">Approval Status</TableHead>
                {showActions && <TableHead className="text-center">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <ApprovalTransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  isSelected={selectedTransactions.includes(transaction.id)}
                  onSelectTransaction={handleSelectTransaction}
                  onRowClick={openDetailsSheet}
                  onApprove={handleRowApprove}
                  onReject={handleRowReject}
                  onRequestChanges={handleRowRequestChanges}
                  showActions={showActions}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-md border p-8 text-center">
          <p className="text-muted-foreground">No transactions found matching your filters.</p>
        </div>
      )}

      {/* Bill Quick Preview Sheet */}
      <BillQuickPreview
        transaction={selectedTransaction}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onApprove={handleRowApprove}
        onReject={handleRowReject}
        onRequestChanges={handleRowRequestChanges}
        showActions={showActions}
      />

      {/* Reject/Request Changes Dialogs */}
      <ApprovalTransactionDialog
        transaction={dialogTransaction}
        dialogType={dialogType}
        rejectReason={rejectReason}
        changesRequested={changesRequested}
        setRejectReason={setRejectReason}
        setChangesRequested={setChangesRequested}
        onClose={handleDialogClose}
        onDialogTypeChange={handleDialogTypeChange}
        onApprove={onApprove}
        onRejectConfirm={handleRejectConfirm}
        onChangesConfirm={handleChangesConfirm}
        onViewFullDetails={(id) => navigate(`/bills/${id}`)}
      />
    </>
  );
};

export default ApprovalTransactionList;
