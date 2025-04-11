import { useState } from "react";
import { 
  User, Building, CreditCard, BellRing, BadgeCheck,
  Users, Shield, Globe, HelpCircle
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

const Settings = () => {
  const [activeTab, setActiveTab] = useState("account");

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

  return (
    <div className="h-full flex w-full flex-grow">
      {/* Left sidebar with tabs */}
      <div className="w-64 shrink-0 border-r border-border bg-muted/10">
        <nav className="sticky top-0 p-4 space-y-2">
          {tabItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-2 py-2 px-3 text-sm font-medium rounded-md transition-colors",
                activeTab === item.id
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50"
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
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