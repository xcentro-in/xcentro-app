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
  SquareArrowOutUpRight,
  Info
} from "lucide-react";
import { Payee, PayeeType } from "@/types/payee";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PayeeDetailsDrawer } from "./PayeeDetailsDrawer";
import { usePayees } from "@/hooks/usePayees";
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { EmptyPayees } from "./EmptyPayees";
import { useAuth } from "@/contexts/AuthContext";
import TablePagination from "@/components/payee-history/TablePagination";
import { payeesAPI } from "@/services/api";
import { trackEvent } from "@/lib/analytics";

interface PayeeListProps {
  onAddPayee?: () => void;
}

const PayeeList = ({ onAddPayee }: PayeeListProps) => {
  const navigate = useNavigate();
  const { user, optimisticallyUpdateOnboardingFlag } = useAuth();
  const { businessId, businessName } = useCurrentBusiness();
  const [searchValue, setSearchValue] = useState("");
  const [typeFilter, setTypeFilter] = useState<PayeeType | "all">("all");
  const [activeFilter, setActiveFilter] = useState<boolean>(true); // Default to active
  const [selectedPayeeForDrawer, setSelectedPayeeForDrawer] = useState<string | null>(null);

  // Optimistic updates: Track removed payees and their data for rollback
  const [optimisticallyRemovedPayees, setOptimisticallyRemovedPayees] = useState<Map<string, Payee>>(new Map());

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Always fetch payees - verification logic will handle flag updates
  const { payees, totalCount, isLoading, error, updatePayee } = usePayees({
    page,
    page_size: pageSize,
    search: searchValue,
    typeFilter: typeFilter === 'all' ? undefined : typeFilter,
    isActive: activeFilter
  });

  // Filter out optimistically removed payees
  const visiblePayees = payees.filter(payee => !optimisticallyRemovedPayees.has(payee.id));

  // Clear optimistically removed payees when switching tabs or changing filters
  useEffect(() => {
    setOptimisticallyRemovedPayees(new Map());
  }, [activeFilter, typeFilter, searchValue, page]);

  // Verification: Check if payees exist while flag is false, then flip flag
  useEffect(() => {
    if (!isLoading && !error && user) {
      // If flag is false BUT we have payees, optimistically update the flag
      if (!user.hasAddedVendor && totalCount > 0) {
        optimisticallyUpdateOnboardingFlag('hasAddedVendor', true);
      }
    }
  }, [isLoading, error, totalCount, user, optimisticallyUpdateOnboardingFlag]);

  // Show onboarding state only if user has never added payees AND no payees exist
  // If hasAddedVendor is true, show normal page even if current filter has no results
  if (!isLoading && !error && !user?.hasAddedVendor && totalCount === 0) {
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

  const handleStatusChange = async (id: string, isActive: boolean) => {
    if (!businessId) {
      toast.error("Business ID not available");
      return;
    }

    // Find the payee being changed
    const payeeToChange = payees.find(p => p.id === id);
    if (!payeeToChange) {
      toast.error("Payee not found");
      return;
    }

    // Optimistically remove the payee from the list immediately
    setOptimisticallyRemovedPayees(prev => {
      const newMap = new Map(prev);
      newMap.set(id, payeeToChange);
      return newMap;
    });

    // Close the drawer immediately
    setSelectedPayeeForDrawer(null);

    try {
      // Make the API call in the background
      await payeesAPI.updateStatus(id, isActive);
      trackEvent(isActive ? 'payee_activated' : 'payee_deactivated');

      // On success: show success toast, payee stays removed (it's in the other tab now)
      toast.success(isActive ? "Payee marked as active" : "Payee marked as inactive");
    } catch (err: any) {
      // On failure: rollback by removing from optimistically removed list
      setOptimisticallyRemovedPayees(prev => {
        const newMap = new Map(prev);
        newMap.delete(id);
        return newMap;
      });

      toast.error(err.message || "Failed to update payee status");
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
      case "vendor":
        return <BanknoteIcon className="h-4 w-4 text-blue-500" />;
      case "biller":
        return <LightbulbIcon className="h-4 w-4 text-yellow-500" />;
      case "employee":
        return <UsersIcon className="h-4 w-4 text-green-500" />;
    }
  };

  const getPayeeTypeBadge = (type: PayeeType) => {
    switch (type) {
      case "vendor":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Vendor</Badge>;
      case "biller":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Biller</Badge>;
      case "employee":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Employee</Badge>;
    }
  };

  const selectedPayee = visiblePayees.find(p => p.id === selectedPayeeForDrawer);

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
        <div className="flex-1 flex flex-wrap gap-4">
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
              <SelectItem value="vendor">Vendor</SelectItem>
              {/* <SelectItem value="biller">Biller</SelectItem> */} 
              <SelectItem value="employee">Employee</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              variant={activeFilter === true ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setActiveFilter(true);
                setPage(1);
              }}
            >
              Active
            </Button>
            <Button
              variant={activeFilter === false ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setActiveFilter(false);
                setPage(1);
              }}
            >
              Inactive
            </Button>
          </div>
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

      {/* Info message for inactive payees */}
      {activeFilter === false && visiblePayees.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-800">
            Inactive payees don't appear while creating bill or making a payment.
          </p>
        </div>
      )}

      {visiblePayees.length === 0 ? (
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
              {visiblePayees.map((payee) => (
                <TableRow key={payee.id} className={!payee.isActive ? "opacity-50" : ""}>
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
      {visiblePayees.length > 0 && totalCount > 10 && (
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

      <PayeeDetailsDrawer
        payee={selectedPayee || null}
        isOpen={!!selectedPayeeForDrawer}
        onClose={() => setSelectedPayeeForDrawer(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default PayeeList;
