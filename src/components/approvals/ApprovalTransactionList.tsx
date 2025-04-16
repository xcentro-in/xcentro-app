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
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


interface ApprovalTransactionListProps {
  transactions: ApprovalTransaction[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onFlag: (id: string) => void;
  onRequestChanges: (id: string) => void;
  pendingCount: number;
}

const ApprovalTransactionList = ({ 
  transactions,
  onApprove,
  onReject,
  onFlag,
  onRequestChanges,
  pendingCount
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

  // These wrapper functions ensure we're passing the correct parameter types
  const handleRowApprove = (id: string) => onApprove(id);
  const handleRowReject = (transaction: ApprovalTransaction) => openRejectDialog(transaction);
  const handleRowFlag = (id: string) => onFlag(id);
  const handleRowRequestChanges = (transaction: ApprovalTransaction) => openChangesDialog(transaction);

  return (
    <>
      {transactions.length > 0 ? (
        <div className="rounded-md border">
          <ApprovalBatchActions 
            selectedCount={selectedTransactions.length} 
            onBatchApprove={handleBatchApprove} 
          />

          <div className="flex items-center gap-4 mb-4">
            <Tabs defaultValue="pending">
              <TabsList className="h-9">
                <TabsTrigger value="pending" className="relative">
                  <span>✅ Pending Approval</span>
                  {pendingCount > 0 && (
                    <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                      {pendingCount}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="action_required" className="relative">
                  <span>🚩 Action Required</span>
                  {transactions.filter(t => t.status === 'flagged' || t.status === 'changes_requested').length > 0 && (
                    <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                      {transactions.filter(t => t.status === 'flagged' || t.status === 'changes_requested').length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="approved" className="relative">
                  <span>✔️ Approved</span>
                  {transactions.filter(t => t.status === 'approved').length > 0 && (
                    <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                      {transactions.filter(t => t.status === 'approved').length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="pending">
                {/* Pending Transactions */}
              </TabsContent>
              <TabsContent value="action_required">
                {/* Action Required Transactions */}
              </TabsContent>
              <TabsContent value="approved">
                {/* Approved Transactions */}
              </TabsContent>
            </Tabs>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-9 w-9"
              onClick={() => {
                // TODO: Implement refresh logic
                toast.success("Refreshing transactions...");
              }}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox 
                    checked={selectedTransactions.length === transactions.length && transactions.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-[100px]">Payment Method</TableHead>
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
                  onApprove={handleRowApprove}
                  onReject={handleRowReject}
                  onFlag={handleRowFlag}
                  onRequestChanges={handleRowRequestChanges}
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