import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Mail, Phone, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { userAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

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
            {!editingPersonal && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handleEditPersonal}
                disabled={isLoading}
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            )}
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
                <div className="flex-1">{personalInfo.email}</div>
              </div>
              
              <div className="flex items-center">
                <Label htmlFor="phone" className="w-32 font-medium">
                  Contact:
                </Label>
                {editingPersonal ? (
                  <Input 
                    id="phone" 
                    value={tempPersonalInfo.phone} 
                    onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                    className="flex-1"
                  />
                ) : (
                  <div className="flex-1">{personalInfo.phone}</div>
                )}
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
        {editingPersonal && (
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancelPersonal} disabled={isSaving}>Cancel</Button>
            <Button onClick={handleSavePersonal} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default AccountSettings;
