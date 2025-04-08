import { Building, CreditCard, ChevronLeft, ChevronRight, Plus, Check, AlertCircle } from "lucide-react";
import { SidebarHeader as Header, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { mockBusinesses } from "@/data/mockBusinesses";
import { toast } from "sonner";

export const SidebarHeader = () => {
  const { open } = useSidebar();
  const navigate = useNavigate();
  const [currentBusiness, setCurrentBusiness] = useState(mockBusinesses[0]);

  const handleBusinessSwitch = (businessId: string) => {
    const business = mockBusinesses.find(b => b.id === businessId);
    if (business) {
      setCurrentBusiness(business);
      toast.success(`Switched to ${business.name}`);
    }
  };

  const handleAddBusiness = () => {
    navigate("/business-onboarding");
  };

  return (
    <Header className="flex flex-col gap-2 px-4 py-3 border-b border-border">
      {/* Business Switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 w-full text-sm outline-none">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10">
              <Building className="h-3 w-3 text-primary" />
            </div>
            {open && (
              <div className="flex flex-col items-start">
                <span className="font-medium">{currentBusiness.name}</span>
                <span className="text-xs text-muted-foreground">{currentBusiness.type}</span>
              </div>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-60">
          {mockBusinesses.map((business) => (
            <DropdownMenuItem
              key={business.id}
              onClick={() => handleBusinessSwitch(business.id)}
              className="flex items-center gap-2"
            >
              <Building className="h-4 w-4" />
              <div className="flex flex-col">
                <span>{business.name}</span>
                <span className="text-xs text-muted-foreground">{business.type}</span>
              </div>
              {business.id === currentBusiness.id && (
                <Check className="h-4 w-4 ml-auto" />
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleAddBusiness} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Business
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Header>
  );
};