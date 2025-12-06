
import { Building, CreditCard, ChevronLeft, ChevronRight, Plus, Check, AlertCircle, ChevronDown, Loader2 } from "lucide-react";
import { SidebarHeader as Header, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useBusiness } from "@/contexts/BusinessContext";
import { businessTypeToFrontend } from "@/lib/businessTypeMapping";

export const SidebarHeader = () => {
  const { open } = useSidebar();
  const navigate = useNavigate();
  const { selectedBusiness, availableBusinesses, switchBusiness, isLoading } = useBusiness();
  
  const hasMultipleBusinesses = availableBusinesses.length > 1;

  const handleBusinessSwitch = async (businessId: string) => {
    try {
      await switchBusiness(businessId);
      const business = availableBusinesses.find(b => b.bid === businessId);
      if (business) {
        toast.success(`Switched to ${business.name}`);
      }
    } catch (error) {
      toast.error("Failed to switch business");
    }
  };

  const handleAddBusiness = () => {
    navigate("/business-onboarding");
  };

  // Show loading state
  if (isLoading || !selectedBusiness) {
    return (
      <Header className="flex flex-col gap-2 px-4 py-3 border-b border-border">
        <div className={cn("flex items-center gap-2 w-full text-sm", !open && "justify-center")}>
          <div className="flex h-5 w-5 items-center justify-center">
            <Loader2 className="h-3 w-3 animate-spin" />
          </div>
          {open && <span className="text-muted-foreground">Loading business...</span>}
        </div>
      </Header>
    );
  }

  return (
    <Header className="flex flex-col gap-2 px-4 py-3 border-b border-border">
      {/* Business Switcher */}
      {hasMultipleBusinesses ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={cn("flex items-center gap-2 text-sm outline-none w-full", !open && "justify-center")}>
              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10">
                <Building className="h-3 w-3 text-primary" />
              </div>
              {open && (
                <div className="flex flex-col items-start">
                  <span className="font-medium">{selectedBusiness.name}</span>
                  <span className="text-xs text-muted-foreground">{businessTypeToFrontend[selectedBusiness.businessType]}</span>
                </div>
              )}
              {open && <ChevronDown className="h-4 w-4 text-muted-foreground ml-1" />}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {availableBusinesses.map((business) => (
              <DropdownMenuItem
                key={business.bid}
                onClick={() => handleBusinessSwitch(business.bid)}
                className={cn(
                  "flex items-center gap-2",
                  business.bid === selectedBusiness.bid && "bg-accent"
                )}
              >
                <Building className="h-4 w-4" />
                <div className="flex flex-col flex-grow">
                  <span>{business.name}</span>
                  <span className="text-xs text-muted-foreground">{business.businessType}</span>
                </div>
                <Badge variant="success" className="ml-auto text-[9px] px-1.5 py-0 h-4">
                  <Check className="h-2 w-2 mr-0.5" /> Verified
                </Badge>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleAddBusiness} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Business
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className={cn("flex items-center gap-2 w-full text-sm", !open && "justify-center")}>
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10">
            <Building className="h-3 w-3 text-primary" />
          </div>
          {open && (
            <div className="flex flex-col items-start">
              <span className="font-medium">{selectedBusiness.name}</span>
              <span className="text-xs text-muted-foreground">{businessTypeToFrontend[selectedBusiness.businessType]}</span>
            </div>
          )}
        </div>
      )}
    </Header>
  );
};
