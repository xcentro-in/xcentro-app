
import { UserCog } from "lucide-react";
import { 
  SidebarFooter as Footer,
  useSidebar
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export const SidebarFooter = () => {
  const { open } = useSidebar();

  return (
    <Footer className="mt-auto p-4">
      <div className={cn(
        "flex items-center gap-3",
        open ? "opacity-100" : "opacity-0"
      )}>
        {/* <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
          <UserCog className="h-5 w-5 text-primary" />
        </div> */}
        <div className="flex flex-col">
          <span className="text-sm font-medium">Business Account</span>
          <span className="text-xs text-muted-foreground">Admin Access</span>
        </div>
      </div>
    </Footer>
  );
};
