import { CreditCard, ChevronLeft, ChevronRight, Plus, Check, AlertCircle, Building } from "lucide-react";
import { SidebarHeader as Header, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { mockBusinesses } from "@/data/mockBusinesses";
import { toast } from "sonner";
export const SidebarHeader = () => {
  const {
    open
  } = useSidebar();
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
  return <Header className="flex flex-col gap-2 px-4 py-3 border-b border-border">

      {/* Business Switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className={cn("flex items-center justify-between w-full px-2 py-1.5 rounded-md text-sm font-medium hover:bg-accent transition-colors", !open && "justify-center")}>
            <div className={cn("flex items-center gap-2", !open && "flex-col")}>
              <div className="h-6 w-6 rounded bg-indigo-100 flex items-center justify-center">
                <Building className="h-3.5 w-3.5 text-indigo-600" />
              </div>
              {open && <>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium leading-none truncate max-w-[130px]">
                      {currentBusiness.name}
                    </span>
                    <span className="text-xs text-muted-foreground leading-tight">
                      {currentBusiness.status === "verified" ? <span className="flex items-center gap-1 text-green-600">
                          <Check className="h-3 w-3" /> Verified
                        </span> : <span className="flex items-center gap-1 text-amber-600">
                          <AlertCircle className="h-3 w-3" /> Pending
                        </span>}
                    </span>
                  </div>
                </>}
            </div>
            {open && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="right" className="w-60">
          {mockBusinesses.map(business => <DropdownMenuItem key={business.id} className={cn("flex items-center gap-2 py-2 px-3 cursor-pointer", business.id === currentBusiness.id && "bg-accent")} onClick={() => handleBusinessSwitch(business.id)}>
              <div className="h-8 w-8 rounded bg-indigo-100 flex items-center justify-center">
                <Building className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{business.name}</span>
                <span className="text-xs text-muted-foreground">
                  {business.status === "verified" ? <span className="flex items-center gap-1 text-green-600">
                      <Check className="h-3 w-3" /> Verified
                    </span> : <span className="flex items-center gap-1 text-amber-600">
                      <AlertCircle className="h-3 w-3" /> Pending
                    </span>}
                </span>
              </div>
            </DropdownMenuItem>)}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center gap-2 py-2 px-3 cursor-pointer text-primary" onClick={handleAddBusiness}>
            <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
              <Plus className="h-4 w-4 text-primary" />
            </div>
            <span className="font-medium">Add New Business</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Header>;
};