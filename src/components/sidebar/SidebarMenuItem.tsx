
import { Link, useLocation } from "react-router-dom";
import { 
  SidebarMenuItem as MenuItem,
  SidebarMenuButton,
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
      <SidebarMenuButton
        isActive={isActive}
        tooltip={!open ? title : undefined}
        asChild
      >
        <Link to={url} className="flex items-center gap-3">
          <Icon className={cn(
            "h-5 w-5",
            isActive ? 
              "text-primary" : 
              "text-muted-foreground"
          )} />
          <span className={cn(
            "transition-opacity duration-200",
            open ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
          )}>
            {title}
          </span>
        </Link>
      </SidebarMenuButton>
    </MenuItem>
  );
};
