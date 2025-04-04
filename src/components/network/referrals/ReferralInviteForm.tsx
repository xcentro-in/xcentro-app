
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ReferralInviteForm = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleInvite = async () => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Invitation sent!",
      description: `We've sent an invitation to ${email}`,
    });
    
    setEmail("");
    setIsSubmitting(false);
  };
  
  return (
    <Card className="bg-slate-50 border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Send Invitation</CardTitle>
        <CardDescription>
          Each successful referral earns you 500 points
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Business Email</Label>
          <div className="flex gap-2">
            <Input
              id="email"
              type="email"
              placeholder="Enter business email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button 
              onClick={handleInvite}
              disabled={isSubmitting || !email}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              Send Invite
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralInviteForm;
