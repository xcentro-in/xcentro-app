
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoyaltyPartner } from "@/types/rewards";
import LoyaltyPartnersSettings from "./LoyaltyPartnersSettings";

interface RewardPreferencesProps {
  savedPartners: LoyaltyPartner[];
  onSavePartner: (partner: LoyaltyPartner) => void;
  onDeletePartner: (partnerId: string) => void;
}

const RewardPreferences = ({ 
  savedPartners, 
  onSavePartner, 
  onDeletePartner 
}: RewardPreferencesProps) => {
  return (
    <div className="space-y-6">
      <LoyaltyPartnersSettings 
        savedPartners={savedPartners}
        onSavePartner={onSavePartner}
        onDeletePartner={onDeletePartner}
      />
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Rewards Preferences</CardTitle>
          <CardDescription>
            Customize how you earn and redeem rewards
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications for Rewards</Label>
              <p className="text-sm text-muted-foreground">Receive updates about new reward opportunities</p>
            </div>
            <Switch id="email-notifications" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-redeem">Automatic Redemption</Label>
              <p className="text-sm text-muted-foreground">Automatically redeem points when you reach thresholds</p>
            </div>
            <Switch id="auto-redeem" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="redemption-threshold">Redemption Threshold</Label>
            <Select defaultValue="10000">
              <SelectTrigger>
                <SelectValue placeholder="Select threshold" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5000">5,000 points</SelectItem>
                <SelectItem value="10000">10,000 points</SelectItem>
                <SelectItem value="25000">25,000 points</SelectItem>
                <SelectItem value="50000">50,000 points</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="preferred-category">Preferred Redemption Category</Label>
            <Select defaultValue="flights">
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flights">Flight Partners</SelectItem>
                <SelectItem value="hotels">Hotel Partners</SelectItem>
                <SelectItem value="events">VIP Events</SelectItem>
                <SelectItem value="travel">Luxury Travel</SelectItem>
                <SelectItem value="business">Business Services</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button>Save Preferences</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RewardPreferences;
