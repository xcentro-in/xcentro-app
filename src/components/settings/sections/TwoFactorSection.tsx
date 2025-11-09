import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LockIcon } from "lucide-react";

const TwoFactorSection = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Two-Factor Authentication</CardTitle>
        <CardDescription>
          Add an additional layer of security to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LockIcon className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Secure your account with 2FA</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-600">
            Enabled
          </Badge>
        </div>
        
        <Button variant="outline" className="w-full">Reconfigure 2FA</Button>
      </CardContent>
    </Card>
  );
};

export default TwoFactorSection;