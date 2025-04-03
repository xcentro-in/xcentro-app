
import { Check, Clock, FileText, HelpCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AccountingSoftware } from "./types";

interface ConnectedIntegrationProps {
  selectedSoftware: string | null;
  accountingSoftwareOptions: AccountingSoftware[];
  onChangeSoftware: () => void;
}

const ConnectedIntegration = ({ 
  selectedSoftware, 
  accountingSoftwareOptions,
  onChangeSoftware 
}: ConnectedIntegrationProps) => {
  return (
    <div className="rounded-lg border p-6 space-y-4">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-md bg-green-100 flex items-center justify-center text-green-700 font-semibold text-lg">
          {accountingSoftwareOptions.find(s => s.id === selectedSoftware)?.icon}
        </div>
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">
              Connected to {accountingSoftwareOptions.find(s => s.id === selectedSoftware)?.name}
            </h3>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Check className="h-3 w-3 mr-1" /> Active
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Invoices will sync daily to show upcoming payables
          </p>
          
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>Last synced: Today at 09:15 AM</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 mt-4 pt-4 border-t">
        <Button variant="outline" className="gap-1">
          <FileText className="h-4 w-4" />
          View Synced Invoices
        </Button>
        <Button 
          variant="ghost" 
          className="text-muted-foreground" 
          onClick={onChangeSoftware}
        >
          Change Software
        </Button>
        <IntegrationHelpDialog />
      </div>
    </div>
  );
};

const IntegrationHelpDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 rounded-full ml-auto">
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Help</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>About Accounting Integration</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <h4 className="font-medium">What happens after I connect?</h4>
            <p className="text-sm text-muted-foreground">
              We'll automatically sync your invoices daily to help you track upcoming payments.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Will old invoices get pulled?</h4>
            <p className="text-sm text-muted-foreground">
              Yes, we'll import invoices from the last 90 days to start, then keep everything in sync going forward.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Where can I find synced invoices?</h4>
            <p className="text-sm text-muted-foreground">
              Go to Payments → Upcoming Payables to see all your synced invoices ready for payment.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectedIntegration;
