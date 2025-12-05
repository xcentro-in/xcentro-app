
import PasswordSection from "./sections/PasswordSection";
import AnalyticsSection from "./sections/AnalyticsSection";
import TwoFactorSection from "./sections/TwoFactorSection";
import AuthorizedDevices from "./sections/AuthorizedDevices";
import { FeatureEnabled } from "../FeatureEnabled";

const SecuritySettings = () => {
  return (
    <div className="space-y-6 w-full max-w-5xl">
      <PasswordSection />
      <AnalyticsSection />
      <FeatureEnabled featureFlag="TWOFA_AUTHENTICATION">
        <TwoFactorSection />
      </FeatureEnabled>
      <FeatureEnabled featureFlag="AUTHORIZED_DEVICES">
        <AuthorizedDevices />
      </FeatureEnabled>
    </div>
  );
};

export default SecuritySettings;
