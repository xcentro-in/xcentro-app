
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { LockIcon, UserCog } from "lucide-react";

const SecuritySettings = () => {
  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default SecuritySettings;
