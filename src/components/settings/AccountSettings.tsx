
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AccountSettings = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Personal Information</CardTitle>
          <CardDescription>
            Update your account details and profile settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-2xl font-semibold">
              JD
            </div>
            <div>
              <Button variant="outline" size="sm">Upload Photo</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" defaultValue="John" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" defaultValue="Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="john.doe@company.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue="+1 (555) 123-4567" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Business Profile</CardTitle>
          <CardDescription>
            Configure your business information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input id="businessName" defaultValue="Acme Corporation" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessType">Business Type</Label>
            <Select defaultValue="corporation">
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
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxId">Tax ID / EIN</Label>
            <Input id="taxId" defaultValue="XX-XXXXXXX" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AccountSettings;
