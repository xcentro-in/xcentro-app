import React, { useState, useMemo, useEffect } from "react";
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
  Star,
  StarIcon,
  Eye,
  SquareArrowOutUpRight
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
import { Payee, PayeeType } from "@/types/payee";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PayeeDetailsDrawer } from "./PayeeDetailsDrawer";
import { usePayees } from "@/hooks/usePayees";
import { EmptyPayees } from "./EmptyPayees";
import { useAuth } from "@/contexts/AuthContext";
import TablePagination from "@/components/payee-history/TablePagination";

interface PayeeListProps {
  onAddPayee?: () => void;
}

const PayeeList = ({ onAddPayee }: PayeeListProps) => {
  const navigate = useNavigate();
  const { user, optimisticallyUpdateOnboardingFlag } = useAuth();
  const [searchValue, setSearchValue] = useState("");
  const [typeFilter, setTypeFilter] = useState<PayeeType | "all">("all");
  const [deletePayeeId, setDeletePayeeId] = useState<string | null>(null);
  const [selectedPayeeForDrawer, setSelectedPayeeForDrawer] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Always fetch payees - verification logic will handle flag updates
  const { payees, totalCount, isLoading, error, updatePayee, deletePayee: deletePayeeFromApi } = usePayees({
    page,
    page_size: pageSize,
    search: searchValue,
    typeFilter: typeFilter === 'all' ? undefined : typeFilter
  });

  // Verification: Check if payees exist while flag is false, then flip flag
  useEffect(() => {
    if (!isLoading && !error && user) {
      // If flag is false BUT we have payees, optimistically update the flag
      if (!user.hasAddedVendor && totalCount > 0) {
        optimisticallyUpdateOnboardingFlag('hasAddedVendor', true);
      }
    }
  }, [isLoading, error, totalCount, user, optimisticallyUpdateOnboardingFlag]);

  // Show empty state if NO payees exist (regardless of flag)
  if (!isLoading && !error && totalCount === 0) {
    return <EmptyPayees onAddPayee={onAddPayee} />;
  }

  const handleSetDefault = async (id: string) => {
    try {
      await updatePayee(id, { isDefault: true });
      toast.success("Default payee updated");
    } catch (err) {
      toast.error("Failed to update default payee");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePayeeFromApi(id);
      toast.success("Payee deleted successfully");
    } catch (err) {
      toast.error("Failed to delete payee");
    }
  };

  const handleViewHistory = (payeeId: string) => {
    navigate(`/payees/${payeeId}`);
  };

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1); // Reset to first page when changing page size
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  // Remove frontend filtering - backend handles it now via API params
  // const filteredPayees = useMemo(() => {
  //   return payees.filter(payee => {
  //     const matchesSearch = payee.name.toLowerCase().includes(searchValue.toLowerCase());
  //     const matchesType = typeFilter === "all" || payee.type === typeFilter;
  //     return matchesSearch && matchesType;
  //   });
  // }, [payees, searchValue, typeFilter]);

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

  const selectedPayee = payees.find(p => p.id === selectedPayeeForDrawer);

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="text-muted-foreground mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-end justify-between">
        <div className="flex-1 flex gap-4">
          <div className="relative w-full sm:w-64">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search payees..."
              className="pl-8"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setPage(1); // Reset to first page on search
              }}
            />
          </div>

          <Select value={typeFilter} onValueChange={(value) => {
            setTypeFilter(value as PayeeType | "all");
            setPage(1); // Reset to first page on filter change
          }}>
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

        {/* Page size selector - only show when total count > 10 */}
        {totalCount > 10 && (
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => handlePageSizeChange(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {payees.length === 0 ? (
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
              {payees.map((payee) => (
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
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleViewHistory(payee.id)}
                      >
                        <SquareArrowOutUpRight className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setSelectedPayeeForDrawer(payee.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination controls - only show when total count > 10 */}
      {payees.length > 0 && totalCount > 10 && (
        <div className="flex justify-center mt-4">
          <TablePagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalCount}
            itemsPerPage={pageSize}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <div className="bg-soft-gray p-4 rounded-lg border border-gray-200 text-secondary-purple text-sm">
        <div className="flex items-center gap-3">
          <StarIcon className="h-5 w-5 text-sidebar-primary" />
          <p>
            Marking a payee as a favorite makes them easier to find during payments and helps us surface better insights for you.
          </p>
        </div>
      </div>

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

      <PayeeDetailsDrawer 
        payee={selectedPayee || null}
        isOpen={!!selectedPayeeForDrawer}
        onClose={() => setSelectedPayeeForDrawer(null)}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default PayeeList;
