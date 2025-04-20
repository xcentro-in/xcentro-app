
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users, Clock, Building } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockBusinesses } from "@/data/mockBusinesses";
import { User, UserInvite } from "@/types/user";
import UserList from "./UserList";
import PendingInvites from "./PendingInvites";
import InviteUserForm from "./InviteUserForm";
import { toast } from "sonner";

interface UserAccessTabsProps {
  users: User[];
  pendingInvites: UserInvite[];
}

const UserAccessTabs = ({ users, pendingInvites }: UserAccessTabsProps) => {
  const [showInviteForm, setShowInviteForm] = useState(false);

  const handleInviteUser = () => {
    setShowInviteForm(true);
  };

  const handleCancelInvite = () => {
    setShowInviteForm(false);
  };

  const handleSubmitInvite = (data: any) => {
    // In a real app, this would send the invite
    console.log("Inviting user:", data);
    toast.success(`Invitation sent to ${data.email}`);
    setShowInviteForm(false);
  };

  const handleEditUser = (user: User) => {
    // In a real app, this would open a modal to edit the user
    console.log("Edit user:", user);
    toast.info(`Editing ${user.name}`);
  };

  const handleRevokeAccess = (userId: string) => {
    // In a real app, this would call an API to revoke access
    console.log("Revoking access for user:", userId);
    toast.success("User access has been revoked");
  };

  const handleCancelInvitation = (inviteId: string) => {
    // In a real app, this would call an API to cancel the invitation
    console.log("Cancelling invitation:", inviteId);
    toast.success("Invitation has been cancelled");
  };

  const handleResendInvitation = (inviteId: string) => {
    // In a real app, this would call an API to resend the invitation
    console.log("Resending invitation:", inviteId);
    toast.success("Invitation has been resent");
  };

  const [selectedBusiness, setSelectedBusiness] = useState(mockBusinesses[0]?.id);

  return (
    <div>
      {showInviteForm ? (
        <InviteUserForm 
          onInviteSubmit={handleSubmitInvite} 
          onCancel={handleCancelInvite} 
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">User Management</h2>
            <Button onClick={handleInviteUser} className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Invite User
            </Button>
          </div>

          <Tabs defaultValue="users" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Active Users ({users.length})
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending Invites ({pendingInvites.length})
              </TabsTrigger>
              </TabsList>
              <Select value={selectedBusiness} onValueChange={setSelectedBusiness}>
                <SelectTrigger className="w-[240px]">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <SelectValue placeholder="Select business" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {mockBusinesses.map((business) => (
                    <SelectItem key={business.id} value={business.id}>
                      <div className="flex items-center gap-2">
                        <span>{business.name}</span>
                        {business.status === "verified" && (
                          <span className="text-xs text-green-600">✓</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <TabsContent value="users">
              <UserList 
                users={users} 
                onEditUser={handleEditUser}
                onRevokeAccess={handleRevokeAccess}
              />
            </TabsContent>
            
            <TabsContent value="pending">
              <PendingInvites 
                invites={pendingInvites}
                onCancelInvite={handleCancelInvitation}
                onResendInvite={handleResendInvitation}
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default UserAccessTabs;
