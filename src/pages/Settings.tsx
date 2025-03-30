
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const Settings = () => {
  return (
    <div className="space-y-8">
      <SettingsHeader 
        title="Settings" 
        description="Manage your account preferences and application settings" 
      />

      <Tabs defaultValue="account" className="w-full animate-fade-in">
        <TabsList className="mb-6">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="businesses" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Businesses
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Plans and Billing
          </TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="rewards">Rewards & Partners</TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Access
          </TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integration">Integrations</TabsTrigger>
          <TabsTrigger value="support" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Support
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <AccountSettings />
        </TabsContent>
        
        <TabsContent value="businesses">
          <BusinessesTab />
        </TabsContent>
        
        <TabsContent value="subscription">
          <SubscriptionSettings />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
        
        <TabsContent value="rewards">
          <RewardsTab />
        </TabsContent>
        
        <TabsContent value="users">
          <UsersTab />
        </TabsContent>
        
        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
        
        <TabsContent value="integration">
          <IntegrationSettings />
        </TabsContent>
        
        <TabsContent value="support">
          <SupportSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
