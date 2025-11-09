
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Clock,
  RefreshCw,
  XCircle
} from "lucide-react";
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
import { UserInvite, userRoleLabels } from "@/types/user";
import { formatDistanceToNow, format } from "date-fns";

interface PendingInvitesProps {
  invites: UserInvite[];
  onResendInvite: (inviteId: string) => void;
  onCancelInvite: (inviteId: string) => void;
}

const PendingInvites = ({
  invites,
  onResendInvite,
  onCancelInvite
}: PendingInvitesProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [inviteToCancel, setInviteToCancel] = useState<UserInvite | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const filteredInvites = invites.filter(invite =>
    invite.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invite.name.toLowerCase().includes(searchTerm.toLowerCase())
    // TODO: Add department search when department feature is implemented
    // || (invite.department && invite.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCancelClick = (invite: UserInvite) => {
    setInviteToCancel(invite);
    setShowCancelDialog(true);
  };

  const confirmCancel = () => {
    if (inviteToCancel) {
      onCancelInvite(inviteToCancel.id);
      setShowCancelDialog(false);
      setInviteToCancel(null);
    }
  };

  return (
    <>
      <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Pending KYC</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              {/* TODO: Implement department feature later */}
              {/* <TableHead className="hidden md:table-cell">Department</TableHead> */}
              <TableHead className="hidden md:table-cell">Added At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvites.length > 0 ? (
              filteredInvites.map((invite) => (
                <TableRow key={invite.id}>
                  <TableCell>{invite.name}</TableCell>
                  <TableCell>{invite.email}</TableCell>
                  <TableCell>{userRoleLabels[invite.role]}</TableCell>
                  {/* TODO: Implement department feature later */}
                  {/* <TableCell className="hidden md:table-cell">
                    {invite.department || "—"}
                  </TableCell> */}
                  <TableCell className="hidden md:table-cell">
                    {invite.addedAt
                      ? format(new Date(invite.addedAt), "MMMM dd, yyyy, h:mm a")
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* TODO: Implement resend invite functionality */}
                      {/* <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onResendInvite(invite.id)}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Resend</span>
                      </Button> */}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelClick(invite)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Remove</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No users pending KYC
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>

    {/* Cancel Invite Confirmation Dialog */}
    <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove <strong>{inviteToCancel?.name}</strong> ({inviteToCancel?.email}) from this business?
            This user will need to be re-invited to complete their onboarding.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setInviteToCancel(null)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirmCancel} className="bg-red-600 hover:bg-red-700">
            Remove User
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
  );
};

export default PendingInvites;
