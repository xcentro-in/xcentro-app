
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Mail, Smartphone, CreditCard, Shield, BellRing } from "lucide-react";
import { toast } from "sonner";

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    payments: true,
    security: true,
    marketing: false
  });
  
  // Store the initial state to compare for changes
  const [initialNotifications, setInitialNotifications] = useState({...notifications});
  
  // Track if any changes have been made
  const [hasChanges, setHasChanges] = useState(false);
  
  // Check for changes when notifications state updates
  useEffect(() => {
    const changed = Object.keys(notifications).some(
      key => notifications[key as keyof typeof notifications] !== 
             initialNotifications[key as keyof typeof initialNotifications]
    );
    setHasChanges(changed);
  }, [notifications, initialNotifications]);
  
  const handleSavePreferences = () => {
    // Save the current state as the new initial state
    setInitialNotifications({...notifications});
    setHasChanges(false);
    
    // Show success message
    toast.success("Notification preferences saved successfully");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Notification Preferences</CardTitle>
          <CardDescription>
            Configure how you receive notifications and alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
              </div>
              <Switch 
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive push notifications on your devices</p>
                </div>
              </div>
              <Switch 
                checked={notifications.push}
                onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
              />
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">What to notify about</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="notify-payments" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  Payment Activity
                </Label>
                <Switch 
                  id="notify-payments"
                  checked={notifications.payments}
                  onCheckedChange={(checked) => setNotifications({...notifications, payments: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="notify-security" className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  Security Alerts
                </Label>
                <Switch 
                  id="notify-security"
                  checked={notifications.security}
                  onCheckedChange={(checked) => setNotifications({...notifications, security: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="notify-marketing" className="flex items-center gap-2">
                  <BellRing className="h-4 w-4 text-muted-foreground" />
                  Marketing & Updates
                </Label>
                <Switch 
                  id="notify-marketing"
                  checked={notifications.marketing}
                  onCheckedChange={(checked) => setNotifications({...notifications, marketing: checked})}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={handleSavePreferences} 
            disabled={!hasChanges}
          >
            Save Preferences
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotificationSettings;
