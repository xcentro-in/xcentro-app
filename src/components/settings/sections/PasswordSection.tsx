import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LockIcon, Pencil } from "lucide-react";
import { toast } from "sonner";

interface PasswordInfo {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const PasswordSection = () => {
  const [editingPassword, setEditingPassword] = useState(false);
  const [passwordInfo, setPasswordInfo] = useState<PasswordInfo>({
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

  const handlePasswordChange = (field: keyof PasswordInfo, value: string) => {
    setPasswordInfo({ ...passwordInfo, [field]: value });
  };

  return (
    <Card className="w-full">
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
  );
};

export default PasswordSection;