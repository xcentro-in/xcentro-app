
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { LockIcon, UserCog, Pencil } from "lucide-react";
import { toast } from "sonner";

const SecuritySettings = () => {
  // Password state
  const [editingPassword, setEditingPassword] = useState(false);
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleEditPassword = () => {
    setPasswordInfo({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setEditingPassword(true);
  };

  const handleCancelPassword = () => {
    setEditingPassword(false);
  };

  const handleSavePassword = () => {
    // Here you would normally validate the password and update it
    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    if (!passwordInfo.currentPassword) {
      toast.error("Current password is required");
      return;
    }
    if (passwordInfo.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    
    setEditingPassword(false);
    toast.success("Password updated successfully");
  };

  const handlePasswordChange = (field: keyof typeof passwordInfo, value: string) => {
    setPasswordInfo({ ...passwordInfo, [field]: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Password & Authentication</CardTitle>
              <CardDescription>
                Update your password and security settings
              </CardDescription>
            </div>
            {!editingPassword && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handleEditPassword}
              >
                <Pencil className="h-4 w-4" />
                Change Password
              </Button>
            )}
          </div>
        </CardHeader>
        {editingPassword ? (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input 
                id="currentPassword" 
                type="password" 
                value={passwordInfo.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input 
                id="newPassword" 
                type="password" 
                value={passwordInfo.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                value={passwordInfo.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
              />
            </div>
          </CardContent>
        ) : (
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-md bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LockIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                </div>
              </div>
              <div>
                <span className="text-sm font-medium">••••••••</span>
              </div>
            </div>
          </CardContent>
        )}
        {editingPassword && (
          <CardFooter className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCancelPassword}>Cancel</Button>
            <Button onClick={handleSavePassword}>Update Password</Button>
          </CardFooter>
        )}
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
