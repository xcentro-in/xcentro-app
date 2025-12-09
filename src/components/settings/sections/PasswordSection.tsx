import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LockIcon, Pencil, Loader2, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { authAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

interface PasswordInfo {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  otp: string;
}

const PasswordSection = () => {
  const { logout } = useAuth();
  const [editingPassword, setEditingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [passwordInfo, setPasswordInfo] = useState<PasswordInfo>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    otp: ""
  });

  // Countdown timer for OTP expiry
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  const handleEditPassword = () => {
    setPasswordInfo({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      otp: ""
    });
    setOtpSent(false);
    setOtpTimer(0);
    setEditingPassword(true);
  };

  const handleCancelPassword = () => {
    setEditingPassword(false);
    setOtpSent(false);
    setOtpTimer(0);
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

  const handleSendOtp = async () => {
    // Validate passwords before sending OTP
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

    // Send OTP
    setIsLoading(true);
    try {
      const response = await authAPI.generateMobileOtp();
      toast.success(response.message || "OTP sent to your registered mobile number");
      setOtpSent(true);
      setOtpTimer(600); // 10 minutes = 600 seconds
    } catch (error: any) {
      console.error("OTP generation failed:", error);
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const response = await authAPI.generateMobileOtp();
      toast.success(response.message || "OTP resent successfully");
      setOtpTimer(600);
      setPasswordInfo({ ...passwordInfo, otp: "" }); // Clear previous OTP
    } catch (error: any) {
      console.error("OTP resend failed:", error);
      toast.error(error.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePassword = async () => {
    // Validation
    if (!passwordInfo.otp) {
      toast.error("OTP is required");
      return;
    }

    if (!/^\d{6}$/.test(passwordInfo.otp)) {
      toast.error("OTP must be exactly 6 digits");
      return;
    }

    // Call API
    setIsLoading(true);
    try {
      const response = await authAPI.changePasswordWithOtp(
        passwordInfo.currentPassword,
        passwordInfo.newPassword,
        passwordInfo.otp
      );

      toast.success(response.message || "Password changed successfully. All existing sessions have been invalidated.");

      // Reset form
      setEditingPassword(false);
      setOtpSent(false);
      setOtpTimer(0);
      setPasswordInfo({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        otp: ""
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
              disabled={otpSent}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={passwordInfo.newPassword}
              onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
              disabled={otpSent}
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
              disabled={otpSent}
            />
          </div>

          {!otpSent && (
            <div className="pt-2">
              <Button
                onClick={handleSendOtp}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <Smartphone className="mr-2 h-4 w-4" />
                    Send OTP to Mobile
                  </>
                )}
              </Button>
            </div>
          )}

          {otpSent && (
            <div className="space-y-2">
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                value={passwordInfo.otp}
                onChange={(e) => handlePasswordChange('otp', e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="text-center text-2xl tracking-widest"
              />
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">
                  {otpTimer > 0 ? `OTP expires in ${formatTime(otpTimer)}` : 'OTP expired'}
                </span>
                {otpTimer === 0 && (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-primary hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          )}
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
          {otpSent && (
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
          )}
          {otpTimer > 0 && otpSent && (
            <Button variant="ghost" onClick={handleResendOtp} disabled={isLoading}>
              Resend OTP
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default PasswordSection;
