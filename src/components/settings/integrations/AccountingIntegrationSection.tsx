import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AccountingSoftware, IntegrationStatus } from "./types";
import NoIntegration from "./NoIntegration";
import ConnectedIntegration from "./ConnectedIntegration";
import ErrorIntegration from "./ErrorIntegration";
import SoftwareSelectionDialog from "./SoftwareSelectionDialog";

const accountingSoftwareOptions: AccountingSoftware[] = [
  {
    id: "zoho",
    name: "Zoho Books",
    description: "Complete accounting solution for growing businesses",
    icon: "https://ik.imagekit.io/mddzdzy9m/Xcentro/zohobooks_icon.png?updatedAt=1745244401455"
  },
  {
    id: "tally",
    name: "Tally",
    description: "Widely used in India for business accounting",
    icon: "https://ik.imagekit.io/mddzdzy9m/Xcentro/tally_logo.png?updatedAt=1745244442312"
  },
  {
    id: "busy",
    name: "Busy",
    description: "Popular business accounting software",
    icon: "https://ik.imagekit.io/mddzdzy9m/Xcentro/busy_logo.png?updatedAt=1745245079718"
  }
];

const AccountingIntegrationSection = () => {
  const [hasIntegration, setHasIntegration] = useState(false);
  const [integrationStatus, setIntegrationStatus] = useState<IntegrationStatus>(null);
  const [selectedSoftware, setSelectedSoftware] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showSoftwareModal, setShowSoftwareModal] = useState(false);

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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Accounting Integrations</CardTitle>
        <CardDescription>
          Connect your accounting software for seamless data transfer
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasIntegration && (
          <NoIntegration onSelectSoftware={() => setShowSoftwareModal(true)} />
        )}

        {hasIntegration && integrationStatus === "connected" && (
          <ConnectedIntegration 
            selectedSoftware={selectedSoftware}
            accountingSoftwareOptions={accountingSoftwareOptions}
            onChangeSoftware={handleChangeIntegration}
          />
        )}

        {hasIntegration && integrationStatus === "error" && (
          <ErrorIntegration 
            selectedSoftware={selectedSoftware}
            accountingSoftwareOptions={accountingSoftwareOptions}
            isConnecting={isConnecting}
            onReconnect={handleReconnect}
          />
        )}

        <SoftwareSelectionDialog
          open={showSoftwareModal}
          onOpenChange={setShowSoftwareModal}
          selectedSoftware={selectedSoftware}
          isConnecting={isConnecting}
          accountingSoftwareOptions={accountingSoftwareOptions}
          onSelectSoftware={handleSelectSoftware}
          onConnectSoftware={handleConnectSoftware}
        />
      </CardContent>
    </Card>
  );
};

export default AccountingIntegrationSection;
