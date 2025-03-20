
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Loader2, Info, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface BankPayeeFormProps {
  onSubmit: () => void;
}

// Tag descriptions for tooltips
const tagDescriptions: Record<string, string> = {
  "Vendor": "A company or individual that provides goods to your business",
  "Supplier": "A business that provides raw materials or components to your company",
  "Contractor": "An independent worker hired for specific projects or tasks",
  "Service Provider": "A company that offers services rather than physical products",
  "Consultant": "Professional who provides expert advice in a particular area"
};

const BankPayeeForm = ({
  onSubmit
}: BankPayeeFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [accountNumberMatch, setAccountNumberMatch] = useState(true);
  const [bankName, setBankName] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [isValidatingIfsc, setIsValidatingIfsc] = useState(false);
  const [ifscValid, setIfscValid] = useState<boolean | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeTagInfo, setActiveTagInfo] = useState<string | null>(null);
  
  const availableTags = ["Vendor", "Supplier", "Contractor", "Service Provider", "Consultant"];
  
  const handleIfscChange = (value: string) => {
    setIfscCode(value);
    if (value.length === 11) {
      // IFSC codes are 11 characters
      setIsValidatingIfsc(true);
      // Simulate IFSC validation
      setTimeout(() => {
        setIsValidatingIfsc(false);
        setIfscValid(true);
        setBankName("National Bank - Mumbai Branch"); // Auto-populated based on IFSC
      }, 1000);
    } else {
      setIfscValid(null);
      setBankName("");
    }
  };
  
  const handleConfirmAccountChange = (value: string) => {
    setConfirmAccountNumber(value);
    setAccountNumberMatch(value === accountNumber || value === "");
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit();
    }, 1000);
  };
  
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const toggleTagInfo = (tag: string) => {
    setActiveTagInfo(activeTagInfo === tag ? null : tag);
  };

  return <form onSubmit={handleSubmit} className="space-y-8">
      {/* Tag selection section - Moved to top for prominence */}
      <Card className="border-2 border-purple-100 bg-purple-50/30">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-purple-600" />
            <Label className="text-lg font-medium text-purple-800">Categorize Your Payee</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-purple-500 hover:text-purple-700 hover:bg-purple-100">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Select appropriate tags to categorize this payee for better reporting and insights</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-2">
            {availableTags.map(tag => (
              <div key={tag} className="flex items-center">
                <Badge 
                  key={tag} 
                  variant={selectedTags.includes(tag) ? "default" : "outline"} 
                  className={`cursor-pointer text-sm py-1.5 px-3 transition-all ${
                    selectedTags.includes(tag) 
                      ? "bg-purple-600 hover:bg-purple-700" 
                      : "hover:border-purple-400 hover:text-purple-700"
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                      <Info className="h-3 w-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="max-w-xs bg-slate-50 border-slate-200">
                    <div className="text-sm">
                      <p className="font-medium text-slate-800 mb-1">{tag}</p>
                      <p className="text-slate-600">{tagDescriptions[tag]}</p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="payeeName">Payee Name (Business/Individual)</Label>
              <Input id="payeeName" placeholder="Enter payee name" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gstin">GSTIN</Label>
              <Input id="gstin" placeholder="Enter GSTIN number" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Bank Account Number</Label>
              <Input id="accountNumber" placeholder="Enter account number" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmAccountNumber" className={!accountNumberMatch ? "text-destructive" : ""}>
                Confirm Account Number
              </Label>
              <Input id="confirmAccountNumber" placeholder="Re-enter account number" value={confirmAccountNumber} onChange={e => handleConfirmAccountChange(e.target.value)} className={!accountNumberMatch ? "border-destructive" : ""} required />
              {!accountNumberMatch && confirmAccountNumber && <p className="text-xs text-destructive">Account numbers do not match</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ifscCode">IFSC Code</Label>
              <div className="relative">
                <Input id="ifscCode" placeholder="Enter IFSC code" value={ifscCode} onChange={e => handleIfscChange(e.target.value)} className={ifscValid === true ? "pr-10 border-green-500" : "pr-10"} required />
                {isValidatingIfsc && <Loader2 className="absolute right-3 top-2.5 h-5 w-5 animate-spin text-muted-foreground" />}
                {ifscValid === true && <CheckCircle className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input id="bankName" placeholder="Auto-populated from IFSC" value={bankName} readOnly className="bg-muted" />
              <p className="text-xs text-muted-foreground">This will be auto-filled based on IFSC code</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address (Optional)</Label>
              <Input id="email" type="email" placeholder="For payment notifications" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number (Optional)</Label>
              <Input id="contactNumber" placeholder="For payment notifications" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || !accountNumberMatch}>
          {isSubmitting ? <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Saving Payee...
            </> : <>Save Bank Payee</>}
        </Button>
      </div>
    </form>;
};

export default BankPayeeForm;
