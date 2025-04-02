
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { AlertCircle, Check, ChevronRight, Clock, Database, FileText, HelpCircle, Info, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const IntegrationSettings = () => {
  const [hasIntegration, setHasIntegration] = useState(false);
  const [integrationStatus, setIntegrationStatus] = useState<"connected" | "error" | null>(null);
  const [selectedSoftware, setSelectedSoftware] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showSoftwareModal, setShowSoftwareModal] = useState(false);

  const accountingSoftwareOptions = [
    {
      id: "quickbooks",
      name: "QuickBooks",
      description: "Most popular accounting software for small businesses",
      icon: "QB"
    },
    {
      id: "zoho",
      name: "Zoho Books",
      description: "Complete accounting solution for growing businesses",
      icon: "ZB"
    },
    {
      id: "tally",
      name: "Tally",
      description: "Widely used in India for business accounting",
      icon: "TL"
    }
  ];

  const handleSelectSoftware = (id: string) => {
    setSelectedSoftware(id);
  };

  const handleConnectSoftware = () => {
    if (!selectedSoftware) return;
    
    setIsConnecting(true);
    
    // Simulate API connection
    setTimeout(() => {
      setIsConnecting(false);
      setHasIntegration(true);
      setIntegrationStatus("connected");
      setShowSoftwareModal(false);
      
      toast.success(`Successfully connected to ${accountingSoftwareOptions.find(s => s.id === selectedSoftware)?.name}`);
    }, 2000);
  };

  const handleDisconnect = () => {
    setHasIntegration(false);
    setIntegrationStatus(null);
    setSelectedSoftware(null);
    toast.info("Disconnected from accounting software");
  };

  const handleReconnect = () => {
    setIsConnecting(true);
    
    // Simulate reconnection
    setTimeout(() => {
      setIsConnecting(false);
      setIntegrationStatus("connected");
      toast.success("Reconnected successfully");
    }, 2000);
  };

  const handleChangeIntegration = () => {
    setShowSoftwareModal(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Accounting Integrations</CardTitle>
          <CardDescription>
            Connect your accounting software for seamless data transfer
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* No Integration State */}
          {!hasIntegration && (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <Database className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No accounting software connected yet</h3>
              <p className="text-muted-foreground max-w-md">
                Connect to sync your invoices and automate payments across your financial ecosystem
              </p>
              <Button 
                onClick={() => setShowSoftwareModal(true)}
                className="mt-4"
              >
                Select Accounting Software
              </Button>
            </div>
          )}

          {/* Connected State */}
          {hasIntegration && integrationStatus === "connected" && (
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
                  onClick={handleChangeIntegration}
                >
                  Change Software
                </Button>
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
              </div>
            </div>
          )}

          {/* Error State */}
          {hasIntegration && integrationStatus === "error" && (
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
                    onClick={handleReconnect}
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
          )}
        </CardContent>
      </Card>

      {/* Software Selection Modal */}
      <Dialog open={showSoftwareModal} onOpenChange={setShowSoftwareModal}>
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
              onValueChange={handleSelectSoftware}
              className="space-y-3"
            >
              {accountingSoftwareOptions.map(software => (
                <div
                  key={software.id}
                  className={`flex items-center rounded-lg border p-4 cursor-pointer transition-colors ${
                    selectedSoftware === software.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                  }`}
                  onClick={() => handleSelectSoftware(software.id)}
                >
                  <RadioGroupItem value={software.id} id={software.id} className="sr-only" />
                  <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center font-semibold text-sm mr-4">
                    {software.icon}
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
            <Button variant="outline" onClick={() => setShowSoftwareModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConnectSoftware} 
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

      {/* API Keys Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">API Access</CardTitle>
          <CardDescription>
            Manage API keys for developer integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 rounded-md border">
            <div className="flex items-center justify-between mb-3">
              <div className="font-medium">Production API Key</div>
              <Badge variant="outline" className="bg-green-400">Active</Badge>
            </div>
            <div className="mb-3">
              <Input value="••••••••••••••••••••••••••••••" readOnly />
            </div>
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline">Copy Key</Button>
              <Button size="sm" variant="outline">Regenerate</Button>
            </div>
          </div>
          <Button className="w-full">Create New API Key</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationSettings;
