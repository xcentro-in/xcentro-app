
import { useState } from "react";
import { 
  LockIcon, 
  UserCog, 
  CreditCard, 
  BellRing, 
  Globe, 
  Shield, 
  User, 
  Mail, 
  Smartphone,
  Users,
  HelpCircle,
  Building,
  Plus,
  BadgeCheck
} from "lucide-react";
import { toast } from "sonner";
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

  // Array of tab items for the left sidebar
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

  // Function to render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "account":
        return <AccountSettings />;
      case "businesses":
        return <BusinessesTab />;
      case "subscription":
        return <SubscriptionSettings />;
      case "notifications":
        return <NotificationSettings />;
      case "rewards":
        return <RewardsTab />;
      case "users":
        return <UsersTab />;
      case "security":
        return <SecuritySettings />;
      case "integration":
        return <IntegrationSettings />;
      case "support":
        return <SupportSettings />;
      default:
        return <AccountSettings />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border pb-6">
        <SettingsHeader 
          title="Settings" 
          description="Manage your account preferences and application settings" 
        />
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col md:flex-row gap-8 mt-8">
        {/* Left sidebar with tabs */}
        <div className="md:w-64 shrink-0">
          <nav className="space-y-1 sticky top-24">
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

        {/* Right content area - Settings content */}
        <div className="flex-1 min-w-0 w-full pr-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
