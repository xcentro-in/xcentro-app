import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

const AnalyticsSection = () => {
  // Toggle is ON by default (user allows analytics)
  // When toggle is OFF, we set 'analytics-opt-out' to 'true'
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  useEffect(() => {
    // Check localStorage on mount
    const isOptedOut = localStorage.getItem('analytics-opt-out') === 'true';
    setAnalyticsEnabled(!isOptedOut);
  }, []);

  const handleToggleChange = (checked: boolean) => {
    setAnalyticsEnabled(checked);

    if (checked) {
      // User enables analytics - remove opt-out flag
      localStorage.removeItem('analytics-opt-out');
      toast.success("Analytics enabled. Thank you for helping us improve Xcentro!");
    } else {
      // Fire event BEFORE setting the opt-out flag so Clarity still receives it
      trackEvent('opt_out_analytics');
      localStorage.setItem('analytics-opt-out', 'true');
      toast.info("Analytics disabled. Changes will take effect on next page refresh.");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">Help Improve Xcentro</CardTitle>
            <CardDescription className="mt-2">
              Allow us to collect usage metrics to help make Xcentro perform better.
              We improve our products and services by using Microsoft Clarity to understand how you use our platform.
              By enabling this, you agree that we and Microsoft can collect and use this data.
              Our {" "}
              <a
                href="https://www.xcentro.in/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
              privacy policy {" "}
              </a> 
              has more details.
            </CardDescription>
          </div>
          <div className="ml-6">
            <Switch
              checked={analyticsEnabled}
              onCheckedChange={handleToggleChange}
              aria-label="Toggle analytics"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 border rounded-md bg-muted/30 flex items-center gap-3">
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Usage Analytics</p>
            <p className="text-sm text-muted-foreground">
              {analyticsEnabled
                ? "Currently collecting anonymized usage data to improve your experience"
                : "Analytics disabled. We are not collecting any usage data"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsSection;
