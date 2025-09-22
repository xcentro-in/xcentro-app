
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

const AccountSettings = () => {
  // Personal Information State
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "John Doe",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567"
  });
  const [tempPersonalInfo, setTempPersonalInfo] = useState({...personalInfo});

  const handleEditPersonal = () => {
    setTempPersonalInfo({...personalInfo});
    setEditingPersonal(true);
  };

  const handleCancelPersonal = () => {
    setEditingPersonal(false);
  };

  const handleSavePersonal = () => {
    setPersonalInfo({...tempPersonalInfo});
    setEditingPersonal(false);
    toast.success("Personal information updated successfully");
  };

  const handlePersonalInfoChange = (field: keyof typeof tempPersonalInfo, value: string) => {
    setTempPersonalInfo({...tempPersonalInfo, [field]: value});
  };

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
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center">
              <Label className="w-32 font-medium">Name:</Label>
              <div className="flex-1">{personalInfo.fullName}</div>
            </div>
            
            <div className="flex items-center">
              <Label htmlFor="email" className="w-32 font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email:
              </Label>
              {editingPersonal ? (
                <Input 
                  id="email" 
                  type="email" 
                  value={tempPersonalInfo.email} 
                  onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                  className="flex-1"
                />
              ) : (
                <div className="flex-1">{personalInfo.email}</div>
              )}
            </div>
            
            <div className="flex items-center">
              <Label htmlFor="phone" className="w-32 font-medium flex items-center gap-2">
                <Phone className="h-4 w-4" /> Contact:
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
          </div>
        </CardContent>
        {editingPersonal && (
          <CardFooter className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCancelPersonal}>Cancel</Button>
            <Button onClick={handleSavePersonal}>Save Changes</Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default AccountSettings;
