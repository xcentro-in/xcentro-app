
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccountingSoftware } from "./types";

interface ErrorIntegrationProps {
  selectedSoftware: string | null;
  accountingSoftwareOptions: AccountingSoftware[];
  isConnecting: boolean;
  onReconnect: () => void;
}

const ErrorIntegration = ({ 
  selectedSoftware, 
  accountingSoftwareOptions,
  isConnecting,
  onReconnect
}: ErrorIntegrationProps) => {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 p-2 rounded-full bg-amber-100">
          <AlertCircle className="h-5 w-5 text-amber-600" />
        </div>
        <div className="space-y-2">
          <h3 className="font-medium text-amber-800">
            {accountingSoftwareOptions.find(s => s.id === selectedSoftware)?.name} connection interrupted
          </h3>
          <p className="text-sm text-amber-700">
            We couldn't fetch your latest data. Please reconnect to continue syncing invoices.
          </p>
          <Button 
            variant="outline" 
            className="mt-2 border-amber-300 text-amber-700 hover:text-amber-800 hover:bg-amber-100"
            onClick={onReconnect}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Reconnecting...
              </>
            ) : "Reconnect"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorIntegration;
