
import { CreditCard, BanknoteIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

const PaymentMethodCard = () => {
  return (
    <Card className="animate-fade-in" style={{ animationDelay: "150ms" }}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Payment Methods</CardTitle>
        <CardDescription>Manage your payment options</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border p-3 flex items-center justify-between bg-muted/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-medium">Corporate Visa •••• 4242</div>
              <div className="text-xs text-muted-foreground">Exp: 09/2025</div>
            </div>
          </div>
          <Badge>Default</Badge>
        </div>
        
        <div className="rounded-md border p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
              <BanknoteIcon className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <div className="font-medium">Business Checking</div>
              <div className="text-xs text-muted-foreground">Acct: ••••8790</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8">Set Default</Button>
        </div>
        
        <Button variant="outline" className="w-full gap-1 mt-2">
          <Plus className="h-4 w-4" />
          Add Payment Method
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodCard;
