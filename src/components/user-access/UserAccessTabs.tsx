
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users, Clock, Building, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { User, UserInvite } from "@/types/user";
import UserList from "./UserList";
import PendingInvites from "./PendingInvites";
import InviteUserForm from "./InviteUserForm";
import { toast } from "sonner";
import { userAPI, businessAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useBusinessUsers } from "@/hooks/useBusinessUsers";

interface UserAccessTabsProps {
  // Props are now optional - we fetch from API
  users?: User[];
  pendingInvites?: UserInvite[];
}

const UserAccessTabs = ({ users: propUsers, pendingInvites: propInvites }: UserAccessTabsProps) => {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToRevoke, setUserToRevoke] = useState<User | null>(null);
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);
  const [resendingInviteId, setResendingInviteId] = useState<string | null>(null);
  const [resendCooldowns, setResendCooldowns] = useState<Record<string, number>>({});
  const { userRoles } = useAuth();

  // State for business selection
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>("");
  const [businesses, setBusinesses] = useState<Array<{ id: string; name: string; isLoading: boolean }>>([]);

  // Cooldown timer for resend invites (60s between resends)
  useEffect(() => {
    const interval = setInterval(() => {
      setResendCooldowns(prev => {
        const updated = { ...prev };
        let hasChanges = false;

        Object.keys(updated).forEach(key => {
          if (updated[key] > 0) {
            updated[key] -= 1;
            hasChanges = true;
          }
        });

        return hasChanges ? updated : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Initialize businesses from userRoles
  useEffect(() => {
    const loadBusinessDetails = async () => {
      if (!userRoles || userRoles.length === 0) {
        setBusinesses([]);
        return;
      }

      // Set default selected business to first role's business
      if (!selectedBusinessId && userRoles.length > 0) {
        setSelectedBusinessId(userRoles[0].businessId);
      }

      // Initialize business list with loading states
      const initialBusinesses = userRoles.map(role => ({
        id: role.businessId,
        name: 'Loading...',
        isLoading: true,
      }));

      setBusinesses(initialBusinesses);

      // Load each business details individually
      for (const role of userRoles) {
        try {
          const response = await businessAPI.getBusiness(role.businessId);
          const businessData = response.data;

          setBusinesses(prev => prev.map(business =>
            business.id === role.businessId
              ? {
                  ...business,
                  name: businessData.name,
                  isLoading: false,
                }
              : business
          ));
        } catch (error) {
          console.error(`Failed to load business details for ${role.businessId}:`, error);
          setBusinesses(prev => prev.map(business =>
            business.id === role.businessId
              ? {
                  ...business,
                  name: 'Failed to load',
                  isLoading: false,
                }
              : business
          ));
        }
      }
    };

    loadBusinessDetails();
  }, [userRoles]);

  // Fetch users from API for selected business
  const {
    activeUsers: apiActiveUsers,
    pendingInvites: apiPendingInvites,
    isLoading,
    error,
    refetch
  } = useBusinessUsers(selectedBusinessId);

  // Use API data if available, fallback to props (for backward compatibility)
  const activeUsers = apiActiveUsers.length > 0 ? apiActiveUsers : (propUsers || []);
  const pendingInvites = apiPendingInvites.length > 0 ? apiPendingInvites : (propInvites || []);

  const handleInviteUser = () => {
    setEditingUser(null);
    setShowInviteForm(true);
  };

  const handleCancelInvite = () => {
    setShowInviteForm(false);
    setEditingUser(null);
  };

  const handleSubmitInvite = async (data: any) => {
    if (!selectedBusinessId) {
      toast.error("Please select a business first.");
      return;
    }

    setIsInviting(true);

    try {
      if (editingUser) {
        // Update existing user
        await userAPI.updateUserRole(
          selectedBusinessId,
          editingUser.id,
          data.role
        );

        toast.success(`User role updated successfully`);
        setShowInviteForm(false);
        setEditingUser(null);

        // Update frontend state instead of refetching
        const updatedActiveUsers = apiActiveUsers.map(user =>
          user.id === editingUser.id ? { ...user, role: data.role } : user
        );
        // Note: We'll update the state through the hook's internal state management
        // Since we can't directly set the hook's state, we refetch
        refetch();
      } else {
        // Invite new user
        const response = await userAPI.inviteUser(
          selectedBusinessId,
          data.email,
          data.name,
          data.mobile,
          data.role
        );

        toast.success(`Invitation sent to ${data.email}`);
        setShowInviteForm(false);

        // Refresh the user list to show the new pending invite
        refetch();
      }
    } catch (error: any) {
      console.error("Failed to process request:", error);
      toast.error(error?.message || "Failed to process request. Please try again.");
    } finally {
      setIsInviting(false);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowInviteForm(true);
  };

  const handleRevokeAccess = (userId: string) => {
    const user = activeUsers.find(u => u.id === userId);
    if (user) {
      setUserToRevoke(user);
      setShowRevokeDialog(true);
    }
  };

  const confirmRevokeAccess = async () => {
    if (!userToRevoke || !selectedBusinessId) {
      return;
    }

    try {
      await userAPI.removeUser(selectedBusinessId, userToRevoke.id);

      toast.success(`${userToRevoke.name} has been removed from the business`);
      setShowRevokeDialog(false);
      setUserToRevoke(null);

      // Refetch to update the list
      refetch();
    } catch (error: any) {
      console.error("Failed to revoke user access:", error);
      toast.error(error?.message || "Failed to revoke access. Please try again.");
    }
  };

  const handleCancelInvitation = async (inviteId: string) => {
    if (!selectedBusinessId) {
      return;
    }

    try {
      await userAPI.removeUser(selectedBusinessId, inviteId);

      const invite = pendingInvites.find(i => i.id === inviteId);
      toast.success(`${invite?.name || 'User'} has been removed from the business`);

      // Refetch to update the list
      refetch();
    } catch (error: any) {
      console.error("Failed to cancel invitation:", error);
      toast.error(error?.message || "Failed to cancel invitation. Please try again.");
    }
  };

  const handleResendInvitation = async (inviteId: string) => {
    if (!selectedBusinessId) {
      toast.error("Please select a business first.");
      return;
    }

    // Check cooldown
    if (resendCooldowns[inviteId] > 0) {
      toast.error(`Please wait ${resendCooldowns[inviteId]}s before resending`);
      return;
    }

    // Find the invite to get the email
    const invite = pendingInvites.find(i => i.id === inviteId);
    if (!invite) {
      toast.error("Invite not found");
      return;
    }

    setResendingInviteId(inviteId);

    try {
      const response = await userAPI.resendInvite(selectedBusinessId, invite.email);
      toast.success(response.message || "Invitation email resent successfully");

      // Set 60s cooldown for this invite
      setResendCooldowns(prev => ({ ...prev, [inviteId]: 60 }));
    } catch (error: any) {
      console.error("Failed to resend invitation:", error);

      if (error.status === 429) {
        // Rate limit error - set cooldown based on retry-after
        const retryAfter = error.retryAfter || 60;
        setResendCooldowns(prev => ({ ...prev, [inviteId]: retryAfter }));
      } else if (error.status === 400 && error.message?.includes("already activated")) {
        toast.error("User has already activated their account. No need to resend.");
      } else if (error.status === 404) {
        toast.error("User not found in this business");
      } else {
        toast.error(error?.message || "Failed to resend invitation. Please try again.");
      }
    } finally {
      setResendingInviteId(null);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading users...</span>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-red-500 mb-4">Failed to load users: {error.message}</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <>
      <div>
        {showInviteForm ? (
          <InviteUserForm
            onInviteSubmit={handleSubmitInvite}
            onCancel={handleCancelInvite}
            isSubmitting={isInviting}
            editMode={!!editingUser}
            editUser={editingUser ? {
              id: editingUser.id,
              name: editingUser.name,
              email: editingUser.email,
              role: editingUser.role,
            } : undefined}
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
                Active ({activeUsers.length})
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending KYC ({pendingInvites.length})
              </TabsTrigger>
              </TabsList>
              <Select value={selectedBusinessId} onValueChange={setSelectedBusinessId}>
                <SelectTrigger className="w-[240px]">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <SelectValue placeholder="Select business" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {businesses.map((business) => (
                    <SelectItem key={business.id} value={business.id} disabled={business.isLoading}>
                      {business.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <TabsContent value="users">
              <UserList
                users={activeUsers}
                onEditUser={handleEditUser}
                onRevokeAccess={handleRevokeAccess}
              />
            </TabsContent>

            <TabsContent value="pending">
              <PendingInvites
                invites={pendingInvites}
                onCancelInvite={handleCancelInvitation}
                onResendInvite={handleResendInvitation}
                resendingInviteId={resendingInviteId}
                resendCooldowns={resendCooldowns}
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>

    {/* Revoke User Confirmation Dialog */}
    <AlertDialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove <strong>{userToRevoke?.name}</strong> from this business?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setUserToRevoke(null)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirmRevokeAccess} className="bg-red-600 hover:bg-red-700">
            Remove User
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
  );
};

export default UserAccessTabs;
