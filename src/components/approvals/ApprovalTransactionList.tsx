
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
  const navigate = useNavigate();
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

  const navigateToTransactionDetails = (id: string) => {
    navigate(`/approvals/${id}`);
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

  return (
    <>
      {transactions.length > 0 ? (
        <div className="rounded-md border">
          <ApprovalBatchActions 
            selectedCount={selectedTransactions.length} 
            onBatchApprove={handleBatchApprove} 
          />
          
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
                <ApprovalTransactionRow 
                  key={transaction.id}
                  transaction={transaction}
                  isSelected={selectedTransactions.includes(transaction.id)}
                  onSelectTransaction={handleSelectTransaction}
                  onRowClick={openDetailsDialog}
                  onApprove={onApprove}
                  onReject={openRejectDialog}
                  onFlag={onFlag}
                  onRequestChanges={openChangesDialog}
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
        onViewFullDetails={navigateToTransactionDetails}
      />
    </>
  );
};

export default ApprovalTransactionList;
