
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Mail, Smartphone, CreditCard, Shield, BellRing, Check } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { NotificationCategory } from "@/types/notification";

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    payments: true,
    security: true,
    marketing: false
  });

  // Categories for notifications display customization
  const [categories, setCategories] = useState({
    announcements: true,
    rewards: true,
    payments: true,
    payees: false,
    approvals: true,
    security: true,
    insights: false
  });
  
  // Store the initial states to compare for changes
  const [initialNotifications, setInitialNotifications] = useState({...notifications});
  const [initialCategories, setInitialCategories] = useState({...categories});
  
  // Track if any changes have been made
  const [hasChanges, setHasChanges] = useState(false);
  
  // Check for changes when notifications state updates
  useEffect(() => {
    const notificationChanged = Object.keys(notifications).some(
      key => notifications[key as keyof typeof notifications] !== 
             initialNotifications[key as keyof typeof initialNotifications]
    );
    
    const categoriesChanged = Object.keys(categories).some(
      key => categories[key as keyof typeof categories] !== 
             initialCategories[key as keyof typeof categories]
    );
    
    setHasChanges(notificationChanged || categoriesChanged);
  }, [notifications, initialNotifications, categories, initialCategories]);
  
  const handleSavePreferences = () => {
    // Save the current state as the new initial state
    setInitialNotifications({...notifications});
    setInitialCategories({...categories});
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

          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Categories to display in notifications</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Select which notification categories you want to see prominently
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="cat-announcements" 
                  checked={categories.announcements} 
                  onCheckedChange={(checked) => 
                    setCategories({...categories, announcements: !!checked})
                  }
                />
                <label
                  htmlFor="cat-announcements"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Announcements
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="cat-rewards" 
                  checked={categories.rewards}
                  onCheckedChange={(checked) => 
                    setCategories({...categories, rewards: !!checked})
                  }
                />
                <label
                  htmlFor="cat-rewards"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Rewards
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="cat-payments" 
                  checked={categories.payments}
                  onCheckedChange={(checked) => 
                    setCategories({...categories, payments: !!checked})
                  }
                />
                <label
                  htmlFor="cat-payments"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Payments
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="cat-payees" 
                  checked={categories.payees}
                  onCheckedChange={(checked) => 
                    setCategories({...categories, payees: !!checked})
                  }
                />
                <label
                  htmlFor="cat-payees"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Payees
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="cat-approvals" 
                  checked={categories.approvals}
                  onCheckedChange={(checked) => 
                    setCategories({...categories, approvals: !!checked})
                  }
                />
                <label
                  htmlFor="cat-approvals"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Approvals
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="cat-security" 
                  checked={categories.security}
                  onCheckedChange={(checked) => 
                    setCategories({...categories, security: !!checked})
                  }
                />
                <label
                  htmlFor="cat-security"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Security
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="cat-insights" 
                  checked={categories.insights}
                  onCheckedChange={(checked) => 
                    setCategories({...categories, insights: !!checked})
                  }
                />
                <label
                  htmlFor="cat-insights"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Insights
                </label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={handleSavePreferences} 
            disabled={!hasChanges}
          >
            <Check className="mr-1 h-4 w-4" />
            Save Preferences
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotificationSettings;
