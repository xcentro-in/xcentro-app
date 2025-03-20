import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
interface BankPayeeFormProps {
  onSubmit: () => void;
}
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
  return <form onSubmit={handleSubmit} className="space-y-6">
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
              <Input id="email" type="email" placeholder="For payment notifications" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number (Optional)</Label>
              <Input id="contactNumber" placeholder="For payment notifications" required />
            </div>
            
            
          </div>
          
          <div className="space-y-2">
            <Label>Tags (For categorization)</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {availableTags.map(tag => <Badge key={tag} variant={selectedTags.includes(tag) ? "default" : "outline"} className="cursor-pointer" onClick={() => toggleTag(tag)}>
                  {tag}
                </Badge>)}
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