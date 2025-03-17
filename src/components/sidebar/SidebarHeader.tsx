
import { CreditCard, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { 
  SidebarHeader as Header,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { BusinessSwitcher } from "./BusinessSwitcher";

export const SidebarHeader = () => {
  const { open } = useSidebar();

  return (
    <Header className="flex flex-col py-3 border-b border-border">
      <div className={cn(
        "flex items-center justify-between px-4",
        !open && "w-full justify-center" // Full width and center when collapsed
      )}>
        {open && (
          <>
            <BusinessSwitcher />
          </>
        )}
        <SidebarTrigger className={cn(
          "flex items-center justify-center p-1 rounded-md hover:bg-accent transition-colors",
          !open && "mx-auto" // Center when collapsed
        )}>
          {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </SidebarTrigger>
      </div>
    </Header>
  );
};
