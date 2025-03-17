
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Building, 
  Plus, 
  MoreHorizontal, 
  Pencil, 
  Users, 
  Trash2, 
  ChevronRight, 
  AlertTriangle 
} from "lucide-react";
import { toast } from "sonner";

// Mock business data
const mockBusinesses = [
  {
    id: "1",
    name: "Acme Corp",
    type: "Private Limited",
    pan: "AAAAA0000A",
    active: true,
    verified: true,
    users: 8,
  },
  {
    id: "2",
    name: "Beta Industries",
    type: "Sole Proprietorship",
    pan: "BBBBB0000B",
    active: false,
    verified: true,
    users: 3,
  },
  {
    id: "3",
    name: "Gamma Enterprises",
    type: "Limited Liability Partnership",
    pan: "CCCCC0000C",
    active: false,
    verified: false,
    pendingVerification: true,
    users: 0,
  },
];

const BusinessManagementSettings = () => {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState(mockBusinesses);
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredBusinesses = businesses.filter(
    business => business.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddBusiness = () => {
    navigate("/settings/business/new");
  };
  
  const handleDelete = (id: string) => {
    setBusinesses(businesses.filter(business => business.id !== id));
    toast.success("Business removed successfully");
  };
  
  const handleSetActive = (id: string) => {
    // In a real app, this would make an API call
    toast.success(`${businesses.find(b => b.id === id)?.name} set as active business`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Business Management</h2>
          <p className="text-muted-foreground">
            Manage all your businesses in one place
          </p>
        </div>
        <Button onClick={handleAddBusiness} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Business
        </Button>
      </div>
      
      <div className="flex w-full max-w-sm items-center space-x-2 mb-6">
        <Input
          placeholder="Search businesses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="grid gap-4">
        {filteredBusinesses.map(business => (
          <Card key={business.id} className={business.active ? "border-primary border-2" : ""}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                    <Building className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      {business.name}
                      {business.active && (
                        <span className="bg-primary/10 text-primary text-xs rounded-full px-2 py-1">
                          Active
                        </span>
                      )}
                      {business.pendingVerification && (
                        <span className="bg-amber-500/10 text-amber-500 text-xs rounded-full px-2 py-1 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Pending Verification
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {business.type} • PAN: {business.pan}
                    </CardDescription>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {!business.active && !business.pendingVerification && (
                      <DropdownMenuItem 
                        onClick={() => handleSetActive(business.id)}
                        className="cursor-pointer"
                      >
                        Switch to this business
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem 
                      className="cursor-pointer"
                      onClick={() => navigate(`/settings/business/${business.id}`)}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit details
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="cursor-pointer"
                      onClick={() => navigate(`/settings/business/${business.id}/users`)}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Manage users
                    </DropdownMenuItem>
                    {!business.active && (
                      <DropdownMenuItem 
                        className="text-destructive cursor-pointer" 
                        onClick={() => handleDelete(business.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove business
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 py-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Users</Label>
                  <div className="flex items-center gap-1 mt-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{business.users} team members</span>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <div className="flex items-center gap-1 mt-1">
                    {business.verified ? (
                      <span className="text-green-500">Verified</span>
                    ) : business.pendingVerification ? (
                      <span className="text-amber-500">Pending Verification</span>
                    ) : (
                      <span className="text-red-500">Not Verified</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-between"
                onClick={() => navigate(`/settings/business/${business.id}`)}
              >
                Manage Business
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
        
        {filteredBusinesses.length === 0 && (
          <div className="text-center p-8 border rounded-lg">
            <div className="flex justify-center mb-2">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <Building className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-medium mb-1">No businesses found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? `No businesses matching "${searchQuery}"`
                : "You haven't added any businesses yet"}
            </p>
            <Button onClick={handleAddBusiness} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Business
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessManagementSettings;
