
import { Link, useLocation } from "react-router-dom";
import { 
  SidebarMenuItem as MenuItem,
  useSidebar
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SidebarMenuItemProps {
  title: string;
  url: string;
  icon: LucideIcon;
}

export const SidebarMenuItemComponent = ({ title, url, icon: Icon }: SidebarMenuItemProps) => {
  const { open } = useSidebar();
  const location = useLocation();
  const isActive = location.pathname === url;

  return (
    <MenuItem key={title}>
      <Link 
        to={url}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
          isActive ? 
            "bg-accent font-medium" : 
            "hover:bg-accent/50"
        )}
      >
        <Icon className={cn(
          "h-5 w-5",
          isActive ? 
            "text-primary" : 
            "text-muted-foreground"
        )} />
        <span className={cn(
          "transition-all duration-200",
          open ? "opacity-100" : "opacity-0 w-0"
        )}>
          {title}
        </span>
      </Link>
    </MenuItem>
  );
};
