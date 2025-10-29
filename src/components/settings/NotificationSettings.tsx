
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Mail, Smartphone, MessageSquare, Check, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { notificationsAPI } from "@/services/api";
import { PreferencesResponse, CategoryPreferences } from "@/types/notification";

const NotificationSettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [notifications, setNotifications] = useState({
    email: false,
    push: false,
    messages: false,
  });

  // Categories for notifications - based on API category_preferences
  const [categoryPreferences, setCategoryPreferences] = useState<Record<string, CategoryPreferences>>({
    approvals: { email: false, push: false, messages: false },
    payments: { email: false, push: false, messages: false },
    vouchers: { email: false, push: false, messages: false },
  });

  // Store the initial states to compare for changes
  const [initialNotifications, setInitialNotifications] = useState({...notifications});
  const [initialCategoryPreferences, setInitialCategoryPreferences] = useState({...categoryPreferences});

  // Track if any changes have been made
  const [hasChanges, setHasChanges] = useState(false);

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
    const notificationChanged = Object.keys(notifications).some(
      key => notifications[key as keyof typeof notifications] !==
             initialNotifications[key as keyof typeof initialNotifications]
    );

    const categoryChanged = Object.keys(categoryPreferences).some(
      category => {
        const current = categoryPreferences[category];
        const initial = initialCategoryPreferences[category];
        if (!current || !initial) return false;
        return current.email !== initial.email ||
               current.push !== initial.push ||
               current.messages !== initial.messages;
      }
    );

    setHasChanges(notificationChanged || categoryChanged);
  }, [notifications, initialNotifications, categoryPreferences, initialCategoryPreferences]);

  const handleSavePreferences = async () => {
    try {
      setIsSaving(true);

      await notificationsAPI.updatePreferences({
        email_enabled: notifications.email,
        push_enabled: notifications.push,
        messages_enabled: notifications.messages,
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

  const updateCategoryPreference = (category: string, channel: keyof CategoryPreferences, value: boolean) => {
    setCategoryPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [channel]: value,
      },
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
                checked={notifications.push}
                onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                disabled
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">In-App Messages</p>
                  <p className="text-sm text-muted-foreground">Show notifications in the app</p>
                </div>
              </div>
              <Switch
                checked={notifications.messages}
                onCheckedChange={(checked) => setNotifications({...notifications, messages: checked})}
                disabled
              />
            </div>
          </div>

          {/* Category-specific preferences */}
          <div className="border-t pt-6">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-4">
              Category Preferences
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Configure notification preferences for each category
            </p>

            <div className="space-y-6">
              {Object.keys(categoryPreferences).map(category => (
                <div key={category} className="border rounded-lg p-4 space-y-3">
                  <h4 className="font-medium capitalize">{category}</h4>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`${category}-email`} className="text-sm">Email</Label>
                      <Switch
                        id={`${category}-email`}
                        checked={categoryPreferences[category]?.email || false}
                        onCheckedChange={(checked) => updateCategoryPreference(category, 'email', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor={`${category}-push`} className="text-sm">Push</Label>
                      <Switch
                        id={`${category}-push`}
                        checked={categoryPreferences[category]?.push || false}
                        onCheckedChange={(checked) => updateCategoryPreference(category, 'push', checked)}
                        disabled
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor={`${category}-messages`} className="text-sm">In-App</Label>
                      <Switch
                        id={`${category}-messages`}
                        checked={categoryPreferences[category]?.messages || false}
                        onCheckedChange={(checked) => updateCategoryPreference(category, 'messages', checked)}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              ))}
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
