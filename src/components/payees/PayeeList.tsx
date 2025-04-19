
import { useState, useMemo } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BanknoteIcon, 
  LightbulbIcon, 
  UsersIcon, 
  SearchIcon, 
  Edit, 
  Trash, 
  Star, 
  StarIcon,
  History,
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { mockPayees } from "@/data/mockPayees";
import { Payee, PayeeType } from "@/types/payee";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const PayeeList = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [typeFilter, setTypeFilter] = useState<PayeeType | "all">("all");
  const [payees, setPayees] = useState(mockPayees);
  const [deletePayeeId, setDeletePayeeId] = useState<string | null>(null);

  const handleSetDefault = (id: string) => {
    setPayees(prev => 
      prev.map(payee => ({
        ...payee,
        isDefault: payee.id === id ? true : payee.isDefault
      }))
    );
    toast.success("Default payee updated");
  };

  const handleDelete = (id: string) => {
    setPayees(prev => prev.filter(payee => payee.id !== id));
    toast.success("Payee deleted successfully");
  };

  const handleViewHistory = (payeeId: string) => {
    navigate(`/payees/${payeeId}`);
  };

  const filteredPayees = useMemo(() => {
    return payees.filter(payee => {
      const matchesSearch = payee.name.toLowerCase().includes(searchValue.toLowerCase());
      const matchesType = typeFilter === "all" || payee.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [payees, searchValue, typeFilter]);

  const getPayeeIcon = (type: PayeeType) => {
    switch (type) {
      case "bank":
        return <BanknoteIcon className="h-4 w-4 text-blue-500" />;
      case "biller":
        return <LightbulbIcon className="h-4 w-4 text-yellow-500" />;
      case "payroll":
        return <UsersIcon className="h-4 w-4 text-green-500" />;
    }
  };

  const getPayeeTypeBadge = (type: PayeeType) => {
    switch (type) {
      case "bank":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Bank</Badge>;
      case "biller":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Biller</Badge>;
      case "payroll":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Payroll</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-end justify-between">
        <div className="relative w-full sm:w-64">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search payees..."
            className="pl-8"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        
        <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as PayeeType | "all")}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="bank">Bank</SelectItem>
            <SelectItem value="biller">Biller</SelectItem>
            <SelectItem value="payroll">Payroll</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredPayees.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No payees found. Try adjusting your search or add a new payee.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayees.map((payee) => (
                <TableRow key={payee.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {getPayeeIcon(payee.type)}
                      <span>{payee.name}</span>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 ml-2" 
                              onClick={() => handleSetDefault(payee.id)}
                            >
                              {payee.isDefault ? (
                                <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              ) : (
                                <Star className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {payee.isDefault ? "Favourite payee" : "Make it favourite"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                  <TableCell>{getPayeeTypeBadge(payee.type)}</TableCell>
                  <TableCell className="hidden md:table-cell">{payee.email}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewHistory(payee.id)}>
                          <History className="h-4 w-4 mr-2" />
                          View History
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeletePayeeId(payee.id)}>
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={!!deletePayeeId} onOpenChange={() => setDeletePayeeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this payee?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the payee and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (deletePayeeId) {
                handleDelete(deletePayeeId);
                setDeletePayeeId(null);
              }
            }}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PayeeList;
