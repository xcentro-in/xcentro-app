
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { AccountingSoftware } from "./types";

interface SoftwareSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSoftware: string | null;
  isConnecting: boolean;
  accountingSoftwareOptions: AccountingSoftware[];
  onSelectSoftware: (id: string) => void;
  onConnectSoftware: () => void;
}

const SoftwareSelectionDialog = ({
  open,
  onOpenChange,
  selectedSoftware,
  isConnecting,
  accountingSoftwareOptions,
  onSelectSoftware,
  onConnectSoftware
}: SoftwareSelectionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Accounting Software</DialogTitle>
          <DialogDescription>
            Choose your accounting software to sync invoices and automate payments
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <RadioGroup 
            value={selectedSoftware || ""} 
            onValueChange={onSelectSoftware}
            className="space-y-3"
          >
            {accountingSoftwareOptions.map(software => (
              <div
                key={software.id}
                className={`flex items-center rounded-lg border p-4 cursor-pointer transition-colors ${
                  selectedSoftware === software.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                }`}
                onClick={() => onSelectSoftware(software.id)}
              >
                <RadioGroupItem value={software.id} id={software.id} className="sr-only" />
                <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center font-semibold text-sm mr-4 overflow-hidden">
                  <img
                    src={software.icon}
                    alt={`${software.name} logo`}
                    className="h-8 w-8 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor={software.id} className="font-medium cursor-pointer">
                    {software.name}
                  </label>
                  <p className="text-sm text-muted-foreground">
                    {software.description}
                  </p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={onConnectSoftware} 
            disabled={!selectedSoftware || isConnecting}
          >
            {isConnecting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : "Connect"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SoftwareSelectionDialog;
