import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LockIcon, UserCog, CreditCard, BellRing, Globe, Shield, User, Mail, Smartphone, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LoyaltyPartnersSettings from "@/components/settings/LoyaltyPartnersSettings";
import UserAccessTabs from "@/components/user-access/UserAccessTabs";
import { LoyaltyPartner } from "@/types/rewards";
import { mockUsers, mockPendingInvites } from "@/data/mockUsers";
import { toast } from "sonner";

const Settings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    payments: true,
    security: true,
    marketing: false
  });
  
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
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="rewards">Rewards & Partners</TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Access
          </TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integration">Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Personal Information</CardTitle>
              <CardDescription>
                Update your account details and profile settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-2xl font-semibold">
                  JD
                </div>
                <div>
                  <Button variant="outline" size="sm">Upload Photo</Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john.doe@company.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+1 (555) 123-4567" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Business Profile</CardTitle>
              <CardDescription>
                Configure your business information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" defaultValue="Acme Corporation" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type</Label>
                <Select defaultValue="corporation">
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corporation">Corporation</SelectItem>
                    <SelectItem value="llc">LLC</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="soleProprietorship">Sole Proprietorship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID / EIN</Label>
                <Input id="taxId" defaultValue="XX-XXXXXXX" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you receive notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive push notifications on your devices</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                  />
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">What to notify about</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-payments" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      Payment Activity
                    </Label>
                    <Switch 
                      id="notify-payments"
                      checked={notifications.payments}
                      onCheckedChange={(checked) => setNotifications({...notifications, payments: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-security" className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      Security Alerts
                    </Label>
                    <Switch 
                      id="notify-security"
                      checked={notifications.security}
                      onCheckedChange={(checked) => setNotifications({...notifications, security: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-marketing" className="flex items-center gap-2">
                      <BellRing className="h-4 w-4 text-muted-foreground" />
                      Marketing & Updates
                    </Label>
                    <Switch 
                      id="notify-marketing"
                      checked={notifications.marketing}
                      onCheckedChange={(checked) => setNotifications({...notifications, marketing: checked})}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="rewards" className="space-y-6">
          <LoyaltyPartnersSettings 
            savedPartners={loyaltyPartners}
            onSavePartner={handleSavePartner}
            onDeletePartner={handleDeletePartner}
          />
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Rewards Preferences</CardTitle>
              <CardDescription>
                Customize how you earn and redeem rewards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications for Rewards</Label>
                  <p className="text-sm text-muted-foreground">Receive updates about new reward opportunities</p>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-redeem">Automatic Redemption</Label>
                  <p className="text-sm text-muted-foreground">Automatically redeem points when you reach thresholds</p>
                </div>
                <Switch id="auto-redeem" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="redemption-threshold">Redemption Threshold</Label>
                <Select defaultValue="10000">
                  <SelectTrigger>
                    <SelectValue placeholder="Select threshold" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5000">5,000 points</SelectItem>
                    <SelectItem value="10000">10,000 points</SelectItem>
                    <SelectItem value="25000">25,000 points</SelectItem>
                    <SelectItem value="50000">50,000 points</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="preferred-category">Preferred Redemption Category</Label>
                <Select defaultValue="flights">
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flights">Flight Partners</SelectItem>
                    <SelectItem value="hotels">Hotel Partners</SelectItem>
                    <SelectItem value="events">VIP Events</SelectItem>
                    <SelectItem value="travel">Luxury Travel</SelectItem>
                    <SelectItem value="business">Business Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Add, edit, or revoke access for team members across your organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserAccessTabs
                users={mockUsers}
                pendingInvites={mockPendingInvites}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Password & Authentication</CardTitle>
              <CardDescription>
                Update your password and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3">
              <Button variant="outline">Cancel</Button>
              <Button>Update Password</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an additional layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <LockIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Secure your account with 2FA</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-600">
                  Enabled
                </Badge>
              </div>
              
              <Button variant="outline" className="w-full">Reconfigure 2FA</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Authorized Devices</CardTitle>
              <CardDescription>
                Manage devices that are logged into your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {["MacBook Pro - Chrome", "iPhone 13 - Safari", "Windows PC - Edge"].map((device, i) => (
                <div key={device} className="flex items-center justify-between p-3 rounded-md border">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserCog className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{device}</div>
                      <div className="text-xs text-muted-foreground">
                        {i === 0 ? "Current Device" : `Last active ${i + 1} days ago`}
                      </div>
                    </div>
                  </div>
                  {i !== 0 && <Button size="sm" variant="ghost">Revoke</Button>}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Accounting Integrations</CardTitle>
              <CardDescription>
                Connect your accounting software for seamless data transfer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "QuickBooks", connected: true },
                { name: "Xero", connected: false },
                { name: "Zoho Books", connected: false },
              ].map((app) => (
                <div key={app.name} className="flex items-center justify-between p-3 rounded-md border">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center font-semibold text-sm">
                      {app.name.substring(0, 2)}
                    </div>
                    <div className="font-medium">{app.name}</div>
                  </div>
                  <Button size="sm" variant={app.connected ? "outline" : "default"}>
                    {app.connected ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
          
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
                  <Badge variant="outline">Active</Badge>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
