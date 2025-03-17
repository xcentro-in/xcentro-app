
import { useState } from "react";
import { ChevronDown, Plus, Building, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { toast } from "sonner";

// Mock data for businesses
const mockBusinesses = [
  {
    id: "1",
    name: "Acme Corp",
    logo: "AC",
    active: true,
    verified: true,
  },
  {
    id: "2",
    name: "Beta Industries",
    logo: "BI",
    active: false,
    verified: true,
  },
  {
    id: "3",
    name: "Gamma Enterprises",
    logo: "GE",
    active: false,
    verified: false,
    pendingVerification: true,
  },
];

export const BusinessSwitcher = () => {
  const navigate = useNavigate();
  const { open } = useSidebar();
  const [activeBusiness, setActiveBusiness] = useState(mockBusinesses.find(b => b.active));

  const handleBusinessSwitch = (businessId: string) => {
    // In a real app, this would update the global state and possibly make an API call
    toast.success(`Switched to ${mockBusinesses.find(b => b.id === businessId)?.name}`);
    setActiveBusiness(mockBusinesses.find(b => b.id === businessId));
  };

  const handleAddNewBusiness = () => {
    navigate("/settings/business/new");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 w-full text-left">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <span className="text-white font-semibold">
              {activeBusiness?.logo || "AC"}
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="font-semibold text-lg truncate">
              {activeBusiness?.name || "PayStrive"}
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[220px]">
        <DropdownMenuLabel>Your Businesses</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {mockBusinesses.map((business) => (
          <DropdownMenuItem
            key={business.id}
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              business.pendingVerification && "opacity-70"
            )}
            disabled={business.pendingVerification}
            onClick={() => !business.pendingVerification && handleBusinessSwitch(business.id)}
          >
            <div className={cn(
              "h-6 w-6 rounded-md flex items-center justify-center",
              business.active ? "bg-primary" : "bg-muted"
            )}>
              <span className={cn(
                "text-xs font-semibold",
                business.active ? "text-white" : "text-muted-foreground"
              )}>
                {business.logo}
              </span>
            </div>
            <span className="flex-1 truncate">{business.name}</span>
            {business.active && <Check className="h-4 w-4 text-primary" />}
            {business.pendingVerification && (
              <span className="text-xs text-amber-500">Pending</span>
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="flex items-center gap-2 cursor-pointer text-primary"
          onClick={handleAddNewBusiness}
        >
          <Plus className="h-4 w-4" />
          <span>Add New Business</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
