
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PaymentDetailsStep, PaymentType } from "./PaymentDetailsStep";
import { PaymentSummary } from "./PaymentSummary";
import PaymentMethodSelector from "./PaymentMethodSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Star, StarOff, Clock, Filter, User, BanknoteIcon, LightbulbIcon, UsersIcon } from "lucide-react";
import { mockPayees } from "@/data/mockPayees";
import { Payee, PayeeType } from "@/types/payee";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";

interface SinglePaymentFormProps {
  onStepChange: (step: number) => void;
}

const SinglePaymentForm = ({ onStepChange }: SinglePaymentFormProps) => {
  const [step, setStep] = useState(1);
  const [paymentType, setPaymentType] = useState<PaymentType>("now");
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [selectedPayee, setSelectedPayee] = useState<string>();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "favorites" | "recent">("all");
  const [filterType, setFilterType] = useState<PayeeType | "all">("all");
  
  // Mock favorite and recent payees (in a real app, this would come from user data)
  const [favoritePayees, setFavoritePayees] = useState<string[]>(["1", "3"]);
  const recentPayeeIds = ["1", "5", "3"]; // Last used payees
  
  const handleNext = () => {
    const nextStep = step + 1;
    setStep(nextStep);
    onStepChange(nextStep);
  };

  const handleBack = () => {
    const prevStep = step - 1;
    setStep(prevStep);
    onStepChange(prevStep);
  };
  
  const toggleFavorite = (payeeId: string) => {
    setFavoritePayees(prev => 
      prev.includes(payeeId) 
        ? prev.filter(id => id !== payeeId) 
        : [...prev, payeeId]
    );
  };
  
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
  
  const getPayeeIcon = (type: PayeeType) => {
    switch (type) {
      case "bank":
        return <BanknoteIcon className="h-4 w-4 text-blue-500" />;
      case "biller":
        return <LightbulbIcon className="h-4 w-4 text-yellow-500" />;
      case "payroll":
        return <UsersIcon className="h-4 w-4 text-green-500" />;
    }
  };

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
      // Fix the comparison issue - activeTab is a string, so we can't use "!=" directly with a boolean
      // Change from:
      // if (!activeTab !== "recent" && recentPayeeIds.includes(payee.id)) {
      // To:
      if (activeTab !== "recent" && recentPayeeIds.includes(payee.id)) {
        // Skip if already in recent (to avoid duplicates)
        return;
      }
      groups[payee.type].push(payee);
    });
    
    return groups;
  }, [filteredPayees, activeTab]);

  return (
    <div className="space-y-6">
      {step === 1 && (
        <PaymentDetailsStep
          paymentType={paymentType}
          scheduledDate={scheduledDate}
          onPaymentTypeChange={setPaymentType}
          onScheduledDateChange={setScheduledDate}
          onNext={handleNext}
        />
      )}

      {step === 2 && (
        <div className="space-y-4">
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
                        <div className="p-2">
                          <h4 className="mb-2 text-sm font-medium text-muted-foreground">Recently Used</h4>
                          <div className="space-y-1">
                            {groupedPayees.recent.map(payee => (
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
                      )}
                      
                      {/* Vendors Section */}
                      {groupedPayees.bank.length > 0 && (
                        <div className="p-2">
                          <h4 className="mb-2 text-sm font-medium text-muted-foreground">Vendors</h4>
                          <div className="space-y-1">
                            {groupedPayees.bank.map(payee => (
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
                      )}
                      
                      {/* Billers Section */}
                      {groupedPayees.biller.length > 0 && (
                        <div className="p-2">
                          <h4 className="mb-2 text-sm font-medium text-muted-foreground">Billers</h4>
                          <div className="space-y-1">
                            {groupedPayees.biller.map(payee => (
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
                      )}
                      
                      {/* Employees Section */}
                      {groupedPayees.payroll.length > 0 && (
                        <div className="p-2">
                          <h4 className="mb-2 text-sm font-medium text-muted-foreground">Employees</h4>
                          <div className="space-y-1">
                            {groupedPayees.payroll.map(payee => (
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

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleBack} className="flex-1">Back</Button>
            <Button onClick={handleNext} className="flex-1" disabled={!selectedPayee}>Continue to Payment Method</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h3 className="font-medium mb-2">Select Payment Method</h3>
          
          <PaymentMethodSelector 
            onSelect={setSelectedPaymentMethod}
            selectedMethodId={selectedPaymentMethod}
          />

          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={handleBack} className="flex-1">Back</Button>
            <Button 
              onClick={handleNext} 
              className="flex-1"
              disabled={!selectedPaymentMethod}
            >
              Review Payment
            </Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <PaymentSummary
          paymentType={paymentType}
          scheduledDate={scheduledDate}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default SinglePaymentForm;
