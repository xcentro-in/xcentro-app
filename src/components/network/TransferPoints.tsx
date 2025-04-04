
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle 
} from "@/components/ui/card";
import { Send, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockBusinesses } from "@/data/mockBusinesses";
import { Progress } from "@/components/ui/progress";

// Mock data for transfer history
const transferHistory = [
  { 
    id: "1",
    recipient: "XYZ Enterprises",
    email: "accounts@xyzenterprises.com",
    points: 1200,
    date: "Apr 2, 2025",
    status: "success"
  },
  {
    id: "2",
    recipient: "New Venture LLC",
    email: "finance@newventure.com",
    points: 800,
    date: "Mar 28, 2025",
    status: "pending"
  },
  {
    id: "3",
    recipient: "Tech Solutions Inc.",
    email: "admin@techsolutions.com",
    points: 1500,
    date: "Mar 25, 2025",
    status: "success"
  }
];

const TransferPoints = () => {
  const [selectedBusiness, setSelectedBusiness] = useState("");
  const [points, setPoints] = useState("");
  const [transferLimit] = useState(10000);
  const [availablePoints] = useState(24530);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { toast } = useToast();
  
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

  // Calculate transfer progress
  const transferProgress = Math.min((parseInt(points) || 0) / transferLimit * 100, 100);
  
  return (
    <div className="space-y-6">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold mb-2">Transfer Points</h2>
        <p className="text-muted-foreground">
          Send your points to other businesses you own or partner with.
        </p>
      </div>
      
      <Card className="bg-slate-50 border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Transfer Details</CardTitle>
          <CardDescription>
            You have {availablePoints.toLocaleString()} points available to transfer
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
                            Invite them to PaySphere
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
        </CardContent>
      </Card>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Transfer History</h3>
        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recipient</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transferHistory.length > 0 ? (
                transferHistory.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell>
                      <div>{transfer.recipient}</div>
                      <div className="text-xs text-muted-foreground">{transfer.email}</div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {transfer.points.toLocaleString()}
                    </TableCell>
                    <TableCell>{transfer.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {transfer.status === "success" ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-green-600">Success</span>
                          </>
                        ) : transfer.status === "pending" ? (
                          <>
                            <Clock className="h-4 w-4 text-amber-500" />
                            <span className="text-amber-600">Pending</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <span className="text-red-600">Failed</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No transfer history
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TransferPoints;
