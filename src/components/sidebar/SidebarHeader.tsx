
import { CreditCard, ChevronLeft, ChevronRight } from "lucide-react";
import { 
  SidebarHeader as Header,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export const SidebarHeader = () => {
  const { open } = useSidebar();

  return (
    <Header className="flex items-center justify-between px-4 py-3 border-b border-border">
      <div className={cn(
        "flex items-center gap-2",
        !open && "w-full justify-center" // Full width and center when collapsed
      )}>
        {open && (
          <>
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-lg">
              PayStrive
            </span>
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
