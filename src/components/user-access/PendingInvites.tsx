
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

  const filteredInvites = invites.filter(invite =>
    invite.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (invite.department && invite.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Pending Invites</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search invites..."
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
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden md:table-cell">Department</TableHead>
              <TableHead className="hidden md:table-cell">Invited By</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvites.length > 0 ? (
              filteredInvites.map((invite) => (
                <TableRow key={invite.id}>
                  <TableCell>{invite.email}</TableCell>
                  <TableCell>{userRoleLabels[invite.role]}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {invite.department || "—"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{invite.invitedBy}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-orange-500" />
                      <span title={format(new Date(invite.expiresAt), 'PPP p')}>
                        {formatDistanceToNow(new Date(invite.expiresAt), { addSuffix: true })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onResendInvite(invite.id)}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Resend</span>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onCancelInvite(invite.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Cancel</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No pending invites found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PendingInvites;
