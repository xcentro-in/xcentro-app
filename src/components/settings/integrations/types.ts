
export type IntegrationStatus = "connected" | "error" | null;

export type AccountingSoftware = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

export interface IntegrationProps {
  hasIntegration: boolean;
  integrationStatus: IntegrationStatus;
  selectedSoftware: string | null;
  isConnecting: boolean;
  accountingSoftwareOptions: AccountingSoftware[];
  onChangeSoftware: () => void;
  onReconnect: () => void;
}
