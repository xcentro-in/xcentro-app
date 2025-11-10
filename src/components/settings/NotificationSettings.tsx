
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Mail, Smartphone, MessageSquare, Check, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { notificationsAPI } from "@/services/api";
import { PreferencesResponse } from "@/types/notification";

const NotificationSettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [notifications, setNotifications] = useState({
    email: false,
    push: false,
    messages: false,
  });

  // Categories for notifications - based on backend API
  const [categoryPreferences, setCategoryPreferences] = useState<Record<string, boolean>>({
    announcements: true,
    approvals: true,
    insights: true,
    payees: true,
    payments: true,
    rewards: true,
    security: true,
  });

  // Store the initial states to compare for changes
  const [initialNotifications, setInitialNotifications] = useState({...notifications});
  const [initialCategoryPreferences, setInitialCategoryPreferences] = useState({...categoryPreferences});

  // Track if any changes have been made
  const [hasChanges, setHasChanges] = useState(false);

  // Category display labels
  const categoryLabels: Record<string, { title: string; description: string }> = {
    announcements: {
      title: "Announcements",
      description: "System announcements and important updates"
    },
    approvals: {
      title: "Approvals",
      description: "Payment approval requests and status updates"
    },
    insights: {
      title: "Insights",
      description: "Business insights and analytics reports"
    },
    payees: {
      title: "Payees",
      description: "Payee management and updates"
    },
    payments: {
      title: "Payments",
      description: "Payment status and transaction notifications"
    },
    rewards: {
      title: "Rewards",
      description: "Rewards points and milestone achievements"
    },
    security: {
      title: "Security",
      description: "Security alerts and authentication updates"
    },
  };

  // Fetch preferences on mount
  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await notificationsAPI.getPreferences() as PreferencesResponse;

      const prefs = response.data;
      const newNotifications = {
        email: prefs.email_enabled,
        push: prefs.push_enabled,
        messages: prefs.messages_enabled,
      };

      setNotifications(newNotifications);
      setInitialNotifications(newNotifications);

      setCategoryPreferences(prefs.category_preferences);
      setInitialCategoryPreferences(prefs.category_preferences);

      setIsLoading(false);
    } catch (err) {
      console.error('Failed to fetch notification preferences:', err);
      setError('Failed to load notification preferences');
      setIsLoading(false);
    }
  };

  // Check for changes when state updates
  useEffect(() => {
    const notificationChanged = notifications.email !== initialNotifications.email;

    const categoryChanged = Object.keys(categoryPreferences).some(
      category => categoryPreferences[category] !== initialCategoryPreferences[category]
    );

    setHasChanges(notificationChanged || categoryChanged);
  }, [notifications, initialNotifications, categoryPreferences, initialCategoryPreferences]);

  const handleSavePreferences = async () => {
    try {
      setIsSaving(true);

      await notificationsAPI.updatePreferences({
        email_enabled: notifications.email,
        push_enabled: false, // Always false - not operational
        messages_enabled: false, // Always false - not operational
        category_preferences: categoryPreferences,
      });

      // Update initial states
      setInitialNotifications({...notifications});
      setInitialCategoryPreferences({...categoryPreferences});
      setHasChanges(false);

      toast.success("Notification preferences saved successfully");
    } catch (err) {
      console.error('Failed to save notification preferences:', err);
      toast.error("Failed to save notification preferences");
    } finally {
      setIsSaving(false);
    }
  };

  const updateCategoryPreference = (category: string, value: boolean) => {
    setCategoryPreferences(prev => ({
      ...prev,
      [category]: value,
    }));
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading preferences...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={fetchPreferences} variant="outline" size="sm" className="mt-2">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

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
          {/* Global Channel Settings */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Notification Channels
            </h3>

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
                checked={false}
                onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                disabled
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">SMS Messages</p>
                  <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                </div>
              </div>
              <Switch
                checked={false}
                onCheckedChange={(checked) => setNotifications({...notifications, messages: checked})}
                disabled
              />
            </div>
          </div>

          {/* Category-specific preferences */}
          <div className="border-t pt-6">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-4">
              Notification Categories
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Choose which categories you want to receive notifications for
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.keys(categoryPreferences).map(category => {
                const label = categoryLabels[category];
                if (!label) return null;

                return (
                  <div key={category} className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/50 transition-colors">
                    <div className="flex-1 mr-3">
                      <Label htmlFor={category} className="font-medium cursor-pointer">
                        {label.title}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {label.description}
                      </p>
                    </div>
                    <Switch
                      id={category}
                      checked={categoryPreferences[category] || false}
                      onCheckedChange={(checked) => updateCategoryPreference(category, checked)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {hasChanges ? "You have unsaved changes" : "All changes saved"}
          </p>
          <Button
            onClick={handleSavePreferences}
            disabled={!hasChanges || isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Save Preferences
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotificationSettings;
