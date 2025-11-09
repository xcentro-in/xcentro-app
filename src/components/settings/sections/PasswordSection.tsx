import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LockIcon, Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

interface PasswordInfo {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const PasswordSection = () => {
  const { logout } = useAuth();
  const [editingPassword, setEditingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const validatePassword = (password: string): { isValid: boolean; message?: string } => {
    if (password.length < 8) {
      return { isValid: false, message: "Password must be at least 8 characters" };
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: "Password must contain at least one uppercase letter" };
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return { isValid: false, message: "Password must contain at least one lowercase letter" };
    }

    // Check for at least one number
    if (!/[0-9]/.test(password)) {
      return { isValid: false, message: "Password must contain at least one number" };
    }

    // Check for at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { isValid: false, message: "Password must contain at least one special character" };
    }

    return { isValid: true };
  };

  const handleSavePassword = async () => {
    // Validation
    if (!passwordInfo.currentPassword) {
      toast.error("Current password is required");
      return;
    }

    if (!passwordInfo.newPassword) {
      toast.error("New password is required");
      return;
    }

    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    const validation = validatePassword(passwordInfo.newPassword);
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    if (passwordInfo.currentPassword === passwordInfo.newPassword) {
      toast.error("New password must be different from current password");
      return;
    }

    // Call API
    setIsLoading(true);
    try {
      const response = await authAPI.changePassword(
        passwordInfo.currentPassword,
        passwordInfo.newPassword
      );

      toast.success(response.message || "Password changed successfully. All existing sessions have been invalidated.");

      // Reset form
      setEditingPassword(false);
      setPasswordInfo({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

      // Show info message before logout
      setTimeout(() => {
        toast.info("Logging out for security...");
        setTimeout(() => {
          logout();
        }, 1000);
      }, 1500);

    } catch (error: any) {
      console.error("Password change failed:", error);

      // Handle specific error messages from backend
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to change password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
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
            <p className="text-xs text-muted-foreground">
              Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
            </p>
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
          <Button variant="outline" onClick={handleCancelPassword} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSavePassword} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default PasswordSection;