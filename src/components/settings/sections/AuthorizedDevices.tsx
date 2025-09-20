import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCog } from "lucide-react";

interface Device {
  name: string;
  lastActive: string;
  isCurrentDevice: boolean;
}

const AuthorizedDevices = () => {
  const devices: Device[] = [
    { name: "MacBook Pro - Chrome", lastActive: "Current Device", isCurrentDevice: true },
    { name: "iPhone 13 - Safari", lastActive: "Last active 2 days ago", isCurrentDevice: false },
    { name: "Windows PC - Edge", lastActive: "Last active 3 days ago", isCurrentDevice: false }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Authorized Devices</CardTitle>
        <CardDescription>
          Manage devices that are logged into your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {devices.map((device) => (
          <div key={device.name} className="flex items-center justify-between p-3 rounded-md border">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                <UserCog className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">{device.name}</div>
                <div className="text-xs text-muted-foreground">
                  {device.lastActive}
                </div>
              </div>
            </div>
            {!device.isCurrentDevice && <Button size="sm" variant="ghost">Revoke</Button>}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AuthorizedDevices;