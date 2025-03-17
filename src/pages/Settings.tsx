
import { useState, useEffect } from "react";
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
  Plus
} from "lucide-react";
import { LoyaltyPartner } from "@/types/rewards";
import { mockUsers, mockPendingInvites } from "@/data/mockUsers";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import AccountSettings from "@/components/settings/AccountSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import RewardPreferences from "@/components/settings/RewardPreferences";
import SecuritySettings from "@/components/settings/SecuritySettings";
import IntegrationSettings from "@/components/settings/IntegrationSettings";
import UserAccessTabs from "@/components/user-access/UserAccessTabs";
import SupportSettings from "@/components/settings/SupportSettings";
import BusinessManagement from "@/components/settings/BusinessManagement";

const Settings = () => {
  const navigate = useNavigate();
  const [loyaltyPartners, setLoyaltyPartners] = useState<LoyaltyPartner[]>([
    {
      id: "emirates",
      name: "Emirates Skywards",
      type: "airline",
      conversionRatio: 0.5,
      category: "flights",
      membershipDetails: {
        membershipNumber: "EK123456789",
        registeredName: "John Doe",
        email: "john@example.com"
      }
    }
  ]);
  
  const handleSavePartner = (partner: LoyaltyPartner) => {
    const existingIndex = loyaltyPartners.findIndex(p => p.id === partner.id);
    
    if (existingIndex >= 0) {
      const updatedPartners = [...loyaltyPartners];
      updatedPartners[existingIndex] = partner;
      setLoyaltyPartners(updatedPartners);
    } else {
      setLoyaltyPartners([...loyaltyPartners, partner]);
    }
  };
  
  const handleDeletePartner = (partnerId: string) => {
    setLoyaltyPartners(loyaltyPartners.filter(p => p.id !== partnerId));
  };

  const handleAddBusiness = () => {
    navigate("/business-onboarding");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight animate-slide-up">Settings</h1>
        <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: "50ms" }}>
          Manage your account preferences and application settings
        </p>
      </div>

      <Tabs defaultValue="account" className="w-full animate-fade-in">
        <TabsList className="mb-6">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="businesses" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Businesses
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Business Management</h2>
              <p className="text-muted-foreground mt-1">Manage your business profiles and add new businesses</p>
            </div>
            <Button 
              className="flex items-center gap-2" 
              onClick={handleAddBusiness}
            >
              <Plus className="h-4 w-4" />
              Add New Business
            </Button>
          </div>
          <BusinessManagement />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
        
        <TabsContent value="rewards">
          <RewardPreferences 
            savedPartners={loyaltyPartners}
            onSavePartner={handleSavePartner}
            onDeletePartner={handleDeletePartner}
          />
        </TabsContent>
        
        <TabsContent value="users" className="space-y-6">
          <UserAccessTabs
            users={mockUsers}
            pendingInvites={mockPendingInvites}
          />
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
