
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { mockPayees } from "@/data/mockPayees";
import { getPayeeTransactions, getPayeeTotalPayments, getPayeeLastTransactionDate } from "@/data/mockPayeeTransactions";
import { Payee } from "@/types/payee";
import { Transaction, TransactionStatus, PaymentMethod } from "@/types/transaction";
import { DateRange } from "react-day-picker";

// Import refactored components
import { PayeeDetailsCard } from "@/components/payee-history/PayeeDetailsCard";
import { FilterCard } from "@/components/payee-history/FilterCard";
import { TransactionsTable } from "@/components/payee-history/TransactionsTable";
import { DownloadActions } from "@/components/payee-history/DownloadActions";

const PayeeHistory = () => {
  const { payeeId } = useParams<{ payeeId: string }>();
  const navigate = useNavigate();
  
  const [payee, setPayee] = useState<Payee | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [appliedFilters, setAppliedFilters] = useState({
    status: "all" as TransactionStatus | "all",
    method: "all" as PaymentMethod | "all",
    dateRange: undefined as DateRange | undefined,
  });
  
  // Load payee and transaction data
  useEffect(() => {
    if (!payeeId) return;
    
    const payeeData = mockPayees.find(p => p.id === payeeId);
    if (payeeData) {
      setPayee(payeeData);
      const payeeTransactions = getPayeeTransactions(payeeId);
      setTransactions(payeeTransactions);
    }
  }, [payeeId]);

  // Calculate totals
  const totalPaid = getPayeeTotalPayments(payeeId || "");
  const lastTransactionDate = getPayeeLastTransactionDate(payeeId || "");
  
  // Handle filter application
  const handleApplyFilters = (filters: {
    status: TransactionStatus | "all";
    method: PaymentMethod | "all";
    dateRange: DateRange | undefined;
  }) => {
    setAppliedFilters(filters);
  };
  
  // Handle filter reset
  const handleResetFilters = () => {
    setAppliedFilters({
      status: "all",
      method: "all",
      dateRange: undefined,
    });
  };
  
  if (!payee) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold">Payee not found</h2>
        <p className="text-muted-foreground mt-2">The payee you are looking for does not exist.</p>
        <Button className="mt-4" onClick={() => navigate("/payees")}>
          Back to Payees
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <Button 
          variant="ghost" 
          className="w-fit pl-0 hover:pl-0 hover:bg-transparent -ml-2 text-muted-foreground"
          onClick={() => navigate("/payees")}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Payees
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between gap-4">
          {/* Payee details */}
          <PayeeDetailsCard 
            payee={payee}
            totalPaid={totalPaid}
            lastTransactionDate={lastTransactionDate}
          />
          
          <div className="flex flex-col gap-3">
            {/* Download actions */}
            <DownloadActions payeeName={payee.name} />
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Filters Section */}
      <FilterCard onApplyFilters={handleApplyFilters} />
      
      {/* Transactions Table */}
      <TransactionsTable 
        transactions={transactions}
        appliedFilters={appliedFilters}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};

export default PayeeHistory;
