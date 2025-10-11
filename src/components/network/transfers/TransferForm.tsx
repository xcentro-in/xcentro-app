
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { mockBusinesses } from "@/data/mockBusinesses";

interface TransferFormProps {
  availablePoints: number;
}

const TransferForm = ({ availablePoints }: TransferFormProps) => {
  const [selectedBusiness, setSelectedBusiness] = useState("");
  const [points, setPoints] = useState("");
  const [transferLimit] = useState(10000);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { toast } = useToast();
  
  // Calculate transfer progress
  const transferProgress = Math.min((parseInt(points) || 0) / transferLimit * 100, 100);
  
  const handleBusinessSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedBusiness(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  };
  
  const selectBusiness = (business: string) => {
    setSelectedBusiness(business);
    setShowSuggestions(false);
  };
  
  const handleTransfer = () => {
    if (!selectedBusiness || !points || parseInt(points) <= 0) {
      toast({
        title: "Invalid input",
        description: "Please select a business and enter valid points",
        variant: "destructive",
      });
      return;
    }
    
    if (parseInt(points) > availablePoints) {
      toast({
        title: "Insufficient points",
        description: "You don't have enough points for this transfer",
        variant: "destructive",
      });
      return;
    }
    
    // Process transfer
    toast({
      title: "Transfer successful",
      description: `You've transferred ${points} points to ${selectedBusiness}`,
    });
    
    // Reset form
    setSelectedBusiness("");
    setPoints("");
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="business">Business Name or Email</Label>
        <div className="relative">
          <Input
            id="business"
            placeholder="Search for a verified business"
            value={selectedBusiness}
            onChange={handleBusinessSearch}
          />
          {showSuggestions && (
            <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-slate-200 max-h-64 overflow-auto">
              {mockBusinesses
                .filter(b => b.status === "verified" && 
                  (b.name.toLowerCase().includes(selectedBusiness.toLowerCase()) || 
                   b.id.toLowerCase().includes(selectedBusiness.toLowerCase())))
                .map(business => (
                  <div
                    key={business.id}
                    className="px-4 py-2 cursor-pointer hover:bg-slate-100"
                    onClick={() => selectBusiness(business.name)}
                  >
                    <div className="font-medium">{business.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {business.type} • {business.model}
                    </div>
                  </div>
                ))}
                {mockBusinesses.filter(b => 
                  b.status === "verified" && 
                  (b.name.toLowerCase().includes(selectedBusiness.toLowerCase()) || 
                   b.id.toLowerCase().includes(selectedBusiness.toLowerCase()))
                ).length === 0 && (
                  <div className="px-4 py-3 text-sm">
                    <p className="font-medium">No registered businesses found</p>
                    <p className="text-muted-foreground mt-1">
                      Can't find them? 
                      <Button variant="link" className="h-auto p-0 ml-1">
                        Invite them to Xcentro
                      </Button>
                    </p>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="points">Points to Transfer</Label>
        <Input
          id="points"
          type="number"
          placeholder="Enter points"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
        />
        <div className="text-xs text-muted-foreground flex justify-between pt-1">
          <span>Min: 100 points</span>
          <span>Max: {transferLimit.toLocaleString()} points</span>
        </div>
        <Progress value={transferProgress} className="h-1" />
      </div>
      
      <Button 
        onClick={handleTransfer} 
        disabled={!selectedBusiness || !points || parseInt(points) <= 0}
        className="w-full mt-4 gap-2"
      >
        <Send className="h-4 w-4" />
        Transfer Points
      </Button>
    </div>
  );
};

export default TransferForm;
