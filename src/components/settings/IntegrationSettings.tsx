
import { AccountingIntegrationSection } from "./integrations";
import ApiKeysSection from "./integrations/ApiKeysSection";

const IntegrationSettings = () => {
  return (
    <div className="space-y-6">
      <AccountingIntegrationSection />
      <ApiKeysSection />
    </div>
  );
};

export default IntegrationSettings;
