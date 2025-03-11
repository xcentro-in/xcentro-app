
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
    <Header className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
          <CreditCard className="h-5 w-5 text-white" />
        </div>
        <span className={cn(
          "font-semibold text-lg transition-all duration-200",
          open ? "opacity-100" : "opacity-0 w-0"
        )}>
          PayStrive
        </span>
      </div>
      <SidebarTrigger className="rounded-full p-1.5 hover:bg-accent transition-colors">
        {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </SidebarTrigger>
    </Header>
  );
};
