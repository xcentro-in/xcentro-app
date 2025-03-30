
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  MoreHorizontal, 
  Edit, 
  UserX, 
  ShieldCheck, 
  AlertTriangle,
  Search,
  X
} from "lucide-react";
import { User, userRoleLabels } from "@/types/user";
import { formatDistanceToNow } from "date-fns";

interface UserListProps {
  users: User[];
  onEditUser: (user: User) => void;
  onRevokeAccess: (userId: string) => void;
}

const UserList = ({ users, onEditUser, onRevokeAccess }: UserListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesRole = !roleFilter || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getUserStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500"><ShieldCheck className="h-3 w-3 mr-1" /> Active</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500"><AlertTriangle className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'revoked':
        return <Badge variant="destructive"><UserX className="h-3 w-3 mr-1" /> Revoked</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setRoleFilter(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Select
            value={roleFilter || ""}
            onValueChange={(value) => setRoleFilter(value || null)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Roles</SelectItem>
              {Object.entries(userRoleLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleResetFilters}>
            Reset
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden md:table-cell">Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Last Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {userRoleLabels[user.role]}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.department || "—"}
                  </TableCell>
                  <TableCell>
                    {getUserStatusBadge(user.status)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.lastActive 
                      ? formatDistanceToNow(new Date(user.lastActive), { addSuffix: true }) 
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditUser(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600" 
                          onClick={() => onRevokeAccess(user.id)}
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          Revoke Access
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No users found matching your search criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserList;
