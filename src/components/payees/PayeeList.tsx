
import { useState, useEffect } from "react";
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
  BanknoteIcon,
  LightbulbIcon,
  UsersIcon,
  Edit,
  Trash,
  Star,
  StarIcon,
  History,
  MoreVertical,
  Loader2
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
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { fetchPayees, PayeeRelation } from "@/services/payeeService";
import { PayeeFilters } from "./PayeeFilters";
import TablePagination from "@/components/payments/TablePagination";

type PayeeTypeFilter = "all" | "employee" | "vendor" | "biller";

const PayeeList = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [typeFilter, setTypeFilter] = useState<PayeeTypeFilter>("all");
  const [payees, setPayees] = useState<PayeeRelation[]>([]);
  const [deletePayeeId, setDeletePayeeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch payees from API
  useEffect(() => {
    const loadPayees = async () => {
      setIsLoading(true);
      try {
        const response = await fetchPayees({
          page: currentPage,
          page_size: itemsPerPage,
          search: searchValue || undefined,
          payee_type: typeFilter !== "all" ? typeFilter : undefined,
        });

        setPayees(response.data);
        setTotalCount(response.total_count);
      } catch (error) {
        toast.error("Failed to load payees", {
          description: "Please try again later",
        });
        console.error("Error loading payees:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPayees();
  }, [currentPage, itemsPerPage, searchValue, typeFilter]);

  const handleSetDefault = (id: string) => {
    setPayees(prev =>
      prev.map(payee => ({
        ...payee,
        is_favorite: payee.relation_id === id ? true : payee.is_favorite
      }))
    );
    toast.success("Favorite payee updated");
  };

  const handleDelete = (id: string) => {
    setPayees(prev => prev.filter(payee => payee.relation_id !== id));
    toast.success("Payee deleted successfully");
  };

  const handleViewHistory = (payeeId: string) => {
    navigate(`/payees/${payeeId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value as PayeeTypeFilter);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  const getPayeeIcon = (type: string) => {
    switch (type) {
      case "vendor":
        return <BanknoteIcon className="h-4 w-4 text-blue-500" />;
      case "biller":
        return <LightbulbIcon className="h-4 w-4 text-yellow-500" />;
      case "employee":
        return <UsersIcon className="h-4 w-4 text-green-500" />;
      default:
        return <BanknoteIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPayeeTypeBadge = (type: string) => {
    switch (type) {
      case "vendor":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Vendor</Badge>;
      case "biller":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Biller</Badge>;
      case "employee":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Employee</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <PayeeFilters
        searchValue={searchValue}
        itemsPerPage={itemsPerPage}
        typeFilter={typeFilter}
        onSearchChange={handleSearchChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        onTypeFilterChange={handleTypeFilterChange}
      />

      {/* Loading state */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : payees.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No payees found. Try adjusting your search or add a new payee.
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Phone</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payees.map((payee) => (
                  <TableRow key={payee.relation_id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getPayeeIcon(payee.payee_type)}
                        <span>{payee.display_name}</span>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 ml-2"
                                onClick={() => handleSetDefault(payee.relation_id)}
                              >
                                {payee.is_favorite ? (
                                  <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                ) : (
                                  <Star className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {payee.is_favorite ? "Favourite payee" : "Make it favourite"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                    <TableCell>{getPayeeTypeBadge(payee.payee_type)}</TableCell>
                    <TableCell className="hidden md:table-cell">{payee.contact_email}</TableCell>
                    <TableCell className="hidden lg:table-cell">{payee.contact_phone}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewHistory(payee.payee_id)}>
                            <History className="h-4 w-4 mr-2" />
                            View History
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeletePayeeId(payee.relation_id)}>
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

          {/* Pagination */}
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalCount}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            itemName="payees"
          />
        </>
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
