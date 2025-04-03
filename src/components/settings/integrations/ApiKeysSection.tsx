
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const ApiKeysSection = () => {
  return (
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
            <Badge variant="outline" className="bg-green-400">Active</Badge>
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
  );
};

export default ApiKeysSection;
