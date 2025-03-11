
import { 
  Settings as SettingsIcon, 
  User, 
  CreditCard, 
  Lock, 
  BellRing, 
  Globe,
  Building,
  Users
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const Settings = () => {
  const [notifications, setNotifications] = useState({
    payments: true,
    security: true,
    marketing: false,
    updates: true
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight animate-slide-up">Account Settings</h1>
        <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: "50ms" }}>
          Manage your account preferences and business settings
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden md:inline">Payment</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <BellRing className="h-4 w-4" />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="hidden md:inline">Business</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account details and public profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <input
                    id="firstName"
                    defaultValue="John"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <input
                    id="lastName"
                    defaultValue="Smith"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <input
                    id="email"
                    type="email"
                    defaultValue="john.smith@company.com"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <input
                    id="role"
                    defaultValue="Business Owner"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current password</Label>
                  <input
                    id="current-password"
                    type="password"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New password</Label>
                  <input
                    id="new-password"
                    type="password"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Update Password</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { type: "credit", last4: "4242", expiry: "04/24", default: true },
                  { type: "bank", name: "Business Checking", account: "***6789", default: false }
                ].map((method, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full ${method.type === "credit" ? "bg-primary/10" : "bg-purple-500/10"} flex items-center justify-center`}>
                        {method.type === "credit" ? (
                          <CreditCard className={`h-5 w-5 ${method.type === "credit" ? "text-primary" : "text-purple-500"}`} />
                        ) : (
                          <Building className="h-5 w-5 text-purple-500" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">
                          {method.type === "credit" ? `Credit Card ending in ${method.last4}` : method.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {method.type === "credit" ? `Expires ${method.expiry}` : `Account ${method.account}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {method.default && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Default</span>
                      )}
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what notifications you receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="payments">Payment notifications</Label>
                    <div className="text-sm text-muted-foreground">
                      Receive updates about your payment activity
                    </div>
                  </div>
                  <Switch
                    id="payments"
                    checked={notifications.payments}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, payments: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="security">Security alerts</Label>
                    <div className="text-sm text-muted-foreground">
                      Get notified about security updates and unauthorized activities
                    </div>
                  </div>
                  <Switch
                    id="security"
                    checked={notifications.security}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, security: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing">Marketing emails</Label>
                    <div className="text-sm text-muted-foreground">
                      Receive promotions, offers and newsletters
                    </div>
                  </div>
                  <Switch
                    id="marketing"
                    checked={notifications.marketing}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="updates">Product updates</Label>
                    <div className="text-sm text-muted-foreground">
                      Get notified about new features and platform updates
                    </div>
                  </div>
                  <Switch
                    id="updates"
                    checked={notifications.updates}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, updates: checked })}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Manage your business details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business name</Label>
                  <input
                    id="businessName"
                    defaultValue="Acme Corporation"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business type</Label>
                  <input
                    id="businessType"
                    defaultValue="Limited Company"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <input
                    id="industry"
                    defaultValue="Technology"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeCount">Employee count</Label>
                  <input
                    id="employeeCount"
                    defaultValue="50-100"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessAddress">Business address</Label>
                <textarea
                  id="businessAddress"
                  defaultValue="123 Business Street, Suite 200, San Francisco, CA 94107"
                  className="w-full h-24 rounded-md border border-input bg-background px-3 py-2"
                />
              </div>
              <div className="flex justify-end">
                <Button>Update Business Info</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team Management</CardTitle>
              <CardDescription>Manage your team members and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {[
                  { name: "Sarah Johnson", email: "sarah@company.com", role: "Admin" },
                  { name: "Mike Wilson", email: "mike@company.com", role: "Member" },
                  { name: "Lisa Brown", email: "lisa@company.com", role: "Accountant" }
                ].map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-secondary px-2 py-1 rounded">{member.role}</span>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4">
                  <Users className="h-4 w-4 mr-2" />
                  Invite Team Member
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
