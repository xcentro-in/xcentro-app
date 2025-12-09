import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Mail, Phone, Loader2, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { authAPI, userAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const AccountSettings = () => {
  const { user, updateUser } = useAuth();

  // Personal Information State
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.mobile || "",
    pan: "",
    aadhaar: ""
  });
  const [tempPersonalInfo, setTempPersonalInfo] = useState(personalInfo);
  const [isSaving, setIsSaving] = useState(false);

  // Mobile Update State
  const [showMobileDialog, setShowMobileDialog] = useState(false);
  const [mobileStep, setMobileStep] = useState<'input' | 'otp'>('input');
  const [newMobileNumber, setNewMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      const profile = {
        fullName: user.name,
        email: user.email,
        phone: user.mobile || "",
        pan: user.taxId || "", // Map taxId to PAN
        aadhaar: user.maskedNationalId || "", // Map maskedNationalId to Aadhaar
      };
      setPersonalInfo(profile);
      setTempPersonalInfo(profile);
    }
  }, [user]);

  // OTP Timer countdown
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  const handleEditPersonal = () => {
    setTempPersonalInfo({...personalInfo});
    setEditingPersonal(true);
  };

  const handleCancelPersonal = () => {
    setEditingPersonal(false);
  };

  const handleSavePersonal = async () => {
    setIsSaving(true);
    try {
      await userAPI.updateProfile({ mobile: tempPersonalInfo.phone });
      setPersonalInfo({...tempPersonalInfo});
      updateUser({ mobile: tempPersonalInfo.phone }); // Update context
      setEditingPersonal(false);
      toast.success("Personal information updated successfully");
    } catch (error) {
      toast.error("Failed to update profile.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePersonalInfoChange = (field: keyof typeof tempPersonalInfo, value: string) => {
    setTempPersonalInfo({...tempPersonalInfo, [field]: value});
  };

  // Mobile Update Handlers
  const handleChangeMobile = () => {
    setNewMobileNumber("");
    setOtp("");
    setMobileStep('input');
    setOtpTimer(0);
    setShowMobileDialog(true);
  };

  const handleSendOtp = async () => {
    // Validate mobile number
    if (!/^\d{10}$/.test(newMobileNumber)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    // Check if same as current mobile
    if (newMobileNumber === personalInfo.phone) {
      toast.error("New mobile number is the same as current mobile number");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authAPI.sendMobileUpdateOtp(newMobileNumber);
      toast.success(response.message || "OTP sent to your new mobile number");
      setMobileStep('otp');
      setOtpTimer(600); // 10 minutes
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setIsSubmitting(true);
    try {
      const response = await authAPI.sendMobileUpdateOtp(newMobileNumber);
      toast.success(response.message || "OTP resent successfully");
      setOtpTimer(600);
      setOtp(""); // Clear previous OTP
    } catch (error: any) {
      toast.error(error.message || "Failed to resend OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyAndUpdate = async () => {
    // Validate OTP
    if (!/^\d{6}$/.test(otp)) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authAPI.verifyMobileUpdate(newMobileNumber, otp);
      toast.success(response.message || "Mobile number updated successfully");

      // Update local state and context
      const updatedProfile = { ...personalInfo, phone: newMobileNumber };
      setPersonalInfo(updatedProfile);
      setTempPersonalInfo(updatedProfile);
      updateUser({ mobile: newMobileNumber });

      // Close dialog and reset
      setShowMobileDialog(false);
      setMobileStep('input');
      setNewMobileNumber("");
      setOtp("");
      setOtpTimer(0);
    } catch (error: any) {
      toast.error(error.message || "Invalid or expired OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isLoading = !user;

  return (
    <div className="space-y-6 w-full max-w-5xl">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Personal Information</CardTitle>
              <CardDescription>
                View and update your contact information
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center">
                <Label className="w-32 font-medium">Name:</Label>
                <div className="flex-1">{personalInfo.fullName}</div>
              </div>

              <div className="flex items-center">
                <Label htmlFor="email" className="w-32 font-medium">
                  Email:
                </Label>
                <div className="flex-1 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {personalInfo.email}
                </div>
              </div>

              <div className="flex items-center">
                <Label htmlFor="phone" className="w-32 font-medium">
                  Contact:
                </Label>
                <div className="flex-1 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{personalInfo.phone || "Not set"}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleChangeMobile}
                    className="ml-auto"
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    Change Mobile
                  </Button>
                </div>
              </div>

              <div className="flex items-center">
                <Label className="w-32 font-medium">PAN:</Label>
                <div className="flex-1">{personalInfo.pan || "Not available"}</div>
              </div>

              <div className="flex items-center">
                <Label className="w-32 font-medium">Aadhaar:</Label>
                <div className="flex-1">{personalInfo.aadhaar || "Not available"}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mobile Update Dialog */}
      <Dialog open={showMobileDialog} onOpenChange={setShowMobileDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              {mobileStep === 'input' ? 'Change Mobile Number' : 'Verify OTP'}
            </DialogTitle>
            <DialogDescription>
              {mobileStep === 'input'
                ? 'Enter your new mobile number to receive an OTP'
                : `Enter the 6-digit OTP sent to ${newMobileNumber}`}
            </DialogDescription>
          </DialogHeader>

          {mobileStep === 'input' ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-mobile">New Mobile Number</Label>
                <Input
                  id="new-mobile"
                  type="tel"
                  placeholder="9876543210"
                  value={newMobileNumber}
                  onChange={(e) => setNewMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  maxLength={10}
                />
                <p className="text-xs text-muted-foreground">
                  Current: {personalInfo.phone || "Not set"}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="otp">OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
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
                      disabled={isSubmitting}
                      className="text-primary hover:underline"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowMobileDialog(false);
                setMobileStep('input');
                setNewMobileNumber("");
                setOtp("");
                setOtpTimer(0);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            {mobileStep === 'input' ? (
              <Button onClick={handleSendOtp} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send OTP'
                )}
              </Button>
            ) : (
              <>
                {otpTimer > 0 && (
                  <Button
                    variant="ghost"
                    onClick={handleResendOtp}
                    disabled={isSubmitting}
                  >
                    Resend OTP
                  </Button>
                )}
                <Button onClick={handleVerifyAndUpdate} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify & Update'
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountSettings;
