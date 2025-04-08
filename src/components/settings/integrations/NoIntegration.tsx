
import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoIntegrationProps {
  onSelectSoftware: () => void;
}

const NoIntegration = ({ onSelectSoftware }: NoIntegrationProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
        <Database className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">No accounting software connected yet</h3>
      <p className="text-muted-foreground max-w-md">
        Connect to sync your invoices and automate payments across your financial ecosystem
      </p>
      <Button 
        onClick={onSelectSoftware}
        className="mt-4"
      >
        Select Accounting Software
      </Button>
    </div>
  );
};

export default NoIntegration;
