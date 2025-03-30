
import { useMemo } from "react";
import { Payee, PayeeType } from "@/types/payee";
import PayeeGroup from "./PayeeGroup";
import { getPayeeTypeLabel } from "@/utils/payeeUtils";

interface PayeeListProps {
  filteredPayees: Payee[];
  activeTab: "all" | "favorites" | "recent";
  recentPayeeIds: string[];
  selectedPayee: string | undefined;
  setSelectedPayee: (payeeId: string) => void;
  favoritePayees: string[];
  toggleFavorite: (payeeId: string) => void;
}

const PayeeList = ({
  filteredPayees,
  activeTab,
  recentPayeeIds,
  selectedPayee,
  setSelectedPayee,
  favoritePayees,
  toggleFavorite
}: PayeeListProps) => {
  // Group payees by type
  const groupedPayees = useMemo(() => {
    const groups: Record<PayeeType | 'recent', Payee[]> = {
      bank: [],
      biller: [],
      payroll: [],
      recent: []
    };
    
    // First add recent payees if not on recent tab
    if (activeTab !== "recent") {
      filteredPayees
        .filter(p => recentPayeeIds.includes(p.id))
        .slice(0, 5)
        .forEach(p => groups.recent.push(p));
    }
    
    // Then add other payees by type
    filteredPayees.forEach(payee => {
      if (activeTab !== "recent" && recentPayeeIds.includes(payee.id)) {
        // Skip if already in recent (to avoid duplicates)
        return;
      }
      groups[payee.type].push(payee);
    });
    
    return groups;
  }, [filteredPayees, activeTab, recentPayeeIds]);

  if (filteredPayees.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No payees found. Try adjusting your search or filter.
      </div>
    );
  }

  return (
    <div className="p-1">
      {/* Recent Payees Section */}
      {activeTab !== "recent" && groupedPayees.recent.length > 0 && (
        <PayeeGroup 
          title="Recently Used" 
          payees={groupedPayees.recent}
          selectedPayee={selectedPayee}
          setSelectedPayee={setSelectedPayee}
          favoritePayees={favoritePayees}
          toggleFavorite={toggleFavorite}
        />
      )}
      
      {/* Vendors Section */}
      {groupedPayees.bank.length > 0 && (
        <PayeeGroup 
          title={getPayeeTypeLabel("bank")} 
          payees={groupedPayees.bank}
          selectedPayee={selectedPayee}
          setSelectedPayee={setSelectedPayee}
          favoritePayees={favoritePayees}
          toggleFavorite={toggleFavorite}
        />
      )}
      
      {/* Billers Section */}
      {groupedPayees.biller.length > 0 && (
        <PayeeGroup 
          title={getPayeeTypeLabel("biller")} 
          payees={groupedPayees.biller}
          selectedPayee={selectedPayee}
          setSelectedPayee={setSelectedPayee}
          favoritePayees={favoritePayees}
          toggleFavorite={toggleFavorite}
        />
      )}
      
      {/* Employees Section */}
      {groupedPayees.payroll.length > 0 && (
        <PayeeGroup 
          title={getPayeeTypeLabel("payroll")} 
          payees={groupedPayees.payroll}
          selectedPayee={selectedPayee}
          setSelectedPayee={setSelectedPayee}
          favoritePayees={favoritePayees}
          toggleFavorite={toggleFavorite}
        />
      )}
      
      {/* Removed the Add New Payee Option */}
    </div>
  );
};

export default PayeeList;
