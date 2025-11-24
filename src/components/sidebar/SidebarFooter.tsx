
import { UserCog } from "lucide-react";
import { 
  SidebarFooter as Footer,
  useSidebar
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useBusiness } from "@/contexts/BusinessContext";

export const SidebarFooter = () => {
  const { open } = useSidebar();
  const { selectedBusiness } = useBusiness();

  const formatRole = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Footer className="mt-auto p-4">
      <div className={cn(
        "flex items-center gap-3",
        open ? "opacity-100" : "opacity-0"
      )}>
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {selectedBusiness ? selectedBusiness.name : "Business Account"}
          </span>
          <span className="text-xs text-muted-foreground">
            {selectedBusiness ? formatRole(selectedBusiness.userRole) : "Loading..."}
          </span>
        </div>
      </div>
    </Footer>
  );
};
