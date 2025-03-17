
import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { PayeeType } from "@/types/payee";
import { mockPayees } from "@/data/mockPayees";
import PayeeSearchBar from "./PayeeSearchBar";
import PayeeTypeFilter from "./PayeeTypeFilter";
import PayeeList from "./PayeeList";
import PayeeTabs from "./PayeeTabs";

interface PayeeSelectorProps {
  selectedPayee: string | undefined;
  setSelectedPayee: (payeeId: string) => void;
  favoritePayees: string[];
  toggleFavorite: (payeeId: string) => void;
}

const PayeeSelector = ({ 
  selectedPayee, 
  setSelectedPayee, 
  favoritePayees, 
  toggleFavorite 
}: PayeeSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "favorites" | "recent">("all");
  const [filterType, setFilterType] = useState<PayeeType | "all">("all");
  
  // Mock recent payees (in a real app, this would come from user data)
  const recentPayeeIds = ["1", "5", "3"]; // Last used payees
  
  // Filter and search payees
  const filteredPayees = useMemo(() => {
    let result = [...mockPayees];
    
    // Filter by type if not "all"
    if (filterType !== "all") {
      result = result.filter(payee => payee.type === filterType);
    }
    
    // Filter by tab
    if (activeTab === "favorites") {
      result = result.filter(payee => favoritePayees.includes(payee.id));
    } else if (activeTab === "recent") {
      result = result.filter(payee => recentPayeeIds.includes(payee.id));
    }
    
    // Filter by search term
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(payee => 
        payee.name.toLowerCase().includes(lowerSearch) ||
        payee.email.toLowerCase().includes(lowerSearch)
      );
    }
    
    return result;
  }, [filterType, activeTab, searchTerm, favoritePayees]);

  return (
    <div className="space-y-2">
      <Label>Select Payee</Label>
      
      <div className="flex flex-col space-y-4">
        <PayeeTabs activeTab={activeTab} setActiveTab={setActiveTab}>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <PayeeSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              </div>
              <PayeeTypeFilter filterType={filterType} setFilterType={setFilterType} />
            </div>
            
            <div className="max-h-[320px] overflow-y-auto border rounded-md">
              <PayeeList 
                filteredPayees={filteredPayees}
                activeTab={activeTab}
                recentPayeeIds={recentPayeeIds}
                selectedPayee={selectedPayee}
                setSelectedPayee={setSelectedPayee}
                favoritePayees={favoritePayees}
                toggleFavorite={toggleFavorite}
              />
            </div>
          </div>
        </PayeeTabs>
      </div>
    </div>
  );
};

export default PayeeSelector;
