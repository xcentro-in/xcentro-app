
import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, StarOff, Clock, Filter, User } from "lucide-react";
import { mockPayees } from "@/data/mockPayees";
import { Payee, PayeeType } from "@/types/payee";
import { getPayeeIcon } from "@/utils/payeeUtils";

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

  // Group payees by type
  const groupedPayees = useMemo(() => {
    const groups: Record<PayeeType | 'recent', Payee[]> = {
      bank: [],
      biller: [],
      payroll: [],
      recent: []
    };
    
    // First add recent payees
    if (activeTab !== "recent") {
      mockPayees
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
  }, [filteredPayees, activeTab]);

  return (
    <div className="space-y-2">
      <Label>Select Payee</Label>
      
      <div className="flex flex-col space-y-4">
        {/* Tabs for All, Favorites, Recent */}
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "all" | "favorites" | "recent")} className="w-full">
          <div className="flex items-center justify-between mb-2">
            <TabsList className="grid w-full md:w-auto grid-cols-3">
              <TabsTrigger value="all" className="px-4">
                <User className="h-4 w-4 mr-2" />
                <span>All Payees</span>
              </TabsTrigger>
              <TabsTrigger value="favorites" className="px-4">
                <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                <span>Favorites</span>
              </TabsTrigger>
              <TabsTrigger value="recent" className="px-4">
                <Clock className="h-4 w-4 mr-2" />
                <span>Recent</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Type filter dropdown */}
            <Select value={filterType} onValueChange={(val) => setFilterType(val as PayeeType | "all")}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="bank">Vendors</SelectItem>
                <SelectItem value="biller">Billers</SelectItem>
                <SelectItem value="payroll">Employees</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search payees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="max-h-[320px] overflow-y-auto border rounded-md">
            {filteredPayees.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No payees found. Try adjusting your search or filter.
              </div>
            ) : (
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
                    title="Vendors" 
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
                    title="Billers" 
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
                    title="Employees" 
                    payees={groupedPayees.payroll}
                    selectedPayee={selectedPayee}
                    setSelectedPayee={setSelectedPayee}
                    favoritePayees={favoritePayees}
                    toggleFavorite={toggleFavorite}
                  />
                )}
                
                {/* Add New Payee Option */}
                <div className="p-2 border-t">
                  <div 
                    className="flex items-center p-2 rounded-md cursor-pointer hover:bg-accent"
                    onClick={() => setSelectedPayee("new")}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-medium">+</span>
                      </div>
                      <div className="font-medium">Add New Payee</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

// Helper component for rendering payee groups
interface PayeeGroupProps {
  title: string;
  payees: Payee[];
  selectedPayee: string | undefined;
  setSelectedPayee: (payeeId: string) => void;
  favoritePayees: string[];
  toggleFavorite: (payeeId: string) => void;
}

const PayeeGroup = ({ 
  title, 
  payees, 
  selectedPayee, 
  setSelectedPayee, 
  favoritePayees, 
  toggleFavorite 
}: PayeeGroupProps) => {
  return (
    <div className="p-2">
      <h4 className="mb-2 text-sm font-medium text-muted-foreground">{title}</h4>
      <div className="space-y-1">
        {payees.map(payee => (
          <div 
            key={payee.id}
            className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-accent ${selectedPayee === payee.id ? 'bg-accent' : ''}`}
            onClick={() => setSelectedPayee(payee.id)}
          >
            <div className="flex items-center gap-2">
              {getPayeeIcon(payee.type)}
              <div>
                <div className="font-medium">{payee.name}</div>
                <div className="text-xs text-muted-foreground">{payee.email}</div>
              </div>
            </div>
            <div className="flex items-center">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(payee.id);
                }}
                className="p-1 hover:bg-muted rounded-full focus:outline-none"
              >
                {favoritePayees.includes(payee.id) ? (
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ) : (
                  <StarOff className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PayeeSelector;
