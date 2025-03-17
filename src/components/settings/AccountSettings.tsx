
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

const AccountSettings = () => {
  // Personal Information State
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567"
  });
  const [tempPersonalInfo, setTempPersonalInfo] = useState({...personalInfo});

  // Business Profile State
  const [editingBusiness, setEditingBusiness] = useState(false);
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "Acme Corporation",
    businessType: "corporation",
    taxId: "XX-XXXXXXX"
  });
  const [tempBusinessInfo, setTempBusinessInfo] = useState({...businessInfo});

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

  const handleEditBusiness = () => {
    setTempBusinessInfo({...businessInfo});
    setEditingBusiness(true);
  };

  const handleCancelBusiness = () => {
    setEditingBusiness(false);
  };

  const handleSaveBusiness = () => {
    setBusinessInfo({...tempBusinessInfo});
    setEditingBusiness(false);
    toast.success("Business profile updated successfully");
  };

  const handlePersonalInfoChange = (field: keyof typeof tempPersonalInfo, value: string) => {
    setTempPersonalInfo({...tempPersonalInfo, [field]: value});
  };

  const handleBusinessInfoChange = (field: keyof typeof tempBusinessInfo, value: string) => {
    setTempBusinessInfo({...tempBusinessInfo, [field]: value});
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Personal Information</CardTitle>
              <CardDescription>
                Update your account details and profile settings
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
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-2xl font-semibold">
              JD
            </div>
            <div>
              <Button variant="outline" size="sm" disabled={!editingPersonal}>Upload Photo</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              {editingPersonal ? (
                <Input 
                  id="firstName" 
                  value={tempPersonalInfo.firstName} 
                  onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
                />
              ) : (
                <div className="p-2 border rounded-md bg-muted/30">{personalInfo.firstName}</div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              {editingPersonal ? (
                <Input 
                  id="lastName" 
                  value={tempPersonalInfo.lastName} 
                  onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
                />
              ) : (
                <div className="p-2 border rounded-md bg-muted/30">{personalInfo.lastName}</div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              {editingPersonal ? (
                <Input 
                  id="email" 
                  type="email" 
                  value={tempPersonalInfo.email} 
                  onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                />
              ) : (
                <div className="p-2 border rounded-md bg-muted/30">{personalInfo.email}</div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              {editingPersonal ? (
                <Input 
                  id="phone" 
                  value={tempPersonalInfo.phone} 
                  onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                />
              ) : (
                <div className="p-2 border rounded-md bg-muted/30">{personalInfo.phone}</div>
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

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Business Profile</CardTitle>
              <CardDescription>
                Configure your business information
              </CardDescription>
            </div>
            {!editingBusiness && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handleEditBusiness}
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            {editingBusiness ? (
              <Input 
                id="businessName" 
                value={tempBusinessInfo.businessName} 
                onChange={(e) => handleBusinessInfoChange('businessName', e.target.value)}
              />
            ) : (
              <div className="p-2 border rounded-md bg-muted/30">{businessInfo.businessName}</div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessType">Business Type</Label>
            {editingBusiness ? (
              <Select 
                value={tempBusinessInfo.businessType}
                onValueChange={(value) => handleBusinessInfoChange('businessType', value)}
              >
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
            ) : (
              <div className="p-2 border rounded-md bg-muted/30 capitalize">
                {businessInfo.businessType.replace(/([A-Z])/g, ' $1').trim()}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxId">Tax ID / EIN</Label>
            {editingBusiness ? (
              <Input 
                id="taxId" 
                value={tempBusinessInfo.taxId} 
                onChange={(e) => handleBusinessInfoChange('taxId', e.target.value)}
              />
            ) : (
              <div className="p-2 border rounded-md bg-muted/30">{businessInfo.taxId}</div>
            )}
          </div>
        </CardContent>
        {editingBusiness && (
          <CardFooter className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCancelBusiness}>Cancel</Button>
            <Button onClick={handleSaveBusiness}>Save Changes</Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default AccountSettings;
