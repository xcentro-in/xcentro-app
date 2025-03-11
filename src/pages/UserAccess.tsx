
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import UserAccessTabs from "@/components/user-access/UserAccessTabs";
import { mockUsers, mockPendingInvites } from "@/data/mockUsers";
import { Shield } from "lucide-react";

const UserAccess = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Role-Based Access Management
          </h1>
          <p className="text-muted-foreground">
            Manage user access and permissions for your organization
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Add, edit, or revoke access for team members across your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserAccessTabs
              users={mockUsers}
              pendingInvites={mockPendingInvites}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserAccess;
