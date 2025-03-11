
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import UserList from './UserList';
import PendingInvites from './PendingInvites';
import InviteUserForm from './InviteUserForm';
import { User, UserInvite } from '@/types/user';
import { toast } from 'sonner';
import { Shield, UserPlus, Clock } from 'lucide-react';

interface UserAccessTabsProps {
  users: User[];
  pendingInvites: UserInvite[];
}

const UserAccessTabs = ({ users, pendingInvites }: UserAccessTabsProps) => {
  const [activeUsers, setActiveUsers] = useState<User[]>(users);
  const [activePendingInvites, setActivePendingInvites] = useState<UserInvite[]>(pendingInvites);

  const handleEditUser = (user: User) => {
    toast.info(`Editing user: ${user.name}`, {
      description: "This functionality would open a modal to edit user details"
    });
  };

  const handleRevokeAccess = (userId: string) => {
    const userToRevoke = activeUsers.find(u => u.id === userId);
    if (userToRevoke) {
      toast.success(`Access revoked for ${userToRevoke.name}`, {
        description: "User will no longer be able to access the system"
      });
      
      // Update user status to revoked in our local state
      setActiveUsers(activeUsers.map(user => 
        user.id === userId ? { ...user, status: 'revoked' } : user
      ));
    }
  };

  const handleResendInvite = (inviteId: string) => {
    const invite = activePendingInvites.find(i => i.id === inviteId);
    if (invite) {
      toast.success(`Invitation resent to ${invite.email}`, {
        description: "A new invitation email has been sent"
      });
    }
  };

  const handleCancelInvite = (inviteId: string) => {
    const invite = activePendingInvites.find(i => i.id === inviteId);
    if (invite) {
      toast.success(`Invitation to ${invite.email} cancelled`, {
        description: "The invitation has been cancelled"
      });
      
      // Remove the cancelled invite from our local state
      setActivePendingInvites(activePendingInvites.filter(i => i.id !== inviteId));
    }
  };

  const handleInviteSubmit = (values: any) => {
    const newInvite: UserInvite = {
      id: `invite-${Date.now()}`,
      email: values.email,
      role: values.role,
      department: values.department,
      invitedBy: "Current User",
      invitedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
    };
    
    setActivePendingInvites([newInvite, ...activePendingInvites]);
    toast.success(`Invitation sent to ${values.email}`, {
      description: `They will receive an email with instructions to join as ${values.role}`
    });
  };

  return (
    <Tabs defaultValue="users">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="users" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span>Manage Users</span>
        </TabsTrigger>
        <TabsTrigger value="pending" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>Pending Invites {activePendingInvites.length > 0 && `(${activePendingInvites.length})`}</span>
        </TabsTrigger>
        <TabsTrigger value="invite" className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          <span>Invite User</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="users">
        <Card>
          <CardContent className="pt-6">
            <UserList 
              users={activeUsers} 
              onEditUser={handleEditUser} 
              onRevokeAccess={handleRevokeAccess} 
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="pending">
        <Card>
          <CardContent className="pt-6">
            <PendingInvites 
              invites={activePendingInvites} 
              onResendInvite={handleResendInvite} 
              onCancelInvite={handleCancelInvite} 
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="invite">
        <Card>
          <CardContent className="pt-6">
            <InviteUserForm onInviteSubmit={handleInviteSubmit} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default UserAccessTabs;
