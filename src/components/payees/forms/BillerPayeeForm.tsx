
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { CheckCircle, Loader2 } from "lucide-react";

interface BillerPayeeFormProps {
  onSubmit: () => void;
}

const BillerPayeeForm = ({ onSubmit }: BillerPayeeFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoPayment, setAutoPayment] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit();
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="billerName">Biller Type</Label>
              <Select required defaultValue="electricity">
                <SelectTrigger id="billerName">
                  <SelectValue placeholder="Select biller type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electricity">Electricity</SelectItem>
                  <SelectItem value="internet">Internet</SelectItem>
                  <SelectItem value="water">Water</SelectItem>
                  <SelectItem value="telephone">Telephone</SelectItem>
                  <SelectItem value="gas">Gas</SelectItem>
                  <SelectItem value="tv">Television</SelectItem>
                  <SelectItem value="saas">SaaS Tools</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                  <SelectItem value="other">Other Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="billerDisplayName">Biller Display Name</Label>
              <Input id="billerDisplayName" placeholder="e.g. City Electric" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customerId">Customer/Account ID</Label>
              <Input id="customerId" placeholder="Enter customer ID" required />
              <p className="text-xs text-muted-foreground">Found on your bill or account statement</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="billingCycle">Billing Cycle</Label>
              <Select defaultValue="monthly">
                <SelectTrigger id="billingCycle">
                  <SelectValue placeholder="Select billing cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                  <SelectItem value="one-time">One-Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="For bill confirmations & receipts" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input id="contactNumber" placeholder="For bill confirmations & receipts" required />
            </div>
            
            <div className="col-span-2 flex items-center justify-between space-y-0 rounded-md border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">Enable Auto-Payment</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically pay this bill when it's due
                </p>
              </div>
              <Switch
                checked={autoPayment}
                onCheckedChange={setAutoPayment}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Saving Payee...
            </>
          ) : (
            <>Save Biller Payee</>
          )}
        </Button>
      </div>
    </form>
  );
};

export default BillerPayeeForm;
