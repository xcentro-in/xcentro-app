import { useState } from "react";
import { 
  User, Building, CreditCard, BellRing, BadgeCheck,
  Users, Shield, Globe, HelpCircle, ChevronLeft, ChevronRight
} from "lucide-react";
import AccountSettings from "@/components/settings/AccountSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import IntegrationSettings from "@/components/settings/IntegrationSettings";
import SupportSettings from "@/components/settings/SupportSettings";
import SubscriptionSettings from "@/components/settings/SubscriptionSettings";
import SettingsHeader from "@/components/settings/SettingsHeader";
import BusinessesTab from "@/components/settings/BusinessesTab";
import RewardsTab from "@/components/settings/RewardsTab";
import UsersTab from "@/components/settings/UsersTab";
import { cn } from "@/lib/utils";
import { usePageTitle } from "@/contexts/PageTitleContext";
import { useEffect } from "react";
import { FeatureFlagName } from "@/lib/featureFlags";
import { FeatureEnabled } from "@/components/FeatureEnabled";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { setTitle } = usePageTitle();
  
  useEffect(() => {
    setTitle("Settings");
  }, [setTitle]);

  const tabItems = [
    { id: "account", label: "Account", icon: <User className="h-4 w-4" /> },
    { id: "businesses", label: "Businesses", icon: <Building className="h-4 w-4" /> },
    { id: "subscription", label: "Plans & Billing", icon: <CreditCard className="h-4 w-4" /> },
    { id: "notifications", label: "Notifications", icon: <BellRing className="h-4 w-4" /> },
    { id: "rewards", label: "Rewards & Partners", icon: <BadgeCheck className="h-4 w-4" /> },
    { id: "users", label: "User Access", icon: <Users className="h-4 w-4" /> },
    { id: "security", label: "Security", icon: <Shield className="h-4 w-4" /> },
    { id: "integration", label: "Integrations", icon: <Globe className="h-4 w-4" /> },
    { id: "support", label: "Support", icon: <HelpCircle className="h-4 w-4" /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "account": return <AccountSettings />;
      case "businesses": return <BusinessesTab />;
      case "subscription": return <SubscriptionSettings />;
      case "notifications": return <NotificationSettings />;
      case "rewards": return <RewardsTab />;
      case "users": return <UsersTab />;
      case "security": return <SecuritySettings />;
      case "integration": return <IntegrationSettings />;
      case "support": return <SupportSettings />;
      default: return <AccountSettings />;
    }
  };

  const categoryFeatureFlags: Record<string, FeatureFlagName> = {
    integration: 'ERP_INTEGRATION',
    rewards: 'REWARD_POINT_SYSTEM',
  } as const;

  return (
    <div className="h-full flex w-full flex-grow overflow-visible">
      {/* Left sidebar with tabs */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} shrink-0 border-r border-border bg-muted/10 transition-all duration-300 relative overflow-visible`}>
        <nav className="sticky top-0 p-4 space-y-2 relative overflow-visible">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-4 bg-background rounded-full p-1 border border-border shadow-sm hover:bg-accent transition-colors z-10"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
          {tabItems.map((item) => {
            const featureFlag = categoryFeatureFlags[item.id] || 'ALLOWED_FIELDS';
            return(
              <FeatureEnabled key={item.id} featureFlag={featureFlag}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-2 py-2 px-3 text-sm font-medium rounded-md transition-colors",
                  activeTab === item.id
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50",
                  sidebarCollapsed && "justify-center px-2"
                )}
              >
                {item.icon}
                {!sidebarCollapsed && item.label}
              </button>
              </FeatureEnabled>
            )
          })}
        </nav>
      </div>

      {/* Right content area */}
      <div className="flex-1 min-h-screen w-full">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border p-6">
          <SettingsHeader 
            title="Settings" 
            description="Manage your account preferences and application settings" 
          />
        </div>
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;