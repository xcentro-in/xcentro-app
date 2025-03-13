
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const IntegrationSettings = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Accounting Integrations</CardTitle>
          <CardDescription>
            Connect your accounting software for seamless data transfer
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { name: "QuickBooks", connected: true },
            { name: "Xero", connected: false },
            { name: "Zoho Books", connected: false },
          ].map((app) => (
            <div key={app.name} className="flex items-center justify-between p-3 rounded-md border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center font-semibold text-sm">
                  {app.name.substring(0, 2)}
                </div>
                <div className="font-medium">{app.name}</div>
              </div>
              <Button size="sm" variant={app.connected ? "outline" : "default"}>
                {app.connected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">API Access</CardTitle>
          <CardDescription>
            Manage API keys for developer integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 rounded-md border">
            <div className="flex items-center justify-between mb-3">
              <div className="font-medium">Production API Key</div>
              <Badge variant="outline">Active</Badge>
            </div>
            <div className="mb-3">
              <Input value="••••••••••••••••••••••••••••••" readOnly />
            </div>
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline">Copy Key</Button>
              <Button size="sm" variant="outline">Regenerate</Button>
            </div>
          </div>
          <Button className="w-full">Create New API Key</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationSettings;
